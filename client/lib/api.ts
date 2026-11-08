export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  const baseUrl = configuredUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  const headers = new Headers(init.headers);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/${normalizedPath}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server API.");
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server mengirim respons yang tidak valid.");
  }

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "Permintaan ke server gagal.";

    throw new Error(message);
  }

  return result as T;
}