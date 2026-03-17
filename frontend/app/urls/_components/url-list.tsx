"use client";

import Link from "next/link";
import { BarChart3, Check, Copy, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ShortURLInfoResponse } from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function UrlList({ urls }: { urls: ShortURLInfoResponse[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) {
      return;
    }

    const timer = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-100">Your Links</h1>
          <Badge variant="default">({urls.length})</Badge>
        </div>
        <Link href="/#shorten">
          <Button className="bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/30">
            + Shorten New
          </Button>
        </Link>
      </div>

      {urls.length === 0 ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-[#1e1e2e] bg-[#13131a] px-6 text-center">
          <svg
            aria-hidden
            viewBox="0 0 120 120"
            className="mb-5 h-20 w-20 text-violet-400/70"
            fill="none"
          >
            <path
              d="M35 35l50 50M44 76l-9 9a13 13 0 01-19-19l16-16a13 13 0 0119 0l4 4M76 44l9-9a13 13 0 0119 19L88 70a13 13 0 01-19 0l-4-4"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-100">No links yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Shorten your first URL and track every click from the dashboard.
          </p>
          <Link href="/#shorten" className="mt-5">
            <Button className="bg-violet-600 text-white hover:bg-violet-500">
              Shorten First URL
            </Button>
          </Link>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-14rem)] space-y-3 overflow-y-auto pr-1">
          {urls.map((item) => {
            const copied = copiedId === item.id;
            return (
              <article
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-500/40"
              >
                <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <Link2 className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <a
                    href={item.short_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-violet-400 hover:text-violet-300"
                  >
                    {item.short_url}
                  </a>
                  <Tooltip>
                    <TooltipTrigger className="mt-1 block max-w-full truncate text-left text-sm text-gray-500">
                      {item.long_url}
                    </TooltipTrigger>
                    <TooltipContent>{item.long_url}</TooltipContent>
                  </Tooltip>
                </div>

                <div className="hidden shrink-0 md:block">
                  <Badge
                    variant={item.total_clicks > 0 ? "success" : "default"}
                  >
                    ▲ {item.total_clicks} clicks
                  </Badge>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-gray-300 hover:bg-violet-500/10 hover:text-violet-300"
                    aria-label="Copy short URL"
                    onClick={async () => {
                      await navigator.clipboard.writeText(item.short_url);
                      setCopiedId(item.id);
                    }}
                  >
                    {copied ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                  <Link href={`/analytics/${item.id}`}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-gray-300 hover:bg-violet-500/10 hover:text-violet-300"
                      aria-label="Open analytics"
                    >
                      <BarChart3 className="size-4" />
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-gray-500 md:hidden">
                  {item.total_clicks} clicks
                </div>

                <div className="hidden text-xs text-gray-500 lg:block">
                  {formatDate(item.created_at)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
