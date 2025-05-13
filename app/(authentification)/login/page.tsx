"use client";

import { loginAction } from '@/src/actions/auth/auth';
import { LayoutClient } from '@/src/layouts/LayoutClient';
import { useGetUserConnect } from '@/src/lib/requests/userUserRequest';
import { createSession } from '@/src/lib/session';
import ButtonPrimary from '@/src/shared/Button/ButtonPrimary';
import FormItem from '@/src/shared/FormItem';
import Input from '@/src/shared/Input/Input';
import { ArrowLeft, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
  const navigation = useRouter();
  const router = useRouter();
  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (user_connecte?.role === "CLIENT") {
      router.push("/");
    }
  }

  const [input, setinput] = React.useState({
    email: "",
    password: ""
  });

  const [loading, setloading] = React.useState(false);

  const handleLogin = () => {
    setloading(true);
    if (input.email !== "" && input.password !== "") {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);

      loginAction(formData)
        .then(res => {
          setloading(false);
          createSession(res.token);
          if (res.role === "ADMIN") {
            navigation.push("/admin/dashboard");
          } else {
            navigation.push("/");
          }
        })
        .catch(err => {
          setloading(false);
          if (err.message === 'Unable to login')
            alert('Email ou mot de passe incorrect')
        })
    } else {
      setloading(false);
    }
  }

  return (
    <LayoutClient>
      <div className="w-full flex justify-center items-center nc-PageLogin" data-nc-id="PageLogin">
        <div className="container mx-auto px-8 mb-24 lg:mb-32">
          <div className="w-full flex justify-center">
            <div className="flex flex-row gap-6 items-center">
              <ArrowLeft className="h-6 w-6 text-neutral-500" onClick={() => router.back()} />
              <h2 className="my-12 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
                Se connecter
              </h2>
            </div>
          </div>
          <div className="mx-auto max-w-md">
            <div className="space-y-6">
              <div className="grid gap-6">
                <FormItem label="Adresse email">
                  <Input
                    type="email"
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    placeholder="example@example.com"
                    className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    onChange={(e) => setinput({ ...input, email: e.target.value })}
                  />
                </FormItem>
                <FormItem label="Mot de passe">
                  <Input
                    type="password"
                    rounded="rounded-full"
                    sizeClass="h-12 px-4 py-3"
                    className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                    onChange={(e) => setinput({ ...input, password: e.target.value })}
                  />
                </FormItem>

                <ButtonPrimary
                  onClick={() => handleLogin()} disabled={loading}
                  className='py-4'
                >
                  {loading ? <Loader2Icon className='animate-spin' />
                    :
                    "Se connecter"
                  }
                </ButtonPrimary>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                {/* <Link href="/forgot-pass" className="text-sm text-primary">
                  Forgot password
                </Link> */}
                <span className="block text-center text-sm text-neutral-500">
                  Vous n&apos;avez pas de compte ? {` `}
                  <Link href="/sign-in" className="text-primary">
                    Inscrivez-vous
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
}
