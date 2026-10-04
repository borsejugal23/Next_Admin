export type AccessTokenPayload = {
  userId?: string;
  role?: string;
  exp?: number;
};

function base64UrlDecode(input: string): Uint8Array {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function parsePayload(payloadB64: string): AccessTokenPayload | null {
  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadB64)),
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function getVerifiedAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  const secret = process.env.JWT_SECREAT_KEY;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const payload = parsePayload(payloadB64);
  if (!payload?.userId) return null;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = new Uint8Array(base64UrlDecode(signatureB64));
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      data,
    );

    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function verifyAccessToken(token: string): Promise<boolean> {
  return (await getVerifiedAccessToken(token)) !== null;
}
