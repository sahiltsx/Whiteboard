import { AppSidebar } from "@/components/Custom/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default function DashboardLayout({children}:{children:React.ReactNode}){
    return (
        <SidebarProvider>
            <AppSidebar/>
        <div>
            <SidebarTrigger/>
            {children}
        </div>
        </SidebarProvider>
    )
}