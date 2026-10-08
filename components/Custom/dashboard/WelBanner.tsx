"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react';
import NewBoard from './NewBoard';


function WelBanner() {
    const {user}=useUser();

  return (
    <div>
        <div className='p-9 border m-5 rounded-xl bg-linear-to-r from-blue-200 to-purple-200'>
            <div className='flex gap-2 mb-2'>
               <Sparkles className='text-violet-500 ' size={15}/> 
            <p className='text-xs text-violet-500'>Your creative workspace</p>
            </div>
            <h2 className='text-2xl font-bold'>Welcome back ,{user?.fullName}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>Turn your ideas into diagrams,notes and visuals on an infinite canvas.</p>
             <div className='mt-5 flex items-center gap-2 '>
                 <NewBoard/>
                 <Button variant="outline" size="lg"><Sparkles/>Ask AI</Button>
             </div>
        </div>
    </div>
  )
}

export default WelBanner
