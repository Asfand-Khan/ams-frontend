"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import NavLogo from "@/components/ui/sidebar/nav-logo"
import NavMain from "@/components/ui/sidebar/nav-main"
import NavLogout from "@/components/ui/sidebar/nav-logout"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/shadcn/sidebar"
import { MenuPermission } from "@/types/verifyOtpTypes"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [menus, setMenus] = useState<MenuPermission[]>([])

  useEffect(() => {
    const localMenus = localStorage.getItem("menus")
    if (localMenus) {
      try {
        const parsed = JSON.parse(localMenus)
        setMenus(parsed)
      } catch (error) {
        console.error("Error parsing localStorage menus:", error)
      }
    }
  }, [])

  const organizeMenu = useCallback((menus: MenuPermission[]) => {
    // Add items array to each menu item
    const menusWithChildren = menus.map(item => ({ ...item, items: [] as MenuPermission[] }));

    // Separate top-level items and children
    const result: MenuPermission[] = [];
    menusWithChildren.forEach((item: MenuPermission) => {
      if (!item.parent_id) {
        result.push(item);
      } else {
        const parent = menusWithChildren.find(p => p.menu_id === item.parent_id);
        if (parent) parent.items.push(item);
      }
    });

    // Sort top-level items and their children by sorting field
    result.sort((a, b) => a.sorting - b.sorting);
    result.forEach(parent => parent.items!.sort((a, b) => a.sorting - b.sorting));

    return result;
  }, []);

  const organizedMenus = useMemo(() => organizeMenu(menus), [menus, organizeMenu]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menusData={organizedMenus} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavLogout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
