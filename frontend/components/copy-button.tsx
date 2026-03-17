"use client";

import { type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends VariantProps<typeof buttonVariants> {
  value: string;
  className?: string;
  defaultLabel?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
}

export function CopyButton({
  value,
  className,
  defaultLabel = "Copy",
  copiedLabel = "Copied!",
  iconOnly = false,
  variant = "outline",
  size = "sm",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={copied ? copiedLabel : defaultLabel}
      className={cn(
        variant === "outline" &&
          "min-w-22 border-[#1e1e2e] bg-transparent text-gray-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300",
        iconOnly && "min-w-0",
        copied &&
          "border-emerald-500/40 text-emerald-400 hover:text-emerald-300",
        className,
      )}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
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
      {iconOnly ? null : <span>{copied ? copiedLabel : defaultLabel}</span>}
    </Button>
  );
}
