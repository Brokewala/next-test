"use client"

import { getClientsAction } from "@/src/actions/auth/users";
import { useEffect, useState } from "react";
import { UserType } from "../queryClient";
import { verifySession } from "../session";

export const useGetClients = () => {
    const [users, setUsers] = useState<Array<UserType>>([]);
    const [count, setcount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getClientsAction();
        if (data) {
          setUsers(data.users);
          setcount(data.count);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    }

    fetchData();
  }, []);

  return {
        users,
        count
    }
}

/// GET USER
export const useGetUserConnect = () => {
  const [user_connecte, setuser_connecte] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const session = await verifySession();
      setuser_connecte(session?.userId as UserType);
    }
    fetchData();
  }, []);

  return { user_connecte }
}