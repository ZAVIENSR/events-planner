import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },

      include: {
        user: {
          select: { name: true, email: true },
        },
        rsvps: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },

        _count: {
          select: { rsvps: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({
        error: 'Event not found',
        status: 404,
      });
    }

    const session = await auth();

    if (!event.isPublic && event.userId !== session?.user?.id) {
      return NextResponse.json({
        error: 'Unauthorized access to private event',
        status: 403,
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('error fetching event', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500,
    });
  }
}
