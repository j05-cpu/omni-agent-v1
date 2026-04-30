/**
 * Digital Godfather - Professional Agent Chat UI
 * 
 * Integrated from AG-UI Protocol with Glassmorphism styling.
 * Real-time backend connection via Supabase.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useGodfatherStore } from '@/services/store';
import { executeAgentCommand } from '@/app/actions';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';
import { AgentConfig, AgentExecution, AgentLog } from '@/types';

// Icons
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
    <path d="M8.5 8.5v.01" />
    <path d="M16 15.5v.01" />
    <path d="M12 12v.01" />
    <path d="M11 17v.01" />
    <path d="M7 14v.01" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
  </svg>
);

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    idle: 'bg-zinc-500',
    running: 'bg-emerald-400 animate-pulse',
    completed: 'bg-blue-400',
    error: 'bg-red-400',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status] || colors.idle}`} />;
};

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: string;
  agentType?: string;
}

interface AgentChatProps {
  className?: string;
  onAgentSelect?: (agentId: string) => void;
  defaultAgent?: string;
}

/**
 * Professional Agent Chat Component
 * 
 * Features:
 * - Glassmorphism styling
 * - Real-time message streaming
 * - Agent status indicators
 * - Supabase persistence
 * - Digital Godfather branding
 */
export default function AgentChat({ className = '', onAgentSelect, defaultAgent = 'godfather' }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Digital Godfather.\n\nI\'m your AI agent orchestrator. Give me a mission and I\'ll execute it with precision.\n\nWhat would you like me to do?',
      timestamp: new Date(),
      status: 'completed',
      agentType: 'godfather',
    },
  ]);
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = getSupabaseClient();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Save message to Supabase
   */
  const saveMessage = async (message: Message) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      await supabase.from('agent_chat_messages').insert({
        id: message.id,
        role: message.role,
        content: message.content,
        agent_type: message.agentType || selectedAgent,
        session_id: 'default',
        created_at: message.timestamp.toISOString(),
      });
    } catch (err) {
      console.warn('[Chat] Save error:', err);
    }
  };

  /**
   * Handle message submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isExecuting) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsExecuting(true);

    // Save to database
    await saveMessage(userMessage);

    try {
      // Execute agent command
      const result = await executeAgentCommand(userMessage.content, selectedAgent as any);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: result.data?.output || result.message,
        timestamp: new Date(),
        status: result.data?.status || 'completed',
        agentType: selectedAgent,
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);

    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
        status: 'error',
        agentType: selectedAgent,
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessage(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  /**
   * Agent selector options
   */
  const agents = [
    { id: 'godfather', name: 'Digital Godfather', icon: '👑', status: 'idle' },
    { id: 'researcher', name: 'Research Analyst', icon: '🔍', status: 'idle' },
    { id: 'developer', name: 'Code Developer', icon: '💻', status: 'idle' },
    { id: 'writer', name: 'Content Writer', icon: '✍️', status: 'idle' },
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30">
            <span className="text-lg">👑</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Digital Godfather</h2>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <StatusDot status="completed" />
              <span>Ready</span>
            </div>
          </div>
        </div>
        
        {/* Agent Selector */}
        <select
          value={selectedAgent}
          onChange={(e) => {
            setSelectedAgent(e.target.value);
            onAgentSelect?.(e.target.value);
          }}
          className="px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
        >
          {agents.map(agent => (
            <option key={agent.id} value={agent.id} className="bg-zinc-900">
              {agent.icon} {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar */}
            {message.role !== 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30 shrink-0">
                <BotIcon />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-white'
                  : 'bg-zinc-900/50 border border-white/10 text-zinc-100'
              }`}
            >
              {/* Status indicator for assistant messages */}
              {message.role === 'assistant' && message.status && (
                <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                  <StatusDot status={message.status} />
                  <span>{message.status}</span>
                </div>
              )}
              
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
              
              <span className="text-xs text-zinc-600 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {/* User Avatar */}
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isExecuting && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30">
              <BotIcon />
            </div>
            <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Give me a mission..."
            disabled={isExecuting}
            className="flex-1 px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isExecuting || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-zinc-700 disabled:to-zinc-800 text-white rounded-xl transition-all disabled:opacity-50"
          >
            {isExecuting ? <LoaderIcon /> : <SendIcon />}
          </button>
        </div>
      </form>
    </div>
  );
}