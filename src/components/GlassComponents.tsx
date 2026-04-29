'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

/**
 * Glassmorphism UI Components
 * 
 * Premium glass effects with emerald glow borders.
 * Mobile-optimized with touch-friendly interactions.
 */

// ============================================================================
// Glass Card
// ============================================================================

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glow, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl',
        glow && 'glow-border',
        onClick && 'cursor-pointer',
        className
      )}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Glass Button
// ============================================================================

interface GlassButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
}

export function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  className,
  disabled 
}: GlassButtonProps) {
  const variants = {
    primary: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30',
    secondary: 'glass-inner text-slate-300 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'flex items-center justify-center rounded-xl font-medium transition-all',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}

// ============================================================================
// Glass Input
// ============================================================================

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('glass-input rounded-lg px-4 py-2 text-sm', className)}
        {...props}
      />
    );
  }
);

GlassInput.displayName = 'GlassInput';

// ============================================================================
// Glass Modal / Drawer
// ============================================================================

interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function GlassDrawer({ isOpen, onClose, children, title }: GlassDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md"
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl glass-card overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 rounded-full bg-slate-600" />
        </div>
        
        {title && (
          <div className="px-4 pb-3 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
        )}
        
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Full Screen Overlay
// ============================================================================

interface FullScreenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function FullScreenOverlay({ isOpen, onClose, children, title }: FullScreenOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-obsidian-950/90 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0 }}
        className="absolute inset-4 rounded-2xl glass-card overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">{title || 'Terminal'}</h2>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-lg glass-inner flex items-center justify-center text-slate-400"
          >
            ✕
          </motion.button>
        </div>
        
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Status Badge
// ============================================================================

interface StatusBadgeProps {
  status: 'idle' | 'running' | 'completed' | 'error';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = {
    idle: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400' },
    running: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400 animate-pulse' },
    completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  };
  
  const { bg, text, dot } = config[status];
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium uppercase',
      bg, text,
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {status}
    </span>
  );
}

// ============================================================================
// Progress Bar
// ============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, max = 100, color = '#10b981', size = 'md' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn(
      'w-full rounded-full bg-white/10 overflow-hidden',
      size === 'sm' ? 'h-1' : 'h-2'
    )}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ============================================================================
// Avatar
// ============================================================================

interface AvatarProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Avatar({ icon, size = 'md', color }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
  };
  
  return (
    <div 
      className={cn(
        'rounded-xl glass-inner flex items-center justify-center',
        sizes[size]
      )}
      style={color ? { backgroundColor: `${color}20` } : undefined}
    >
      {icon}
    </div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl glass-inner flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-emerald-400/50" />
      </div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}