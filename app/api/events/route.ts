import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const filter = searchParams.get('filter') || undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        {
          description: { contains: search, mode: 'insensitive' },
        },
        {
          location: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    if (filter === 'upcoming') {
      where.date = { gte: new Date() };
    } else if (filter === 'past') {
      where.date = { lt: new Date() };
    }
    const events = await prisma.event.findMany({
      where: where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events.' },
      { status: 500 }
    );
  }
}
