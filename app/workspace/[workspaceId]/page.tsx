"use client";

import Docs from "@/components/Custom/workspace/Docs";
import Whiteboard from "@/components/Custom/workspace/Whiteboard";
import WorkspaceHeader from "@/components/Custom/workspace/WorkspaceHeader";
import { useParams } from "next/navigation";
import { useState } from "react";

function WorkSpacePage() {
  const [activeTab, setActiveTab] = useState("Whiteboard");

  const params = useParams<{ workspaceId: string }>();
  const projectId = params.workspaceId;

  console.log("Project ID from URL:", projectId);

  return (
    <div>
      <WorkspaceHeader
        selectedTab={(value: string) => setActiveTab(value)}
      />

      {activeTab === "Whiteboard" ? (
        <Whiteboard key={projectId} projectId={projectId} />
      ) : (
        <Docs />
      )}
    </div>
  );
}

export default WorkSpacePage;
