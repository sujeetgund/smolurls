import { SkeletonStat } from "@/components/loading-skeleton";

export default function LoadingAnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 h-6 w-32 animate-pulse rounded bg-gray-800" />
      <div className="mb-5 h-4 w-56 animate-pulse rounded bg-gray-800" />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <div className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-800" />
          <div className="mt-4 h-[320px] animate-pulse rounded bg-gray-800" />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[#1e1e2e] bg-[#13131a] p-4">
        <div className="h-60 animate-pulse rounded bg-gray-800" />
      </div>
    </div>
  );
}
