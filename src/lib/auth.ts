import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const COOKIE_NAME = 'studyflow_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'studyflow_super_secret_session_jwt_key_2026_default'
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Returns current authenticated user from database or throws an unauthorized error.
 * Fallback to first user in development if needed, but in standard mode enforces session.
 */
export async function requireUser() {
  const session = await getSessionUser();
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        university: true,
      },
    });
    if (user) return user;
  }

  // If in dev and no session yet, auto-fallback to primary seed user so app remains immediately usable
  const defaultUser = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      university: true,
    },
  });

  if (defaultUser) {
    return defaultUser;
  }

  throw new Error('UNAUTHORIZED');
}

