"use client"

import Image from "next/image"
import { Tabs,TabsList,TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Share } from "lucide-react"


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
        onValueChange={(value)=>selectedTab(value)}
        >
             <TabsList>
                 <TabsTrigger value="Whiteboard">Whiteboard</TabsTrigger>
                 <TabsTrigger value="Docs">Docs</TabsTrigger>
             </TabsList>
       </Tabs>
      </div>
      <div className="flex gap-2">
        <Button className="text-white bg-blue-500 hover:bg-blue-700"><Save/>Save</Button>
        <Button variant="outline"><Share/>Share</Button>
      </div>
    </div>
  )
}

 
