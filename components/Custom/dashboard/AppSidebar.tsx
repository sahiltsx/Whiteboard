"use client"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Archive, LayoutGrid, Settings, Sparkles, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import NewBoard from "./NewBoard"
export function AppSidebar() {
  const { user, isLoaded } = useUser()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/Logo/logo.svg" alt="Logo" width={30} height={30} />
          <h2 className="text-xl font-bold">WhizBoard</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <NewBoard/>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>My Boards</SidebarGroupLabel>
          <SidebarMenuButton className="p-4 text-neutral-500 text-sm">
            <LayoutGrid />
            <span>All Files</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-4 mt-1.5 text-neutral-500 text-sm">
            <User />
            <span>Shared</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-4 mt-1.5 text-neutral-500 text-sm">
            <Archive />
            <span>Archived</span>
          </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenuButton className="p-4 text-neutral-500">
            <Sparkles />
            <span>AI helper</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-4 text-neutral-500">
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3 my-2 border rounded-md">
          <h2 className="text-sm flex justify-between text-muted-foreground">
            2 files created <span>total</span>
          </h2>
          <Progress value={50} className="mt-1.5 h-2" />
        </div>

        {isLoaded && user && (
          <div className="flex items-center gap-2 p-3 border rounded-md">
            <Image
              src={user.imageUrl}
              alt="User Logo"
              width={30}
              height={30}
              className="rounded-full" 
            />
            <span className="text-sm truncate">{user.fullName}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}