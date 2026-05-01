/**
 * Digital Godfather - Professional Action Buttons
 * 
 * Glassmorphism styled action buttons inspired by AG-UI.
 * Connect to backend execution via Supabase.
 */

'use client';

import { useState } from 'react';
import { executeAgentCommand } from '@/app/actions';
import { AgentConfig, AgentExecution } from '@/types';

interface ActionButtonProps {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onExecute?: (actionId: string) => Promise<void>;
}

interface ActionButtonsProps {
  actions: ActionButtonProps[];
  onAction?: (actionId: string, result: AgentExecution) => void;
  className?: string;
}

/**
 * Single Action Button
 */
function ActionButton({ 
  action, 
  onExecute, 
  disabled 
}: { 
  action: ActionButtonProps; 
  onExecute?: (id: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onExecute?.(action.id);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = `
    group relative flex items-center gap-3 px-5 py-4 
    rounded-xl border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-amber-500/20 to-amber-600/10 
      border-amber-500/30 hover:border-amber-500/50 hover:from-amber-500/30 hover:to-amber-600/20
      text-white
    `,
    secondary: `
      bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-white/5
      text-zinc-300 hover:text-white
    `,
    ghost: `
      bg-transparent border-transparent hover:bg-white/5
      text-zinc-400 hover:text-white
    `,
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[action.variant || 'secondary']}`}
    >
      {/* Icon */}
      {action.icon && (
        <span className="text-xl">{action.icon}</span>
      )}

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="font-medium">{action.label}</div>
        {action.description && (
          <div className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {action.description}
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <svg 
          className="w-5 h-5 animate-spin text-amber-500" 
          viewBox="0 0 24 24"
        >
          <circle 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="32" 
            strokeDashoffset="12" 
          />
        </svg>
      )}

      {/* Arrow Icon (show when not loading) */}
      {!isLoading && (
        <svg 
          className="w-5 h-5 text-zinc-600 group-hover:text-amber-500 transition-colors" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

/**
 * Action Buttons Container
 * 
 * Features:
 * - Glassmorphism styling
 * - Loading states per button
 * - Callback on execution
 * - Supabase event logging
 */
export default function ActionButtons({ 
  actions, 
  onAction,
  className = '' 
}: ActionButtonsProps) {
  const [executingId, setExecutingId] = useState<string | null>(null);

  const handleExecute = async (actionId: string) => {
    setExecutingId(actionId);
    
    try {
      const result = await executeAgentCommand(actionId, 'godfather');
      onAction?.(actionId, result.data!);
    } catch (error) {
      console.error('[ActionButton] Error:', error);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {actions.map(action => (
        <ActionButton
          key={action.id}
          action={action}
          onExecute={handleExecute}
          disabled={executingId !== null && executingId !== action.id}
        />
      ))}
    </div>
  );
}

/**
 * Predefined action sets for Digital Godfather
 */
export const GODFATHER_ACTIONS = {
  quick: [
    { id: 'research', label: 'Research Topic', description: 'Search and analyze information', icon: '🔍', variant: 'secondary' as const },
    { id: 'code', label: 'Generate Code', description: 'Write clean, efficient code', icon: '💻', variant: 'secondary' as const },
    { id: 'write', label: 'Write Content', description: 'Create engaging content', icon: '✍️', variant: 'secondary' as const },
  ],
  main: [
    { id: 'orchestrate', label: 'Orchestrate Mission',   description: 'Deploy multiple agents', icon: '👑', variant: 'primary' as const },
    { id: 'research', label: 'Research & Analyze',       description: 'Deep research with sources', icon: '🔬', variant: 'secondary' as const },
    { id: 'develop', label: 'Code & Build',            description: 'Full-stack development', icon: '⚡', variant: 'secondary' as const },
    { id: 'create', label: 'Create Content',        description: 'Marketing & docs', icon: '🎨', variant: 'secondary' as const },
    { id: 'automate', label: 'Automate Workflow',   description: 'Set up automation', icon: '🔄', variant: 'secondary' as const },
  ],
  admin: [
    { id: 'status', label: 'Agent Status', description: 'View all agent states', icon: '📊', variant: 'ghost' as const },
    { id: 'memory', label: 'View Memory', description: 'Agent conversation history', icon: '🧠', variant: 'ghost' as const },
    { id: 'logs', label: 'System Logs', description: 'Execution logs', icon: '📋', variant: 'ghost' as const },
  ],
};