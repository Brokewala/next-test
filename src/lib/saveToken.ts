'use server'
 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getOneUserAction } from '../actions/auth/users';
 
export async function createCookie(data: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
 
  cookieStore.set('access_token', data, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  
  // cookieStore.set({
  //   name: 'name',
  //   value: 'lee',
  //   httpOnly: true,
  //   path: '/',
  // })
}

export async function deleteCookie() {
  const cookieStore = await cookies();

  cookieStore.delete('access_token')

  redirect('/login')
}

export const verifySession = async () => {
  const cookie = (await cookies()).get('access_token')?.value;

  // console.log("=====>++++ ", cookie)
 
  return cookie
}

//
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
  
  try {
    const form = new FormData();
    form.append('token', session);
    const data = await getOneUserAction(form);
    console.log("HEY ===> ", session)
    return data;
  } catch (error) {
    console.log('Failed to fetch user', error)
    return null
  }
})