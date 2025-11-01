import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    const userRSVPs = await prisma.rSVP.findMany({
      where: { userId: session?.user?.id },
      include: {
        event: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: 'asc',
        },
      },
    });

    return NextResponse.json(userRSVPs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user RSVPs' },
      { status: 500 }
    );
  }
}
