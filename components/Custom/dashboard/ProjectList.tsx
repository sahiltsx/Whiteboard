"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

function ProjectList() {
  const [projectList, setProjectList] = useState<any[]>([])

  return (
    <div>
      {projectList.length === 0 ? (
        <div className="flex flex-col items-center p-5 border rounded-md gap-2 m-7">
          <Image src="/folderpic.png" alt="Folder" width={80} height={80} />
          <h2 className="text-2xl font-bold">No Boards Found</h2>
          <p className="text-muted-foreground">
            Create your first board to start brainstorming, planning!
          </p>
          <Button variant="outline">Create New Board</Button>
        </div>
      ) : (
        <div>{/* Project list */}</div>
      )}
    </div>
  )
}

export default ProjectList