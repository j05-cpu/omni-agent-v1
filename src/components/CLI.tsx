'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Terminal, ArrowRight, Loader2, X } from 'lucide-react';
import { useGodfatherStore, selectLogs, selectActiveExecution } from '@/services/store';
import { executionService } from '@/services/execution';
import { AgentType } from '@/types';

interface CLIComponentProps {
  onExecute?: (command: string, agent?: AgentType | 'godfather') => Promise<void>;
}

export default function CLIComponent({ onExecute }: CLIComponentProps) {
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | 'godfather'>('godfather');
  
  const logs = useGodfatherStore(selectLogs);
  const activeExecution = useGodfatherStore(selectActiveExecution);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isExecuting) return;

    const command = input.trim();
    setInput('');
    setIsExecuting(true);

    try {
      if (onExecute) {
        await onExecute(command, selectedAgentType === 'godfather' ? undefined : selectedAgentType);
      } else {
        await executionService.executeCommand(
          command, 
          selectedAgentType === 'godfather' ? undefined : selectedAgentType
        );
      }
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    useGodfatherStore.getState().clearLogs();
  };

  const agentOptions: { value: AgentType | 'godfather'; label: string }[] = [
    { value: 'godfather', label: 'Godfather' },
    { value: 'openclaw', label: 'OpenClaw' },
    { value: 'autogpt', label: 'AutoGPT' },
    { value: 'plandex', label: 'Plandex' },
  ];

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-amber-400';
      case 'debug': return 'text-emerald-400/70';
      default: return 'text-slate-300';
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-obsidian-800 rounded-lg border border-emerald-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-obsidian-700/50 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-400">COMMAND INTERFACE</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedAgentType}
            onChange={(e) => setSelectedAgentType(e.target.value as AgentType | 'godfather')}
            className="bg-obsidian-600 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30 focus:outline-none focus:border-emerald-500/50"
          >
            {agentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear logs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Area */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 bg-obsidian-900/50"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 text-center py-4">
            <span className="text-emerald-500/50">_</span> Waiting for commands...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-slate-500 shrink-0">[{formatTimestamp(log.timestamp)}]</span>
              <span className="text-emerald-600 shrink-0">[{log.source}]</span>
              <span className={getLogColor(log.level)}>{log.message}</span>
            </div>
          ))
        )}
        
        {/* Active Execution Indicator */}
        {isExecuting && (
          <div className="flex items-center gap-2 text-emerald-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Executing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-obsidian-700/30 border-t border-emerald-500/10">
        <span className="text-emerald-500 shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          disabled={isExecuting}
          className="flex-1 bg-transparent text-emerald-100 placeholder-slate-500 focus:outline-none text-sm font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || isExecuting}
          className="p-1.5 text-emerald-500 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isExecuting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}