import type { AuthResponse, SignInBody, SignUpBody } from "@/types/auth";

const authApi = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Authentication request failed");
  }
  return data;
}

export const createPanelUser = async (
  user: SignUpBody,
): Promise<AuthResponse> => {
  const response = await fetch(`${authApi}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  return parseResponse<AuthResponse>(response);
};

export const sendVerificationOtp = async (
  email: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${authApi}/send-verification-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  return parseResponse<{ message: string }>(response);
};

export const signInPanelUser = async (
  user: SignInBody,
): Promise<AuthResponse> => {
  const response = await fetch(`${authApi}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  return parseResponse<AuthResponse>(response);
};

export const signOutPanelUser = async (): Promise<void> => {
  const response = await fetch(`${authApi}/sign-out`, {
    method: "POST",
    credentials: "include",
  });
  return parseResponse<void>(response);
};
