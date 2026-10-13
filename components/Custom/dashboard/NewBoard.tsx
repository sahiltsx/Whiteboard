
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAX_NAME_LENGTH = 30;

interface CreatedBoard {
  projectId: string;
  projectName: string;
  createdAt: string;
}

function NewBoard() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState(false);

  const router = useRouter();

  const trimmedName = workspaceName.trim();

  const isValid =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_NAME_LENGTH;

  const handleCreateWorkspace = async () => {
    if (!isValid || isSubmitting) {
      if (!isValid) {
        toast.add({
          type: "error",
          title: "Invalid Workspace Name",
          description: `Please enter a name between 1 and ${MAX_NAME_LENGTH} characters.`,
        });
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<CreatedBoard>(
        "/api/projects",
        {
          projectName: trimmedName,
        }
      );

      const createdBoard = response.data;

      if (!createdBoard.projectId) {
        throw new Error("Project ID was not returned by the API.");
      }

      toast.add({
        type: "success",
        title: "Workspace created",
        description: `"${createdBoard.projectName}" is ready to use.`,
      });

      setWorkspaceName("");
      setDialog(false);

      router.push(`/workspace/${createdBoard.projectId}`);
    } catch (error) {
      console.error("Workspace creation failed:", error);

      toast.add({
        type: "error",
        title: "Could not create workspace",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Create New Board
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Whiteboard Workspace
          </DialogTitle>

          <DialogDescription>
            Give your workspace a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <Label
            htmlFor="workspace-name"
            className="text-neutral-500"
          >
            Workspace name
          </Label>

          <Input
            id="workspace-name"
            placeholder="Enter a workspace name"
            className="placeholder:text-neutral-300"
            value={workspaceName}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setWorkspaceName(e.target.value)}
            disabled={isSubmitting}
          />

          <p className="text-xs text-neutral-400">
            {workspaceName.length}/{MAX_NAME_LENGTH}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose
            render={
              <Button variant="outline" disabled={isSubmitting} />
            }
          >
            Cancel
          </DialogClose>

          <Button
            disabled={!isValid || isSubmitting}
            onClick={handleCreateWorkspace}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewBoard;
