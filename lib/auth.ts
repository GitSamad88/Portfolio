import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in your environment variables.");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is not set. Run `npm run hash-password` to generate one."
    );
  }
  // The hash is stored base64-encoded (see scripts/generate-password-hash.mjs).
  // Bcrypt hashes are full of literal "$" characters, and Next.js's built-in
  // .env loader expands "$name"-style variables — so a raw hash gets silently
  // corrupted the moment it's loaded. Base64 has no "$", so it survives intact.
  const hash = Buffer.from(encoded, "base64").toString("utf8");
  return bcrypt.compare(candidate, hash);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<boolean> {
  return isAuthenticated();
}
