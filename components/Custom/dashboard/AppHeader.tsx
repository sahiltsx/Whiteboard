import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'

function AppHeader() {
  return (
    <div className='p-3 border border-neutral-100 flex justify-between'>
      <SidebarTrigger/>
      <UserButton/>
    </div>
  )
}

export default AppHeader
