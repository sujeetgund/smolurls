import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("h-3 w-full rounded bg-gray-800", className)} />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4",
        className,
      )}
    >
      <Skeleton className="h-4 w-32 rounded bg-gray-800" />
      <Skeleton className="mt-3 h-3 w-full rounded bg-gray-800" />
      <Skeleton className="mt-2 h-3 w-2/3 rounded bg-gray-800" />
    </div>
  );
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4",
        className,
      )}
    >
      <Skeleton className="h-3 w-20 rounded bg-gray-800" />
      <Skeleton className="mt-3 h-8 w-24 rounded bg-gray-800" />
      <Skeleton className="mt-2 h-3 w-32 rounded bg-gray-800" />
    </div>
  );
}
