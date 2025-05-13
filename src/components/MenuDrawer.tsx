"use client";

import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import Text from "./ui/text";
import ButtonNavigate from "@/src/lib/buttonNavigate";
import { BoxesIcon, LayoutDashboard, LogOutIcon, ShoppingBasketIcon, ShoppingCartIcon } from "lucide-react";
import { deleteSession } from "../lib/session";
import useAdminStore from "../lib/store/adminStore";
// import LoadLogOut from "./LoadLogOut";

const MenuDrawer = ({ open, setloadLogOut }: { open: boolean; setloadLogOut: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const logout = useAdminStore.getState().logout;

  const deconnexion = () => {
    localStorage.removeItem('shop-store');
    localStorage.removeItem('admin-store');
    logout();
    setloadLogOut(true);
    deleteSession();
  };


  return (
    <ScrollArea className="w-full h-full p-4 relative">
      <div className="flex flex-col gap-2">
        <ButtonNavigate path="/admin/dashboard" className="w-full">
          <div className="w-full py-4 rounded-md flex flex-row gap-4">
            <LayoutDashboard strokeWidth={1.5} />
            {open && <Text format="p">Dashboard</Text>}
          </div>
        </ButtonNavigate>

        <ButtonNavigate path="/admin/produits">
          <div className="w-full py-4 rounded-md flex flex-row gap-4">
            <ShoppingBasketIcon strokeWidth={1.5} />
            {open && <Text format="p">Mes produits</Text>}
          </div>
        </ButtonNavigate>

        <ButtonNavigate path="/admin/categories">
          <div className="w-full py-4 rounded-md flex flex-row gap-4">
            <BoxesIcon strokeWidth={1.5} />
            {open && <Text format="p">Catégories</Text>}
          </div>
        </ButtonNavigate>

        <ButtonNavigate path="/admin/commandes">
          <div className="w-full py-4 rounded-md flex flex-row gap-4">
            <ShoppingCartIcon strokeWidth={1.5} />
            {open && <Text format="p">Commandes</Text>}
          </div>
        </ButtonNavigate>
      </div>

      <div className="w-full absolute bottom-4 left-0 px-4">
        {/* <ButtonNavigate path="/" deconnect> */}
        <div className="w-full py-4 rounded-md flex flex-row gap-4 cursor-pointer" onClick={() => deconnexion()}>
          <LogOutIcon strokeWidth={1.5} />
          {open && <Text format="p">Se déconnecter</Text>}
        </div>
        {/* </ButtonNavigate> */}
      </div>

      {/* {loadLogOut && */}
      {/* <LoadLogOut /> */}
      {/* } */}
    </ScrollArea>
  );
};

export default MenuDrawer;
