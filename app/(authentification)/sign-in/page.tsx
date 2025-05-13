"use client";

import { LayoutClient } from "@/src/layouts/LayoutClient";
import useShopStore from "@/src/lib/store/shopStore";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import Input from "@/src/shared/Input/Input";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import * as Yup from "yup";
import { useServerAction } from "zsa-react";
import { signInAction } from "../../../src/actions/auth/auth";

const validationSchema = Yup.object({
  first_name: Yup.string().required("Le nom est requis"),
  last_name: Yup.string().required("Le prénom est requis"),
  adress: Yup.string().required("L'adresse est requise"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Le numéro de téléphone doit contenir 10 chiffres")
    .required("Le numéro de téléphone est requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Les mots de passe doivent correspondre")
    .required("La confirmation du mot de passe est requise"),
});

export default function Page() {
  const router = useRouter();

  const isLoggedIn = useShopStore((state) => state.isAuthenticated);
  const user_connecte = useShopStore((state) => state.currentUser);

  React.useEffect(() => {
    if (isLoggedIn) {
      if (user_connecte?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user_connecte]);

  const { isPending, execute } = useServerAction(signInAction);

  return (
    <LayoutClient>
      <div className="w-full flex justify-center items-center nc-PageLogin" data-nc-id="PageLogin">
        <div className="container mx-auto px-8 mb-24 lg:mb-32">
          <div className="w-full flex justify-center">
            <div className="flex flex-row gap-6 items-center">
              <ArrowLeft className="h-6 w-6 text-neutral-500" onClick={() => router.back()} />
              <h2 className="my-12 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
                S&apos;inscrire
              </h2>
            </div>
          </div>
          <div className="mx-auto max-w-md">
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                adress: "",
                email: "",
                phone: "",
                password: "",
                confirm_password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                  formData.append(key, value);
                });
                const [err] = await execute(formData);

                if (err) {
                  setErrors((err as { fieldErrors?: Record<string, string> }).fieldErrors || {});
                  setSubmitting(false);
                  return;
                }
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6">
                    <div>
                      <Field
                        as={Input}
                        type="text"
                        name="first_name"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Entrer votre nom"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="first_name" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="text"
                        name="last_name"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Entrer votre prénom"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="last_name" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="text"
                        name="adress"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Entrer votre adresse"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="adress" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="email"
                        name="email"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="example@example.com"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="email" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="text"
                        name="phone"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Entrer votre numéro de téléphone"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="phone" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="password"
                        name="password"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Entrer votre mot de passe"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="password" component="p" className="text-xs text-red-600" />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        type="password"
                        name="confirm_password"
                        rounded="rounded-full"
                        sizeClass="h-12 px-4 py-3"
                        placeholder="Confirmer votre mot de passe"
                        className="border border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                      />
                      <ErrorMessage name="confirm_password" component="p" className="text-xs text-red-600" />
                    </div>
                    <ButtonPrimary
                      type="submit"
                      className="w-full py-3 flex justify-center items-center rounded-full"
                      disabled={isSubmitting || isPending || !isValid}
                    >
                      {isSubmitting || isPending ? (
                        <div className="flex flex-row gap-4 items-center">
                          <Loader2Icon className="animate-spin" />
                          <p>Inscription...</p>
                        </div>
                      ) : (
                        "M'inscrire"
                      )}
                    </ButtonPrimary>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="block text-center text-sm text-neutral-500">
                      J&apos;ai deja un compte !{" "}
                      <Link href="/login" className="text-primary">
                        Me connecter
                      </Link>
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
}