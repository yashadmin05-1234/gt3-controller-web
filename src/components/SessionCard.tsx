'use client';
import { useState } from 'react';
import type { SessionRecord } from '@/lib/session';

interface Props {
  session: SessionRecord;
  onClose: (id: string) => void;
}

const stateColors: Record<string, string> = {
  waiting:    'bg-slate-800 text-slate-400',
  connecting: 'bg-blue-900/50 text-blue-400',
  active:     'bg-green-900/50 text-green-400',
  closed:     'bg-red-900/50 text-red-400',
};

export function SessionCard({ session, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const colorClass = stateColors[session.state] ?? 'bg-slate-800 text-slate-400';
  const age = Math.round((Date.now() - session.createdAt) / 1000);
  const ageLabel = age < 60 ? `${age}s ago` : `${Math.round(age / 60)}m ago`;

  function copyId() {
    navigator.clipboard.writeText(session.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-bg border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={copyId}
          className="font-mono text-xs text-slate-400 hover:text-accent transition-colors text-left truncate"
          title="Click to copy session ID"
        >
          {copied ? '✓ Copied!' : `${session.id.slice(0, 20)}…`}
        </button>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${colorClass}`}>{session.state.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-dim">Source</span>
          <p className="text-slate-200 font-medium font-mono truncate">{session.sourceId?.slice(0, 16) ?? '—'}</p>
        </div>
        <div>
          <span className="text-dim">Client</span>
          <p className="text-slate-200 font-medium font-mono truncate">{session.clientId?.slice(0, 16) ?? '—'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-dim">{ageLabel}</span>
        {session.state !== 'closed' && (
          <button
            onClick={() => onClose(session.id)}
            className="text-xs text-danger hover:text-red-300 transition-colors font-semibold"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
}
