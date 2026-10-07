"use client"

import { Folder, Ghost } from "lucide-react";
import { useState } from "react"
import { Button } from "@/components/ui/button";

function ProjectList() {
 
  const[projectList,setProjectList]=useState("");
  return (
    <div>
      {projectList.length===0 ? (
        <div className="flex flex-col items-center p-9 border rounded-md gap-2 m-5">
         <Folder className="h-15 w-15"/>
         <h2 className="text-2xl font-bold">No Boards Found</h2>
          <p className="text-muted-foreground">Create your first board to start brainstorming,planning!</p>
          <Button variant="outline" >Create New Board</Button>
        </div>
      ):
        <div>
         {/* Project list */}
        </div>
      }
    </div>
  )
}

export default ProjectList
