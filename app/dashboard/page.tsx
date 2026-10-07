import ProjectList from "@/components/Custom/dashboard/ProjectList";
import WelBanner from "@/components/Custom/dashboard/WelBanner";

export default function Dashboard(){
    return(
        <div>
          {/* Welcome Banner */}
          <WelBanner/>

          {/* empty and project list */}
          <ProjectList/>
        </div>
    )
}