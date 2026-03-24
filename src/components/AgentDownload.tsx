'use client';
import { useState } from 'react';
import type { CreateSessionResponse } from '@/types/session';

interface Props {
  result: CreateSessionResponse;
  onClose: () => void;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div>
      <p className="text-xs text-dim mb-1 font-semibold uppercase tracking-wide">{label}</p>
      <div className="bg-bg border border-border rounded-lg px-3 py-2 flex items-center gap-2">
        <code className="flex-1 text-xs text-slate-200 font-mono break-all">{value}</code>
        <button
          onClick={copy}
          className="shrink-0 text-dim hover:text-accent transition-colors text-base"
          title="Copy"
        >
          {copied ? '✓' : '⎘'}
        </button>
      </div>
    </div>
  );
}

export function AgentDownload({ result, onClose }: Props) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    // Minimized floating bar at bottom
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-surface border border-accent rounded-lg shadow-2xl p-3 flex items-center gap-3 max-w-md">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-200 mb-1">Session: {result.sessionId.slice(0, 8)}...</p>
            <p className="text-xs text-dim">Token & ID available</p>
          </div>
          <button
            onClick={() => setMinimized(false)}
            className="bg-accent hover:bg-accent/80 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            Show
          </button>
          <button
            onClick={onClose}
            className="text-dim hover:text-slate-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-200">Session Created</h2>
            {result.name && (
              <p className="text-sm text-accent mt-1">{result.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMinimized(true)} 
              className="text-dim hover:text-slate-200 text-xl leading-none px-2"
              title="Minimize"
            >
              −
            </button>
            <button onClick={onClose} className="text-dim hover:text-slate-200 text-xl leading-none">×</button>
          </div>
        </div>

        <div className="space-y-3">
          <CopyField label="Session ID (paste into client app)" value={result.sessionId} />
          <CopyField label="Token (for source agent)" value={result.token} />
          <div>
            <p className="text-xs text-dim mb-1 font-semibold uppercase tracking-wide">Run on source machine</p>
            {result.agentDownloadUrl !== '#' ? (
              <p className="text-xs text-muted mb-1">
                <a href={result.agentDownloadUrl} className="text-accent underline hover:text-accent/80">Download source-agent.exe</a>
                {' '}then run:
              </p>
            ) : (
              <p className="text-xs text-muted mb-1">Navigate to <code className="text-accent">apps/source-agent/</code> then:</p>
            )}
            <CopyField label="" value={result.agentCommand} />
          </div>
        </div>

        <div className="mt-4 bg-bg border border-border rounded-lg p-3 text-xs text-dim">
          Token expires: <span className="text-slate-300">{new Date(result.expiresAt).toLocaleString()}</span>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <p className="text-xs text-dim">Session ID and Token remain accessible after minimizing</p>
          <button
            onClick={() => setMinimized(true)}
            className="bg-accent hover:bg-accent/80 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
}
