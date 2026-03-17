import { SkeletonCard } from "@/components/loading-skeleton";

export default function LoadingUrlsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-800" />
        <div className="h-8 w-28 animate-pulse rounded bg-gray-800" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} className="h-24" />
        ))}
      </div>
    </div>
  );
}
