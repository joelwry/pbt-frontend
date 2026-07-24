/**
 * These are NOT real JWTs — there's no signature verification, and they must
 * never be treated as secure by anything that reads them. They exist purely
 * so the mock API layer can hand the frontend something shaped exactly like
 * what the real Express API will issue (header.payload.signature, base64
 * JSON payload with an `exp` claim), so swapping in the real endpoint later
 * requires no changes to how the frontend reads/schedules token expiry.
 */

interface MockTokenPayload {
  sub: string; // member id
  type: "access" | "refresh";
  iat: number; // seconds
  exp: number; // seconds
}

function base64UrlEncode(input: string): string {
  if (typeof window === "undefined") return Buffer.from(input).toString("base64url");
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  if (typeof window === "undefined") return Buffer.from(padded, "base64").toString("utf-8");
  return atob(padded);
}

export function createMockToken(memberId: string, type: "access" | "refresh", ttlSeconds: number): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload: MockTokenPayload = { sub: memberId, type, iat: now, exp: now + ttlSeconds };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${encodedPayload}.mock-signature`;
}

export function decodeMockToken(token: string): MockTokenPayload | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(base64UrlDecode(payload)) as MockTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token: string): number | null {
  const decoded = decodeMockToken(token);
  return decoded ? decoded.exp * 1000 : null;
}

export function isTokenExpired(token: string): boolean {
  const expiryMs = getTokenExpiryMs(token);
  if (expiryMs === null) return true;
  return Date.now() >= expiryMs;
}
