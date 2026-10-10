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

    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { id: user.id, email },
    });

    // Use the id of the row that actually exists in the database.
    const board = await prisma.board.create({
      data: {
        projectId,
        projectName,
        createdById: dbUser.id,
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