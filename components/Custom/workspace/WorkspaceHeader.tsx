"use client"

import Image from "next/image"
import { Tabs,TabsList,TabsTrigger } from "@/components/ui/tabs"




export default function WorkspaceHeader({selectedTab}:any) {
  return (
    <div className="p-3 border-b flex justify-between">
      <div className="flex gap-3 items-center">
           <Image src="/Logo/logo.svg" alt="Logo" width={30} height={30} />
           <h2 className="text-lg font-medium">Workspace name</h2>
      </div>
      <div>
        <Tabs 
        defaultValue="Whiteboard" className="w-100"
        onChange={(value)=>selectedTab(value)}
        >
             <TabsList>
                 <TabsTrigger value="Whiteboard">Whiteboard</TabsTrigger>
                 <TabsTrigger value="Docs">Docs</TabsTrigger>
             </TabsList>
       </Tabs>
      </div>
      <div>

      </div>
    </div>
  )
}

 
