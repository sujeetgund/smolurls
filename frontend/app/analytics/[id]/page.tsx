import { AnalyticsView } from "@/app/analytics/[id]/_components/analytics-view";
import { getAnalytics } from "@/lib/api";
import { type URLAnalyticsResponse } from "@/lib/types";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let analytics: URLAnalyticsResponse | null = null;
  let errorMessage: string | null = null;

  try {
    analytics = await getAnalytics(id);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load analytics for this URL.";
  }

  if (errorMessage || !analytics) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMessage ?? "Failed to load analytics for this URL."}
        </div>
      </div>
    );
  }

  return <AnalyticsView analytics={analytics} />;
}
