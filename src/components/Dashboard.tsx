'use client';
import { useState, useEffect, useCallback } from 'react';
import type { SessionRecord } from '@/lib/session';
import type { CreateSessionResponse } from '@/types/session';
import { SessionTable } from './SessionTable';
import { SessionCreator } from './SessionCreator';
import { AgentDownload } from './AgentDownload';

export function Dashboard() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [newSession, setNewSession] = useState<CreateSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/session');
      if (res.ok) setSessions(await res.json() as SessionRecord[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions();
    const id = setInterval(fetchSessions, 5000);
    return () => clearInterval(id);
  }, [fetchSessions]);

  const handleCloseSession = useCallback(async (sessionId: string) => {
    try {
      console.log('Deleting session:', sessionId);
      const res = await fetch(`/api/session?id=${sessionId}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('Delete failed:', res.status, await res.text());
        alert('Failed to delete session');
        return;
      }
      console.log('Session deleted successfully');
      void fetchSessions();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting session');
    }
  }, [fetchSessions]);

  const handleRegenerateToken = useCallback(async (sessionId: string) => {
    try {
      // Create a new session to get fresh token and command
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceName: 'Regenerated', clientName: 'Client' }),
      });
      if (!res.ok) throw new Error('Failed to regenerate token');
      const data = (await res.json()) as CreateSessionResponse;
      
      // Show the new credentials in modal
      setNewSession(data);
      
      // Close the old session
      await fetch(`/api/session?id=${sessionId}`, { method: 'DELETE' });
      void fetchSessions();
    } catch (err) {
      console.error('Failed to regenerate token:', err);
    }
  }, [fetchSessions]);

  const activeSessions = sessions.filter(s => s.state !== 'closed');
  const closedSessions = sessions.filter(s => s.state === 'closed');

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">G3</div>
          <h1 className="text-lg font-bold text-slate-200 tracking-wide">GT3 Controller</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-dim">{activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}</span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Create Session */}
        <section className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-200">New Remote Session</h2>
              <p className="text-sm text-dim mt-0.5">Generate a token and download link for the source agent</p>
            </div>
          </div>
          <SessionCreator onCreated={(r) => setNewSession(r)} />
        </section>

        {/* Active Sessions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-slate-200">Active Sessions</h2>
            <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-0.5 rounded-full">
              {activeSessions.length}
            </span>
          </div>
          {loading ? (
            <div className="text-sm text-dim">Loading…</div>
          ) : (
            <SessionTable 
              sessions={activeSessions} 
              onClose={handleCloseSession}
              onRegenerateToken={handleRegenerateToken}
            />
          )}
        </section>

        {/* Closed Sessions */}
        {closedSessions.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-dim mb-3">Recent Closed Sessions ({closedSessions.length})</h2>
            <SessionTable 
              sessions={closedSessions.slice(0, 10)} 
              onClose={handleCloseSession}
            />
          </section>
        )}
      </main>

      {/* Agent Download Modal */}
      {newSession && (
        <AgentDownload result={newSession} onClose={() => setNewSession(null)} />
      )}
    </div>
  );
}
