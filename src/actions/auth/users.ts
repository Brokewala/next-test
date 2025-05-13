// "use cache"

import { UserType } from "@/src/lib/queryClient";
import { host } from "@/src/lib/service_api";
// import { unstable_cacheLife as cacheLife } from "next/cache";

/// RECUPERER TOUS LES UTILISATEURS
export const getClientsAction = async () => {
    const res = await fetch("/api/" + 'user/info', {
      method: 'GET',
      // next: {
      //   tags: ['clients'],
      //   revalidate: 3600
      // },
      // cache: 'force-cache'
    });
  
    if (res.ok) {
      const data = await res.json();
      return data as { "users": Array<UserType>, "count": number };
    }
  }

// RECUPERER UN UTILISATEUR
// interface TokenType {
//   token: string
// }
export const getOneUserAction = async (token: FormData) => {
  const req = await fetch(host + "user/info", {
    method: "POST",
    body: token
    // next: {
    //   revalidate: 6000
    // }
  });

  // cacheLife("days");

  if (req.ok) {
    const data = await req.json();
    return data as UserType;
  }
}