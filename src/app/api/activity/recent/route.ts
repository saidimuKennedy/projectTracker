import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { date: "desc" },
      take: 10,
      include: {
        software: { select: { name: true } },
      },
    });

    const safeLogs = recentLogs.map((log) => ({
      id: log.id,
      description: log.description,
      actionType: log.actionType,
      createdAt: log.date.toISOString(),
      software: {
        name: log.software.name,
      },
    }));

    return NextResponse.json(safeLogs);
  } catch (error) {
    console.error("API Error - GET /activity/recent", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
