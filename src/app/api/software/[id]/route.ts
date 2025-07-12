import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.$transaction(async (prisma) => {
      await prisma.activityLog.deleteMany({
        where: { softwareId: id },
      });
      await prisma.comment.deleteMany({
        where: { softwareId: id },
      });
      await prisma.summary.deleteMany({
        where: { softwareId: id },
      });
      await prisma.software.delete({
        where: { id },
      });
    });
    return NextResponse.json({
      message: "Software and related data deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete error:", error);

    if (error.code === "P2003") {
      return new NextResponse(
        "Cannot delete software because it is still referenced by other records. " +
          "Please ensure all related activity logs, comments, and summaries are removed first.",
        { status: 409 }
      );
    }
    else if (error.code === "P2025") {
      return new NextResponse("Software not found or already deleted.", {
        status: 404,
      });
    }
    return new NextResponse(
      "Failed to delete software due to an unexpected error.",
      { status: 500 }
    );
  }
}
