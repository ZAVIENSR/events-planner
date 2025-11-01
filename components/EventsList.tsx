'use client';

import { Event } from '@/lib/models';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EventsListProps {
  events: Event[];
  searchParams: { search?: string; filter?: string };
  isAuthenticated: boolean;
}

export default function EventsList({
  events,
  searchParams,
  isAuthenticated,
}: EventsListProps) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const filter = formData.get('filter') as string;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filter) params.set('filter', filter);

    router.push(`/events?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              className="input-field"
            />
          </div>
          <select name="filter" className="input-field w-auto">
            <option value="">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>

          <button type="submit" className="btn-primary">
            Filter
          </button>
        </form>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, key) => (
          <div
            key={key}
            className="card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {event.title}
              </h3>
              <p className="text-muted mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-muted ">
                <div className="flex items-center">
                  <svg
                    className="size-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(new Date(event.date), "PPP 'at' p")}
                </div>

                <div className="flex items-center">
                  <svg
                    className="size-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {event.location}
                </div>

                <div className="flex items-center">
                  <svg
                    className="size-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0A5.002 5.002 0 0117 9V7a5 5 0 00-10 0v2a5.002 5.002 0 01-.356 3.143z"
                    />
                  </svg>
                  {event.maxAttendees}
                </div>

                <div className="flex items-center">
                  <svg
                    className="size-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0A5.002 5.002 0 0117 9V7a5 5 0 00-10 0v2a5.002 5.002 0 01-.356 3.143z"
                    />
                  </svg>
                  by {event.user.name || 'Unknown'}
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
