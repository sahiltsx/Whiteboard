import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'

function AppHeader() {
  return (
    <div className='p-4 border border-neutral-100'>
      <SidebarTrigger/>
    </div>
  )
}

export default AppHeader
