'use client';
import { useState } from 'react';
import type { SessionRecord } from '@/lib/session';

interface Props {
  sessions: SessionRecord[];
  onClose: (id: string) => void;
}

const stateColors: Record<string, string> = {
  waiting:    'bg-slate-800 text-slate-400',
  connecting: 'bg-blue-900/50 text-blue-400',
  active:     'bg-green-900/50 text-green-400',
  closed:     'bg-red-900/50 text-red-400',
};

export function SessionTable({ sessions, onClose }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyId(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function getAge(createdAt: number): string {
    const age = Math.round((Date.now() - createdAt) / 1000);
    if (age < 60) return `${age}s ago`;
    if (age < 3600) return `${Math.round(age / 60)}m ago`;
    return `${Math.round(age / 3600)}h ago`;
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-dim text-sm">
        No sessions found.
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Session ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Client</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Created</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-dim uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.map((session) => {
              const colorClass = stateColors[session.state] ?? 'bg-slate-800 text-slate-400';
              const isCopied = copiedId === session.id;
              
              return (
                <tr key={session.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyId(session.id)}
                      className="font-mono text-xs text-slate-400 hover:text-accent transition-colors"
                      title="Click to copy"
                    >
                      {isCopied ? '✓ Copied!' : `${session.id.slice(0, 24)}...`}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${colorClass}`}>
                      {session.state.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-200">
                      {session.sourceId?.slice(0, 20) ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-200">
                      {session.clientId?.slice(0, 20) ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-dim">{getAge(session.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {session.state !== 'closed' ? (
                      <button
                        onClick={() => onClose(session.id)}
                        className="text-xs text-danger hover:text-red-300 transition-colors font-semibold"
                      >
                        End Session
                      </button>
                    ) : (
                      <span className="text-xs text-dim">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
