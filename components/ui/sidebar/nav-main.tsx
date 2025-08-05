import * as Icons from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/shadcn/sidebar"
import Link from "next/link"
import { MenuPermission } from "@/types/verifyOtpTypes"
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NavMain = ({ menusData }: { menusData: MenuPermission[] }) => {

  const pathname = usePathname();
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menusData.map((item) => {
          const Icon = item.icon ? (Icons[item.icon as keyof typeof Icons] as React.ElementType) : null;
          const hasChildren = item.items?.length && item.items.length > 0;
          const panelIsOpen = openPanel === item.url;

          return (
            hasChildren ? (
              <Collapsible
                key={item.menu_id}
                open={panelIsOpen}
                onOpenChange={(open) => {
                  setOpenPanel(open ? item.url : null);
                }}
                className="group/collapsible"
                asChild
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.menu_name} data-active={pathname.startsWith(item.url)} className="cursor-pointer">
                      {Icon && <Icon />}
                      <span>{item.menu_name}</span>
                      <Icons.ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.menu_name}>
                          <SidebarMenuSubButton data-active={pathname === subItem.url} asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.menu_name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.menu_id}>
                <SidebarMenuButton tooltip={item.menu_name} className="cursor-pointer" asChild>
                  <Link href={item.url}>
                    {Icon && <Icon />}
                    <span>{item.menu_name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )
        }
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain