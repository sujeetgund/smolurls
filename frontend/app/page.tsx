"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import { shortenUrl } from "@/lib/api";
import { type ShortURLResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [aliasEnabled, setAliasEnabled] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [result, setResult] = useState<ShortURLResponse | null>(null);

  const canSubmit = useMemo(() => url.trim().length > 0, [url]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setShake(true);
      setTimeout(() => setShake(false), 240);
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const created = await shortenUrl({
        url,
        custom_alias:
          aliasEnabled && customAlias.trim().length > 0
            ? customAlias.trim()
            : undefined,
      });
      setResult(created);
      setUrl("");
      setCustomAlias("");
      setAliasEnabled(false);
    } catch (submitError) {
      setShake(true);
      setTimeout(() => setShake(false), 240);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to shorten URL right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center text-center">
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          ✦ Fast &amp; Free URL Shortener
        </span>
        <h1 className="mt-5 text-5xl font-black tracking-tight text-gray-100">
          Make your links smol.
        </h1>
        <p className="mt-3 text-gray-400">
          Paste a URL, get a short one. No sign-up needed.
        </p>
      </section>

      <section id="shorten" className="mt-10">
        <div
          className={cn(
            "rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-6 shadow-xl transition-all duration-150",
            shake && "animate-shake",
          )}
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Long URL
              </label>
              <Input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/my-long-link"
                className="h-11 rounded-lg border-[#1e1e2e] bg-[#0f0f15] text-gray-100 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-violet-500"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setAliasEnabled((previous) => !previous)}
                className="text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                {aliasEnabled ? "Remove custom alias" : "Add custom alias"}
              </button>

              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-200",
                  aliasEnabled ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0">
                  <label className="mb-2 block text-sm font-medium text-gray-200">
                    Custom Alias
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-sm text-gray-500">
                      smol.ly /
                    </span>
                    <Input
                      value={customAlias}
                      onChange={(event) => setCustomAlias(event.target.value)}
                      placeholder="your-alias"
                      className="h-11 rounded-lg border-[#1e1e2e] bg-[#0f0f15] pl-19 text-gray-100 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 font-semibold text-white transition-all duration-150 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten URL"
              )}
            </button>
          </form>
        </div>

        {result ? (
          <div className="mt-5 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-[#1e1e2e] border-l-4 border-l-emerald-400 bg-[#13131a] p-4 shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <a
                href={result.short_url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-violet-400 hover:text-violet-300"
              >
                {result.short_url}
              </a>
              <CopyButton value={result.short_url} />
            </div>
            <p className="mt-2 truncate text-sm text-gray-500">
              {result.long_url}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{formatTimestamp(result.created_at)}</span>
              <Link
                href={`/analytics/${result.id}`}
                className="font-medium text-violet-300 hover:text-violet-200"
              >
                View Analytics →
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
