export interface ShortenRequest {
  url: string;
  custom_alias?: string;
}

export interface ShortURLResponse {
  id: string;
  long_url: string;
  short_url: string;
  created_at: string;
}

export interface ShortURLInfoResponse {
  id: string;
  long_url: string;
  short_url: string;
  created_at: string;
  total_clicks: number;
}

export interface ClickEventResponse {
  clicked_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
}

export interface URLAnalyticsResponse {
  id: string;
  short_url: string;
  long_url: string;
  total_clicks: number;
  events: ClickEventResponse[];
}
