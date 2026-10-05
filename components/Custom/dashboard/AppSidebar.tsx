"use client"
import { Button } from "@/components/ui/button"
import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupLabel,SidebarHeader, SidebarMenuButton,}from "@/components/ui/sidebar"
import { Archive, LayoutGrid, User } from "lucide-react"
import Image from "next/image"

export function AppSidebar() {
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 ">
          <Image src="/Logo/logo.svg" alt="Logo" width={30} height={30}/>
          <h2 className="text-xl font-bold">WhizBoard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
         <Button>+ Create New Board</Button>
        </SidebarGroup>
        <SidebarGroup>
           <SidebarGroupLabel>My Boards</SidebarGroupLabel>
           <SidebarMenuButton className="p-4 text-neutral-500">
               <LayoutGrid/>
               <span> All Files</span>
           </SidebarMenuButton>
           <SidebarMenuButton className="p-4 mt-2 text-neutral-500">
               <User/>
               <span>Shared</span>
           </SidebarMenuButton>
           <SidebarMenuButton className="p-4 mt-2 text-neutral-500">
               <Archive/>
               <span>Archived</span>
           </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}