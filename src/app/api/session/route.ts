import { NextRequest, NextResponse } from 'next/server';
import { createSession, listSessions, closeSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = body.name || body.sourceName || 'Unnamed Session';
    const result = await createSession(name);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[POST /api/session]', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json(sessions);
  } catch (err) {
    console.error('[GET /api/session]', err);
    return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('id');
    if (!sessionId) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await closeSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/session]', err);
    return NextResponse.json({ error: 'Failed to close session' }, { status: 500 });
  }
}
