import { NextResponse } from 'next/server';
import { clearSessionCookie, requireUser } from '@/lib/auth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

