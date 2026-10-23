import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    const { projectId, elements, appState, files } = await req.json();
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ message: "Project information missing" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const board = await prisma.board.findUnique({
      where: { projectId },
      select: { createdById: true },
    });
    if (!board) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    if (board.createdById !== dbUser.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const data = {
      elements: elements ?? [],
      appState: appState ?? {},
      files: files ?? {},
    };

    const result = await prisma.whiteboardData.upsert({
      where: { projectId },
      create: { projectId, ...data },
      update: data,
      select: { updatedAt: true },
    });

    return NextResponse.json({ message: "Saved", updatedAt: result.updatedAt });
  } catch (error) {
    console.error("Whiteboard save failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json({ message: "Project information missing" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const board = await prisma.board.findUnique({
      where: { projectId },
      select: { createdById: true },
    });
    if (!board) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    if (board.createdById !== dbUser.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const whiteboard = await prisma.whiteboardData.findUnique({
      where: { projectId },
      select: { elements: true, appState: true, files: true, updatedAt: true },
    });

    return NextResponse.json({
      elements: whiteboard?.elements ?? [],
      appState: whiteboard?.appState ?? {},
      files: whiteboard?.files ?? {},
      updatedAt: whiteboard?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("Whiteboard load failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
