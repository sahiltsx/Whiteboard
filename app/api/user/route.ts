import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest ,NextResponse} from "next/server";


export async function POST(req:NextRequest){
   try {
      const user= await currentUser();
      if(!user){
        return NextResponse.json({
            message:"unauthorized access"
        },{
            status:401
        })
      }
      const email=user.primaryEmailAddress?.emailAddress;
      if(!email){
        return NextResponse.json({
            message:"Email not found"
        },{
            status:400
        })
      }
      const existingUser=await prisma.user.findUnique({
        where:{email}
      })
      if(existingUser){
        return NextResponse.json(existingUser);
      }
      const newUser=await prisma.user.create({
        data:{
            email,
            name:user.fullName??"",
        }
      });
      return NextResponse.json(newUser);

   } catch (error) {
    console.log(error)

    return NextResponse.json({
        message:"Internal server error"
    },{
        status:500
    })
   }
}