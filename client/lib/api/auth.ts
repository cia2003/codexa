import { apiFetch } from "@/lib/api";

const AUTH_STORAGE_KEY = "codexa-auth";

export type AuthUser = {
  id: string;
  email: string;
  display_name: string | null;
};

export type AuthResponse = {
  status: "success";
  message: string;
  user: AuthUser;
  access_token?: string;
  token_type?: "Bearer";
};

async function postAuth(
  endpoint: "login" | "register",
  payload: Record<string, string>,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(`/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
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