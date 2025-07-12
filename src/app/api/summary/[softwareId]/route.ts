import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { softwareId: string } }
) {
  try {
    const summary = await prisma.summary.findUnique({
      where: { softwareId: params.softwareId },
    });
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET summary error:", error);
    return new NextResponse("Error fetching summary", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { softwareId: string } }
) {
  try {
    const body = await req.json();
    const { summary, nextSteps, deadline } = body;

    const updated = await prisma.summary.upsert({
      where: { softwareId: params.softwareId },
      update: { summary, nextSteps, deadline },
      create: {
        softwareId: params.softwareId,
        summary,
        nextSteps,
        deadline,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT summary error:", error);
    return new NextResponse("Error updating summary", { status: 500 });
  }
}
