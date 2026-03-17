import { UrlList } from "@/app/urls/_components/url-list";
import { listUrls } from "@/lib/api";
import { type ShortURLInfoResponse } from "@/lib/types";

export default async function UrlsPage() {
  let urls: ShortURLInfoResponse[] = [];
  let errorMessage: string | null = null;

  try {
    urls = await listUrls();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load URLs. Please try again.";
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {errorMessage}
        </div>
      </div>
    );
  }

  return <UrlList urls={urls} />;
}
