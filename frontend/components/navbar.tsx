"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/mcp", label: "MCP" },
  { href: "/urls", label: "Dashboard" },
  { href: "/#shorten", label: "New URL" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-100 transition-all duration-150 hover:text-white"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-violet-500/20 text-violet-400">
            <Link2 className="size-4" />
          </span>
          <span className="text-lg font-bold lowercase">smolurls</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/urls" && pathname.startsWith("/analytics"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative text-sm font-medium text-gray-300 transition-all duration-150 hover:text-violet-300",
                  active && "text-violet-300",
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-violet-400 transition-all duration-150 group-hover:w-full" />
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((previous) => !previous)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-black/70 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-gray-200 transition-all duration-150 hover:bg-violet-500/10 hover:text-violet-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
