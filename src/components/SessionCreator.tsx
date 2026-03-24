'use client';
import { useState } from 'react';
import type { CreateSessionResponse } from '@/types/session';

interface Props {
  onCreated: (result: CreateSessionResponse) => void;
}

export function SessionCreator({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [sourceName, setSourceName] = useState('');

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sourceName || 'Unnamed Session' }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = (await res.json()) as CreateSessionResponse;
      onCreated(data);
      setSourceName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Session name (optional)"
        value={sourceName}
        onChange={(e) => setSourceName(e.target.value)}
        className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-dim outline-none focus:border-accent transition-colors flex-1 max-w-xs"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-dim text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
      >
        {loading ? 'Creating…' : '+ New Session'}
      </button>
    </div>
  );
}
