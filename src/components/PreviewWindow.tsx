'use client';

import { Monitor, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { useGodfatherStore, selectActiveExecution, selectSelectedAgent } from '@/services/store';
import { useState, useEffect } from 'react';

export default function PreviewWindow() {
  const activeExecution = useGodfatherStore(selectActiveExecution);
  const selectedAgent = useGodfatherStore(selectSelectedAgent);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    if (activeExecution?.output) {
      await navigator.clipboard.writeText(activeExecution.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getAgentDisplayName = (agentId: string) => {
    const map: Record<string, string> = {
      'godfather': 'Godfather',
      'godfather-001': 'Godfather',
      'openclaw': 'OpenClaw',
      'openclaw-001': 'OpenClaw',
      'autogpt': 'AutoGPT',
      'autogpt-001': 'AutoGPT',
      'plandex': 'Plandex',
      'plandex-001': 'Plandex',
    };
    return map[agentId] || agentId;
  };

  return (
    <div className={`flex flex-col h-full bg-obsidian-800 rounded-lg border border-emerald-500/20 overflow-hidden transition-all ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-obsidian-700/50 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-400">PREVIEW WINDOW</span>
          {selectedAgent && (
            <span className="text-xs text-slate-500">
              / {getAgentDisplayName(selectedAgent)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            disabled={!activeExecution?.output}
            className="p-1.5 text-slate-400 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Copy output"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-obsidian-900/50 p-4">
        {activeExecution ? (
          <div className="font-mono text-sm">
            {/* Execution Info */}
            <div className="mb-4 pb-4 border-b border-emerald-500/10">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                <span>ID: <span className="text-emerald-400/70">{activeExecution.id}</span></span>
                <span>Status: <span className={`${
                  activeExecution.status === 'completed' ? 'text-emerald-400' :
                  activeExecution.status === 'error' ? 'text-red-400' :
                  activeExecution.status === 'running' ? 'text-amber-400' :
                  'text-slate-400'
                }`}>{activeExecution.status}</span></span>
              </div>
              <div className="text-xs text-slate-500">
                Command: <span className="text-emerald-100">{activeExecution.command}</span>
              </div>
            </div>

            {/* Output */}
            {activeExecution.output && (
              <div className="whitespace-pre-wrap text-emerald-100/90 leading-relaxed">
                {activeExecution.output}
              </div>
            )}

            {/* Error */}
            {activeExecution.error && (
              <div className="text-red-400">
                Error: {activeExecution.error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Monitor className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
              <p>No execution data</p>
              <p className="text-xs text-slate-600 mt-2">Execute a command to see output here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-obsidian-700/30 border-t border-emerald-500/10 flex items-center justify-between">
        <div className="text-xs text-slate-600">
          {activeExecution && (
            <>
              Started: {new Date(activeExecution.startTime).toLocaleTimeString()}
              {activeExecution.endTime && (
                <> • Duration: {
                  Math.round((new Date(activeExecution.endTime).getTime() - new Date(activeExecution.startTime).getTime()) / 1000)
                }s</>
              )}
            </>
          )}
        </div>
        <div className="text-xs text-slate-600">
          {activeExecution?.output && `${activeExecution.output.split('\n').length} lines`}
        </div>
      </div>
    </div>
  );
}