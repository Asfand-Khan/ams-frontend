import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/shadcn/sidebar'
import Link from 'next/link'
import Image from 'next/image'

const NavLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-transparent active:bg-transparent h-12"
          asChild
        >
          <Link href="/">
            <div className="hidden aspect-square size-8 rounded-md overflow-hidden transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:flex">
              <Image src="/images/favicon.ico" width={32} height={32} className='w-full h-full' alt="favicon" />
            </div>
            <div className="flex aspect-square mx-auto w-28 h-12 transition-[width,height,margin] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
              <Image src="/images/logo.svg" width={112} height={48} className='w-full h-full' alt="logo" />
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavLogo