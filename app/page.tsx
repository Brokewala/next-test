"use client"

import { LayoutClient } from "@/src/layouts/LayoutClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Category from "./(landingPage)/Category";
import Hero from "./(landingPage)/Hero";
import useShopStore from "@/src/lib/store/shopStore";

const Page = () => {
  const route = useRouter();

  // Load user data on component mount
  useEffect(() => {
    useShopStore.getState().loadUserData();
  }, []);

  const user_connecte = useShopStore((state) => state.currentUser);
  console.log("USER CONNECTE ===> ", user_connecte);

  useEffect(() => {
    if (user_connecte) {
      if (user_connecte?.role === "ADMIN") {
        route.push("/admin/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_connecte]);

  return (
    <LayoutClient>
      <div className="w-full h-full flex flex-col gap-20">
        <Hero />
        <Category />
        {/* <Guarantee /> */}
        {/* <BestSeller /> */}
        {/* <Hunder /> */}
        {/* <Footer /> */}
        {/* <Feature />
        <Collections />
        <div className="p-6">
        </div>
        */}
      </div>
    </LayoutClient>
  )
}

export default Page;