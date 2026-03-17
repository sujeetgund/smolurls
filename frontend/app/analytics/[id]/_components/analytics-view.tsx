import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { ClicksChart } from "@/app/analytics/[id]/_components/clicks-chart";
import { EventsTable } from "@/app/analytics/[id]/_components/events-table";
import { type URLAnalyticsResponse } from "@/lib/types";

function formatDate(value: string | undefined) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AnalyticsView({
  analytics,
}: {
  analytics: URLAnalyticsResponse;
}) {
  const sortedByTime = [...analytics.events].sort(
    (left, right) =>
      new Date(left.clicked_at).getTime() -
      new Date(right.clicked_at).getTime(),
  );

  const firstSeen = sortedByTime.at(0)?.clicked_at;
  const latestClick = sortedByTime.at(-1)?.clicked_at;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/urls"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-violet-300"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <a
          href={analytics.short_url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-sm text-violet-400 hover:text-violet-300"
        >
          {analytics.short_url}
        </a>
        <ExternalLink className="size-4 text-gray-500" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <article className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
            <p className="text-xs tracking-widest text-gray-500 uppercase">
              Total Clicks
            </p>
            <p className="mt-2 text-3xl font-black text-gray-100">
              {analytics.total_clicks}
            </p>
            <p className="mt-1 text-xs text-gray-500">All recorded redirects</p>
          </article>
          <article className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
            <p className="text-xs tracking-widest text-gray-500 uppercase">
              First Seen
            </p>
            <p className="mt-2 text-xl font-black text-gray-100">
              {formatDate(firstSeen)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              First tracked click event
            </p>
          </article>
          <article className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
            <p className="text-xs tracking-widest text-gray-500 uppercase">
              Latest Click
            </p>
            <p className="mt-2 text-xl font-black text-gray-100">
              {formatDate(latestClick)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Most recent visit timestamp
            </p>
          </article>
        </div>

        <section className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">
            Clicks Over Time
          </h2>
          <ClicksChart events={analytics.events} />
        </section>
      </div>

      <EventsTable events={analytics.events} />
    </div>
  );
}
