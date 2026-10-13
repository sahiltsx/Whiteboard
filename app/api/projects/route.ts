import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getDbUser } from "@/app/lib/getdbUser";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await getDbUser();

    if (!dbUser) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { projectName } = await req.json();

    const trimmedName =
      typeof projectName === "string" ? projectName.trim() : "";

    if (!trimmedName) {
      return NextResponse.json(
        { message: "projectName is required" },
        { status: 400 }
      );
    }

    if (trimmedName.length > 30) {
      return NextResponse.json(
        { message: "projectName must be 30 characters or fewer" },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        projectId: randomUUID(),
        projectName: trimmedName,
        createdById: dbUser.id,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Project create failed:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}