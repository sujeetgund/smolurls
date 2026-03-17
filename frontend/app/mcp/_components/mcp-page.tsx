"use client";

import { ArrowRight, Check, Copy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MCP_COMPATIBILITY_NOTE,
  MCP_COMPATIBLE_CLIENTS,
  MCP_SERVER_URL,
  MCP_SETUP_SNIPPETS,
  MCP_TOOLS,
  MCP_TRANSPORT,
  type CodeTone,
} from "@/lib/mcp-docs";
import { cn } from "@/lib/utils";

function tokenToneClass(tone: CodeTone | undefined) {
  switch (tone) {
    case "keyword":
      return "text-violet-400";
    case "property":
      return "text-violet-300";
    case "string":
      return "text-emerald-300";
    case "comment":
      return "text-gray-600 italic";
    case "punctuation":
      return "text-gray-500";
    case "type":
      return "text-gray-300";
    default:
      return "text-gray-300";
  }
}

interface IconCopyButtonProps {
  value: string;
  className?: string;
}

function IconCopyButton({ value, className }: IconCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="relative">
      {copied ? (
        <span className="pointer-events-none absolute -top-7 right-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          Copied!
        </span>
      ) : null}
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label={copied ? "Copied!" : "Copy"}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          }}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-md border border-[#1e1e2e] bg-[#0d0d14] text-gray-400 transition-all hover:border-violet-500/40 hover:text-violet-300",
            copied &&
              "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:text-emerald-200",
            className,
          )}
        >
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <Copy
              className={cn(
                "absolute size-4 transition-all duration-150",
                copied ? "scale-80 opacity-0" : "scale-100 opacity-100",
              )}
            />
            <Check
              className={cn(
                "absolute size-4 transition-all duration-150",
                copied ? "scale-100 opacity-100" : "scale-80 opacity-0",
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
      </Tooltip>
    </div>
  );
}

interface McpSectionRevealProps extends React.ComponentProps<"div"> {
  delayMs?: number;
}

