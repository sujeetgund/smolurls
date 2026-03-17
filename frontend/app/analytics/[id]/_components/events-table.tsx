"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ClickEventResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function FadeInRow({ event }: { event: ClickEventResponse }) {
  const rowRef = useRef<HTMLTableRowElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = rowRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <tr
      ref={rowRef}
      className={cn(
        "transition-all duration-300 hover:bg-white/2",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <td className="px-4 py-3 text-sm text-gray-300">
        {formatDateTime(event.clicked_at)}
      </td>
      <td className="max-w-60 px-4 py-3 text-sm text-gray-300">
        {event.referrer ? (
          <Tooltip>
            <TooltipTrigger className="block w-full truncate text-left">
              {event.referrer}
            </TooltipTrigger>
            <TooltipContent>{event.referrer}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-gray-500">Direct</span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-gray-400">
        {event.ip_address ?? "-"}
      </td>
      <td className="max-w-72 px-4 py-3 text-sm text-gray-300">
        {event.user_agent ? (
          <Tooltip>
            <TooltipTrigger className="block w-full truncate text-left">
              {event.user_agent}
            </TooltipTrigger>
            <TooltipContent>{event.user_agent}</TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
}

export function EventsTable({ events }: { events: ClickEventResponse[] }) {
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (left, right) =>
          new Date(right.clicked_at).getTime() -
          new Date(left.clicked_at).getTime(),
      ),
    [events],
  );

  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(sortedEvents.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const currentPageEvents = sortedEvents.slice(start, start + PAGE_SIZE);

  return (
    <section className="mt-8 rounded-xl border border-[#1e1e2e] bg-[#13131a]">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-[#1e1e2e]">
          <thead>
            <tr className="text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Referrer</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">User Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {currentPageEvents.map((event, index) => (
              <FadeInRow
                key={`${event.clicked_at}-${event.ip_address ?? "na"}-${index}`}
                event={event}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#1e1e2e] px-4 py-3 text-sm text-gray-400">
        <span>
          Showing {sortedEvents.length === 0 ? 0 : start + 1}-
          {Math.min(start + PAGE_SIZE, sortedEvents.length)} of{" "}
          {sortedEvents.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="size-4" /> Prev
          </Button>
          <span className="text-xs text-gray-500">
            Page {page} / {pageCount}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            disabled={page >= pageCount}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
