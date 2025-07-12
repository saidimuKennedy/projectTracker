import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  version: z.string(),
  developer: z.string(),
  stack: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const software = await prisma.software.create({
      data,
    });

    return NextResponse.json(software, { status: 201 });
  } catch (err: any) {
    console.error("API Error creating software:", err);
    return NextResponse.json(
      { message: "Failed to create software", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const software = await prisma.software.findMany();
    return NextResponse.json(software, { status: 200 });
  } catch (err: any) {
    console.error("API Error fetching softwares:", err);
    return NextResponse.json(
      { message: "Failed to fetch softwares", error: err.message },
      { status: 500 }
    );
  }
}

