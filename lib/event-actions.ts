'use server';

import { auth } from '@/auth';
import { z } from 'zod';
import { prisma } from './prisma';
import { ZodError } from 'zod/v3';
import { revalidateTag } from 'next/cache';
import { RSVPStatus } from '@prisma/client';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  maxAttendees: z.string().optional(),
  isPublic: z.string().optional(),
});

export async function createEvent(_: unknown, formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: 'Not Authenticated' };
    }

    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      maxAttendees: formData.get('maxAttendees') as string,
      isPublic: formData.get('isPublic') as string,
    };

    const validatedData = eventSchema.parse(rawData);

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: validatedData.isPublic === 'on' ? true : false,
        userId: session.user.id,
      },
    });

    return { success: true, eventId: event.id };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, message: 'Failed to create event', eventId: null };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: 'Not Authenticated' };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, message: 'Event not found' };
    }

    if (existingEvent.userId !== session?.user?.id) {
      return { success: false, message: 'Not Authorized' };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidateTag('events', '');

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to delete the event' };
  }
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Not Authenticated' };
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return { success: false, message: 'Event not found' };
    }

    if (existingEvent.userId !== session.user.id) {
      return { success: false, message: 'Event is not public' };
    }

    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId,
        },
      },
    });

    if (existingRSVP) {
      await prisma.rSVP.update({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },

        data: {
          status,
        },
      });
    } else {
      await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          eventId,
          status,
        },
      });
    }

    revalidateTag('events', '');
    revalidateTag(`event-${eventId}`, '');
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to RSVP to the event' };
  }
}
