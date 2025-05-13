// import { host } from "@/src/lib/service_api";

import { SignupFormSchema } from "@/src/lib/definitions";
import { host } from "@/src/lib/service_api";
import { createSession } from "@/src/lib/session";
import { toast } from "sonner";
import { createServerAction } from "zsa";
import { toForm } from '../../lib/utils';

export const loginAction = async (formdata: FormData) => {
  try {
    const response = await fetch("/api/" + "user/login", {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data', // ou 'application/json' si tu envoies des données JSON
      // },
      body: formdata,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Login failed with status:", response.status);
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Unable to login");
  }
};

/// S'INSCRIR
// const redirection = () => {
//     redirect("/");
// }

// export const signInAction = async (formdata: FormData) => {
//   try {
//     const response = await fetch(host + "user/signup", {
//       method: 'POST',
//       body: formdata,
//     });

//     if (response.ok) {
//       const data = await response.json();
//       createCookie(data.token);
//       redirection();
//       return data;
//     } else {
//       console.log("Login failed with status:", response.status);
//       throw new Error("Login failed");
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     throw new Error("Unable to login");
//   }
// };

// export async function signup(formData: FormData) {
//   // Validate form fields
//   const validatedFields = SignupFormSchema.safeParse({
//     first_name: formData.get('first_name'),
//     last_name: formData.get('last_name'),
//     adress: formData.get('adress'),
//     email: formData.get('email'),
//     password: formData.get('password'),
//   })
 
//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     }
//   }
 
//   try {
//     const response = await fetch(host + "user/signup", {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.ok) {
//       const data = await response.json();
//       await createSession(data.token)
//       redirection();
//       return data;
//     } else {
//       console.log("SignUp failed with status:", response.status);
//       throw new Error("SignUp failed");
//     }
//   } catch (error) {
//     console.error("Error during sign up:", error);
//     throw new Error("Unable to sign up");
//   }
// }

export const signInAction = createServerAction()
  .input(SignupFormSchema,
    {
      type: "formData", 
    }
  )
  .handler(async ({ input }) => {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(host + "user/signup", {
        method: 'POST',
        body: toForm(input),
      });
  
      if (response.status === 409) {
        toast.error("Cet email existe déjà", { position: "top-center" })
      }

      if (response.ok) {
        const data = await response.json();
        await createSession(data.token)
        toast("Utilisateur inscrit", { position: "top-center" });
        window.location.href = "/";

        // return data;
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      throw new Error("Unable to sign up");
    }
})