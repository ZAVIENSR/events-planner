import { auth } from '@/auth';
import { Event, EventRSVP, RSVPStatus } from '@/lib/models';
import { format } from 'date-fns';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type DashboardRSVP = {
  event: Event | null;
  status: RSVPStatus;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userEventsRes = await fetch(
    'http://localhost:3000/api/dashboard/events',
    { next: { tags: ['events'] } }
  );

  const userEvents: Event[] = userEventsRes.ok
    ? await userEventsRes.json()
    : [];

  const userRSVPsRes = await fetch(
    'http://localhost:3000/api/dashboard/rsvps',
    {
      next: { tags: ['rsvps'] },
    }
  );

  const userRSVPs: EventRSVP[] = userRSVPsRes.ok
    ? await userRSVPsRes.json()
    : [];

  const now = new Date();
  const upcomingEvents = userEvents.filter(
    (event: Event) => new Date(event.date) >= now
  );

  const pastEvents = userEvents.filter(
    (event: Event) => new Date(event.date) < now
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-2">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/events/create" className="btn-primary">
            Create New Event
          </Link>
          <Link className="btn-secondary" href="/events">
            Browse All Events
          </Link>
        </div>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Total Events
          </h3>
          <p className="text-3xl font-bold text-primary">{userEvents.length}</p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Upcoming Events
          </h3>
          <p className="text-3xl font-bold text-primary">
            {upcomingEvents.length}
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">Past Events</h3>
          <p className="text-3xl font-bold text-primary">{pastEvents.length}</p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">My RSVPs</h3>
          <p className="text-3xl font-bold text-primary">{userRSVPs.length}</p>
        </div>
      </div>

      {/* My Events Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">My Events</h2>
          <Link
            href="/events/create"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            + Create Event
          </Link>
        </div>

        {userEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.map((event, key: number) => (
              <div className="card p-6" key={key}>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-muted mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-muted mb-4">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {format(new Date(event.date), "PPP 'at' p")}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted mb-4">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event._count.rsvps} RSVPs
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-muted">You haven't created an event yet</p>
          </div>
        )}
      </div>

      {/* My RSVPs Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">My RSVPs</h2>

        {userRSVPs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRSVPs.map((rsvp, key: number) => {
              return (
                <div className="card p-6" key={key}>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {rsvp.event?.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.status === 'GOING'
                        ? 'bg-green-600/20 text-green-400'
                        : rsvp.status === 'MAYBE'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {rsvp.status}
                  </span>
                  <p className="text-muted mb-4 mt-2">
                    {rsvp.event?.description}
                  </p>

                  <div className="space-y-2 text-sm text-muted mb-4">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {format(new Date(rsvp.event!.date), "PPP 'at' p")}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted mb-4">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      by {rsvp.event?.user.name}
                    </div>
                  </div>
                  <Link
                    href={`/events/${rsvp.event?.id}`}
                    className="btn-primary w-full text-center"
                  >
                    View Event
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-muted">You haven't RSVPed to any events yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
