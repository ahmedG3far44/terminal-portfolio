export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const BASE_URL = API_BASE_URL;

interface HttpOptions {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

function getToken(): string | null {
  return localStorage.getItem("auth-token");
}

export class HttpError extends Error {
  status: number;
  needsReauth?: boolean;

  constructor(message: string, status: number, needsReauth?: boolean) {
    super(message);
    this.status = status;
    this.needsReauth = needsReauth;
    this.name = "HttpError";
  }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options?: HttpOptions,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let fullUrl = `${BASE_URL}${url}`;

  if (options?.params) {
    const filtered = Object.entries(options.params).filter(
      ([, v]) => v !== undefined && v !== "",
    );
    if (filtered.length > 0) {
      const qs = new URLSearchParams(
        filtered.map(([k, v]) => [k, String(v)]),
      ).toString();
      fullUrl += `?${qs}`;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    signal: options?.signal,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(fullUrl, fetchOptions);

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new HttpError(
      json.error || `HTTP ${res.status}`,
      res.status,
      json.needsReauth,
    );
  }

  return json.data !== undefined ? json.data : json;
}

async function uploadFile<T>(
  url: string,
  file: File,
  signal?: AbortSignal,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers,
    signal,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new HttpError(
      json.error || `HTTP ${res.status}`,
      res.status,
      json.needsReauth,
    );
  }

  return json.data !== undefined ? json.data : json;
}

export const http = {
  get: <T>(url: string, opts?: HttpOptions) =>
    request<T>("GET", url, undefined, opts),
  post: <T>(url: string, body?: unknown, opts?: HttpOptions) =>
    request<T>("POST", url, body, opts),
  put: <T>(url: string, body?: unknown, opts?: HttpOptions) =>
    request<T>("PUT", url, body, opts),
  del: <T>(url: string, opts?: HttpOptions) =>
    request<T>("DELETE", url, undefined, opts),
  upload: <T>(url: string, file: File, signal?: AbortSignal) =>
    uploadFile<T>(url, file, signal),
};
