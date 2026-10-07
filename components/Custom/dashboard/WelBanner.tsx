"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react';


function WelBanner() {
    const {user}=useUser();

  return (
    <div>
        <div className='p-9 border m-5 rounded-xl bg-linear-to-r from-blue-200 to-purple-200'>
            <h2 className='text-2xl font-bold'>Welcome back ,{user?.fullName}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>Bring your ideas to life on infinite canvas</p>
             <div className='mt-5 flex items-center gap-2 '>
                 <Button className="bg-blue-600 hover:bg-blue-700" size="lg">+ Create New Board</Button>
                 <Button variant="outline" size="lg"><Sparkles/>AI Helper</Button>
             </div>
        </div>
    </div>
  )
}

export default WelBanner
