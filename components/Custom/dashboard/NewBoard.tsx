import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { Plus } from "lucide-react"
import { useState } from "react"

function NewBoard() {
  const [workspaceName,setWorkspaceName]=useState("")

  const handleCreateWorkSpace=()=>{
    if(workspaceName.trim()=== ""||workspaceName.length>30){
      toast.add({
        type:"error",
        title:"Invalid Workspace Name",
        description:"Please enter a valid workspace name "
      })
    }
  }
  return (
    <Dialog>
      <DialogTrigger render={<Button/>}>
        <Plus /> Create New Board
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Whiteboard Workspace</DialogTitle>
          <DialogDescription>
            Give your workspace a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <Label htmlFor="workspace-name" className="text-neutral-500">Workspace name</Label>
          <Input
            id="workspace-name"
            placeholder="Enter a workspace name"
            className="placeholder:text-neutral-300"
            onChange={(e)=>setWorkspaceName(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button 
          disabled={workspaceName.length==0}
          onClick={handleCreateWorkSpace}
          >Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewBoard