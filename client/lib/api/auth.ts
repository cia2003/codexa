const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "");

const AUTH_STORAGE_KEY = "codexa-auth";

export type AuthUser = {
  id: string;
  email: string;
  display_name: string | null;
};

type AuthResponse = {
  status: "success";
  message: string;
  user: AuthUser;
  access_token?: string;
  token_type?: "Bearer";
};

type ApiErrorResponse = {
  message?: string;
};

async function postAuth(
  endpoint: "login" | "register",
  payload: Record<string, string>,
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan server berjalan lalu coba lagi.",
    );
  }

  let result: AuthResponse | ApiErrorResponse;
  try {
    result = (await response.json()) as AuthResponse | ApiErrorResponse;
  } catch {
    throw new Error("Server mengirim respons yang tidak valid.");
  }

  if (!response.ok) {
    throw new Error(
      result.message ?? "Autentikasi gagal. Silakan coba lagi.",
    );
  }

  return result as AuthResponse;
}

export function registerUser(payload: {
  email: string;
  password: string;
  display_name: string;
}) {
  return postAuth("register", payload);
}

export function loginUser(payload: { email: string; password: string }) {
  return postAuth("login", payload);
}

export function saveAuthSession(response: AuthResponse) {
  if (!response.access_token) {
    throw new Error("Server tidak mengembalikan token autentikasi.");
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken: response.access_token,
      user: response.user,
    }),
  );
  window.dispatchEvent(new Event("codexa-auth-change"));
}

export function getStoredAuthUser(): AuthUser | null {
  const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    const session: { user?: AuthUser } = JSON.parse(storedSession);
    return session.user ?? null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getStoredAccessToken(): string | null {
  const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    const session: { accessToken?: unknown } = JSON.parse(storedSession);
    return typeof session.accessToken === "string"
      ? session.accessToken
      : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("codexa-auth-change"));
}
