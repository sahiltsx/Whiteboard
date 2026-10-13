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


  return (
    <div>
      <WorkspaceHeader
        selectedTab={(value: string) => setActiveTab(value)}
      />
      <div className={activeTab === "Whiteboard" ? "" : "hidden"}>
           <Whiteboard projectId={projectId} />
      </div>

      <div className={activeTab === "docs" ? "" : "hidden"}>
        {/* Docs content */}
      </div>

    </div>
  );
}

export default WorkSpacePage;
