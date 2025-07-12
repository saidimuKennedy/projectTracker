import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ActionTypeEnum = z.enum(["added", "updated", "removed"]);

const activitySchema = z.object({
  softwareId: z.string(),
  actionType: ActionTypeEnum,
  description: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { softwareId, actionType, description } = activitySchema.parse(body);

    const activity = await prisma.activityLog.create({
      data: {
        softwareId,
        actionType,
        description,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    console.error("API Error - POST /activity", error);
    return NextResponse.json(
      { error: "Failed to create activity", details: error.message },
      { status: 400 }
    );
  }
}
