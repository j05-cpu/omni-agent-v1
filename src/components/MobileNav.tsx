'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Terminal, 
  Search, 
  Settings,
  Plus,
  Activity,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const tabs: TabItem[] = [
  { href: '/', icon: Home, label: 'Hub' },
  { href: '/agents', icon: Users, label: 'Agents' },
  { href: '/terminal', icon: Terminal, label: 'Terminal' },
  { href: '/search', icon: Search, label: 'Search' },
];

export function MobileNav() {
  const pathname = usePathname();
  const [activeTab] = useState(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian-900/95 backdrop-blur-lg border-t border-emerald-500/20 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all',
                isActive 
                  ? 'text-emerald-400' 
                  : 'text-slate-500 hover:text-emerald-400/70'
              )}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Safe area bottom
export function SafeAreaBottom() {
  return <div className="h-safe-area-bottom" />;
}

// Page header
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-obsidian-900/95 backdrop-blur-lg border-b border-emerald-500/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-emerald-400">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
    </header>
  );
}

// Agent Card
interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    department: string;
  };
  onLaunch: () => void;
  isRunning?: boolean;
}

export function AgentCard({ agent, onLaunch, isRunning }: AgentCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-obsidian-800/50 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}30` }}
      >
        {agent.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-emerald-100 truncate">{agent.name}</h3>
        <p className="text-xs text-slate-500 truncate">{agent.description}</p>
      </div>
      <button
        onClick={onLaunch}
        disabled={isRunning}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
          isRunning 
            ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
            : 'bg-emerald-500/80 text-obsidian-900 hover:bg-emerald-400'
        )}
      >
        {isRunning ? 'Running' : 'Launch'}
      </button>
    </div>
  );
}

// Department Badge
export function DepartmentBadge({ department }: { department: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    dev: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    research: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    ops: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  };
  
  const { bg, text } = config[department] || config.dev;
  
  return (
    <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full uppercase', bg, text)}>
      {department}
    </span>
  );
}

// Status Badge
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    idle: { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400' },
    running: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400 animate-pulse' },
    completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  };
  
  const { bg, text, dot } = config[status] || config.idle;
  
  return (
    <span className={cn('flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full uppercase', bg, text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {status}
    </span>
  );
}

// Search Bar
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 bg-obsidian-800/50 border border-emerald-500/20 rounded-lg text-sm text-emerald-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
      />
    </div>
  );
}

// Empty State
export function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-12 h-12 text-emerald-500/30 mb-4" />
      <h3 className="text-sm font-medium text-emerald-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs">{description}</p>
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-500', sizes[size])} />
  );
}