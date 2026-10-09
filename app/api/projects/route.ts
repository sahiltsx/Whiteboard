import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectName, projectId } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "No email found for this user" },
        { status: 400 }
      );
    }

    // Make sure the user exists in our User table, using Clerk's ID
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, email },
    });

   const board = await prisma.board.create({
  data: {
    projectId,
    projectName,
    createdById: user.id,
  },
  include: {
    createdBy: {
      select: { email: true },
    },
  },
});

    return NextResponse.json(board, { status: 201 });
    
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}