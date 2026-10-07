import AppHeader from "@/components/Custom/dashboard/AppHeader";
import { AppSidebar } from "@/components/Custom/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default function DashboardLayout({children}:{children:React.ReactNode}){
    return (
        <SidebarProvider>
            <AppSidebar/>
        <div className="flex flex-1 flex-col">
           <AppHeader/>
            {children}
        </div>
        </SidebarProvider>
    )
}