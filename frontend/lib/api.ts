import {
  type ShortenRequest,
  type ShortURLInfoResponse,
  type ShortURLResponse,
  type URLAnalyticsResponse,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  cache: RequestCache = "no-store",
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        message = payload.detail;
      }
    } catch {
      // ignore json parsing errors for non-json error payloads
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function shortenUrl(payload: ShortenRequest): Promise<ShortURLResponse> {
  return apiFetch<ShortURLResponse>("/shorten", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listUrls(): Promise<ShortURLInfoResponse[]> {
  return apiFetch<ShortURLInfoResponse[]>("/shorten/all");
}

export function getUrlInfo(id: string): Promise<ShortURLInfoResponse> {
  return apiFetch<ShortURLInfoResponse>(`/shorten/${id}`);
}

export function getAnalytics(id: string): Promise<URLAnalyticsResponse> {
  return apiFetch<URLAnalyticsResponse>(`/analytics/${id}`);
}
