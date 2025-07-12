
import { NextRequest, NextResponse } from 'next/server';
import  prisma from '@/lib/prisma'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ softwareId: string }> }
) {
  try {
    const { softwareId } = await params;

    const comments = await prisma.comment.findMany({
      where: { softwareId },
      orderBy: { createdAt: 'desc' },
      include: {
        software: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ softwareId: string }> }
) {
  try {
    const { softwareId } = await params;
    const body = await request.json();
    
    const { comment, author } = body;

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    if (!softwareId || softwareId === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid software ID' },
        { status: 400 }
      );
    }

    const software = await prisma.software.findUnique({
      where: { id: softwareId },
    });

    if (!software) {
      return NextResponse.json(
        { error: 'Software not found' },
        { status: 404 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        softwareId,
        comment,
        author: author || 'Anonymous',
      },
      include: {
        software: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}