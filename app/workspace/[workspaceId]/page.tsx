"use client"

import WorkspaceHeader from "@/components/Custom/workspace/WorkspaceHeader"
import { useState } from "react"
function WorkSpacePage() {
  const[activeTab,setActiveTab]=useState('Whiteboard')
  return (
    <div>
       <WorkspaceHeader selectedTab={(value:string)=>setActiveTab(value)}/>
    </div>
  )
}

export default WorkSpacePage
