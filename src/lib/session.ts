"use server";

import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { secretKey } from './service_api';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getOneUserAction } from '../actions/auth/users';
import { toForm } from './utils';
import { UserType } from './queryClient';

const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: JWTPayload | undefined) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session', error)
  }
}
 
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'strict',
    path: '/',
  })
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('shop-store');
    localStorage.removeItem('admin-store');
  }
  
  redirect('/');
}

 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    return null;
  }

  const data = await getOneUserAction(toForm({ "token": session.userId as string }));
 
  return { isAuth: true, userId: data as UserType, cookie: session.userId as string }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
  
  try {
    const form = new FormData();
    form.append('token', session?.cookie as string);
    const data = await getOneUserAction(form);
    return data;
  } catch (error) {
    console.log('Failed to fetch user', error)
    return null
  }
})