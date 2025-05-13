// import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import ButtonNavigate from "../lib/buttonNavigate";
import { CategoryMethode } from "../lib/CategoryMethode";
import { useGetCategories } from "../lib/requests/useCategoryRequest"
// import { NavigationMenu, NavigationMenuContent, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
// import Link from "next/link";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "./ui/menubar";
import Text from "./ui/text";

export default function NavBarClient() {
  const { categories } = useGetCategories();
  const categoryData = CategoryMethode(categories || []);

  return (
    <div className="w-full py-2  border-t border-zinc-200 flex justify-start items-center">
      <div className="w-fit h-full flex flex-col gap-4">
        <Text format='p' weight='800'>Catégories</Text>
        <Menubar className="border-none shadow-none">
          {categoryData && categoryData.map((category, index) => (
            <MenubarMenu key={index}>
              <MenubarTrigger>
                <ButtonNavigate path={`/categorie/${category.id}`}>
                  {category.nom}
                </ButtonNavigate>
              </MenubarTrigger>
              {
                category?.children && category?.children.length > 0 && (
                  <MenubarContent>
                    {
                      category.children?.map((child, i) => child.children && child.children?.length <= 0 ? (<MenubarItem key={i}>
                        {child.nom}
                      </MenubarItem>) : (
                        <MenubarSub key={i}>
                          <MenubarSubTrigger>{child.nom}</MenubarSubTrigger>
                          <MenubarSubContent>
                            {
                              child.children?.map((value, indice) => (
                                <MenubarItem key={indice}>{value.nom}</MenubarItem>
                              ))
                            }
                          </MenubarSubContent>
                        </MenubarSub>
                      ))
                    }
                  </MenubarContent>
                )
              }
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
    </div>
  )
}
