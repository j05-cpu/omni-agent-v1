'use client';

import { useEffect } from 'react';
import { 
  Crown, 
  Activity, 
  Server, 
  Settings, 
  Zap,
  Eye,
  Layers
} from 'lucide-react';
import CLIComponent from '@/components/CLI';
import NeuralMap from '@/components/NeuralMap';
import PreviewWindow from '@/components/PreviewWindow';
import { useGodfatherStore } from '@/services/store';
import { executionService } from '@/services/execution';
import { AgentType } from '@/types';

export default function Dashboard() {
  const setSelectedAgent = useGodfatherStore((state) => state.setSelectedAgent);

  // Initialize first log message
  useEffect(() => {
    useGodfatherStore.getState().addLog({
      id: 'init',
      timestamp: new Date(),
      level: 'info',
      message: '[Godfather] Initialized. The family is assembled. Waiting for commands.',
      source: 'system',
    });
  }, []);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgent(agentId as 'godfather' | 'openclaw' | 'autogpt' | 'plandex');
  };

  const handleExecute = async (command: string, agent?: AgentType | 'godfather') => {
    await executionService.executeCommand(command, agent);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Crown className="w-8 h-8 text-emerald-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-400 tracking-tight">
                  DIGITAL GODFATHER
                </h1>
                <p className="text-xs text-slate-500 tracking-widest uppercase">
                  Core Control Unit
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge icon={<Activity className="w-3.5 h-3.5" />} label="System" status="active" />
            <StatusBadge icon={<Server className="w-3.5 h-3.5" />} label="Agents" status="3" />
            <StatusBadge icon={<Zap className="w-3.5 h-3.5" />} label="Status" status="ready" />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Panel - Neural Map */}
        <div className="lg:col-span-3 h-[400px] lg:h-[calc(100vh-180px)]">
          <NeuralMap onSelectAgent={handleSelectAgent} />
        </div>

        {/* Center Panel - CLI */}
        <div className="lg:col-span-4 h-[400px] lg:h-[calc(100vh-180px)]">
          <CLIComponent onExecute={handleExecute} />
        </div>

        {/* Right Panel - Preview Window */}
        <div className="lg:col-span-5 h-[400px] lg:h-[calc(100vh-180px)]">
          <PreviewWindow />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-emerald-500/10">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              v1.0.0
            </span>
            <span>•</span>
            <span>Self-Hosted Agent Ecosystem</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
            <span>Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ 
  icon, 
  label, 
  status 
}: { 
  icon: React.ReactNode; 
  label: string; 
  status: string 
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian-700/50 rounded-md border border-emerald-500/10">
      <span className="text-emerald-500">{icon}</span>
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs text-emerald-400 font-medium">{status}</span>
    </div>
  );
}