function McpSectionReveal({
  children,
  className,
  delayMs = 0,
  style,
  ...props
}: McpSectionRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
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
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      style={{
        transitionDelay: `${delayMs}ms`,
        ...style,
      }}
      className={cn(
        "transition-all duration-500 motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function McpPage() {
  const [activeTab, setActiveTab] = useState(
    MCP_SETUP_SNIPPETS[0]?.id ?? "claude",
  );

  const activeSnippet =
    MCP_SETUP_SNIPPETS.find((snippet) => snippet.id === activeTab) ??
    MCP_SETUP_SNIPPETS[0];

  const activeIndex = useMemo(
    () =>
      Math.max(
        MCP_SETUP_SNIPPETS.findIndex((snippet) => snippet.id === activeTab),
        0,
      ),
    [activeTab],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <McpSectionReveal delayMs={0}>
        <section className="relative overflow-hidden rounded-2xl border border-[#1e1e2e] bg-[#0a0a0f] px-6 py-12 sm:px-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #2a2a3a 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.4,
            }}
          />

          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              ⚡ Model Context Protocol
            </span>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white">
              SmolURLs MCP Server
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-400">
              Connect your MCP-compatible client to shorten links and fetch
              analytics from SmolURLs over Streamable HTTP.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <CopyButton
                value={MCP_SERVER_URL}
                defaultLabel="Copy Server URL"
                copiedLabel="Copied!"
                variant="default"
                className="h-auto rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-500 hover:shadow-violet-500/40"
              />

              <a href="#mcp-tools">
                <Button
                  variant="outline"
                  className="h-auto rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 font-medium text-white hover:border-white/20 hover:bg-white/10"
                >
                  View Docs <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </McpSectionReveal>

      <McpSectionReveal delayMs={80} className="mt-8">
        <section className="mx-auto max-w-2xl rounded-2xl border border-violet-500/25 bg-[#13131a] p-6 shadow-[0_0_40px_rgba(139,92,246,0.07)]">
          <h2 className="text-2xl font-bold text-gray-100">
            Connect to this MCP Server
          </h2>

          <div className="mt-5 divide-y divide-white/5 rounded-xl border border-[#1e1e2e] bg-[#0f0f15] px-4">
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-gray-500">
                Server URL
              </span>

              <div className="flex min-w-0 items-center gap-3 sm:justify-end">
                <code className="max-w-[58vw] truncate font-mono text-sm text-violet-300 sm:max-w-none">
                  {MCP_SERVER_URL}
                </code>
                <IconCopyButton value={MCP_SERVER_URL} />
              </div>
            </div>

            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-gray-500">
                Transport
              </span>

              <div className="flex items-center gap-3 sm:justify-end">
                <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {MCP_TRANSPORT}
                </span>
                <IconCopyButton value={MCP_TRANSPORT} />
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">{MCP_COMPATIBILITY_NOTE}</p>
        </section>
      </McpSectionReveal>

      <McpSectionReveal delayMs={160} className="mt-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-100">
            Add to your MCP client
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#13131a]">
            <div className="relative grid grid-cols-3 border-b border-[#1e1e2e] bg-[#0d0d14]">
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-0.75 w-1/3 bg-violet-500 transition-transform duration-150"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />

              {MCP_SETUP_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.id}
                  type="button"
                  onClick={() => setActiveTab(snippet.id)}
                  className={cn(
                    "relative z-10 px-4 py-3 text-left text-sm transition-colors",
                    activeTab === snippet.id
                      ? "bg-[#13131a] font-semibold text-white"
                      : "text-gray-500 hover:text-gray-300",
                  )}
                >
                  <span className="block truncate">{snippet.title}</span>
                  <span className="mt-1 block truncate font-mono text-xs text-gray-600">
                    {snippet.fileName}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-b-xl rounded-tr-xl border border-[#1e1e2e] bg-[#0d0d14]">
              <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  {activeSnippet.language}
                </span>
                <IconCopyButton
                  value={activeSnippet.rawCode}
                  className="bg-transparent"
                />
              </div>

              <pre className="min-h-45 overflow-x-auto p-4 pt-12 text-sm leading-6">
                <code className="font-mono">
                  {activeSnippet.lines.map((line, lineIndex) => (
                    <div
                      key={`${activeSnippet.id}-${lineIndex}`}
                      className="whitespace-pre"
                    >
                      {line.map((token, tokenIndex) => (
                        <span
                          key={`${activeSnippet.id}-${lineIndex}-${tokenIndex}`}
                          className={tokenToneClass(token.tone)}
                        >
                          {token.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </code>
              </pre>

              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-[#0d0d14] to-transparent md:hidden" />
            </div>
          </div>
        </section>
      </McpSectionReveal>

      <McpSectionReveal delayMs={240} className="mt-20">
        <section id="mcp-tools">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">
            What your agent can do
          </h2>
          <p className="text-sm text-gray-500">
            Tools exposed by this MCP server
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {MCP_TOOLS.map((tool) => (
              <article
                key={tool.name}
                className="cursor-default rounded-xl border border-[#1e1e2e] bg-[#13131a] p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-[#16161f]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm font-semibold text-violet-400">
                    {tool.name}
                  </p>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      tool.category === "analytics"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-violet-500/20 bg-violet-500/10 text-violet-400",
                    )}
                  >
                    {tool.category}
                  </span>
                </div>

                <p className="mt-1 mb-3 text-sm text-gray-400">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {tool.params.length > 0 ? (
                    tool.params.map((param) => (
                      <span
                        key={`${tool.name}-${param}`}
                        className={cn(
                          "rounded-md border border-[#1e1e2e] bg-[#0d0d14] px-2 py-0.5 font-mono text-xs",
                          param.endsWith("?")
                            ? "text-gray-500"
                            : "text-gray-300",
                        )}
                      >
                        {param}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-md border border-[#1e1e2e] bg-[#0d0d14] px-2 py-0.5 font-mono text-xs text-gray-300">
                      —
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </McpSectionReveal>

      <McpSectionReveal delayMs={320} className="mt-10">
        <section>
          <h3 className="mb-3 text-xs tracking-widest text-gray-600 uppercase">
            WORKS WITH
          </h3>

          <div className="flex flex-wrap gap-2">
            {MCP_COMPATIBLE_CLIENTS.map((client) => (
              <span
                key={client}
                className="rounded-lg border border-[#1e1e2e] bg-[#13131a] px-4 py-2 text-sm text-gray-300 transition-colors hover:border-violet-500/20 hover:text-white"
              >
                {client}
              </span>
            ))}
          </div>
        </section>
      </McpSectionReveal>

      <McpSectionReveal delayMs={400} className="mt-10">
        <section className="flex flex-col gap-4 rounded-2xl border border-violet-500/10 bg-linear-to-r from-violet-900/20 to-transparent p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-100">
              Explore the raw MCP endpoint
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Inspect available tools and schemas directly.
            </p>
          </div>

          <a href={MCP_SERVER_URL} target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              className="h-auto rounded-lg border-violet-500/40 bg-transparent px-4 py-2 text-violet-200 hover:border-violet-400 hover:bg-violet-500/10 hover:text-violet-100"
            >
              Open Endpoint ↗
            </Button>
          </a>
        </section>
      </McpSectionReveal>
    </div>
  );
}
