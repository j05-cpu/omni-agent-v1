'use client';

import { useState, useEffect } from 'react';
import { 
  Crown, 
  Terminal, 
  Search,
  Zap,
  Activity,
  Play,
  X,
  Workflow,
  Home,
  Code,
  Microscope,
  Settings
} from 'lucide-react';
import { AGENTS, DEPARTMENT_CONFIG, AgentConfig, getAgentsByDepartment } from '@/lib/agents/SkillsConfig';
import { agentManager, executeAgentTask, AgentTask } from '@/lib/agents/AgentManager';
import { MobileNav, PageHeader, SearchBar, StatusBadge } from '@/components/MobileNav';
import { toast } from '@/components/Toast';

type View = 'hub' | 'agents' | 'terminal' | 'search';
type Department = 'dev' | 'research' | 'ops';

export default function Dashboard() {
  const [view, setView] = useState<View>('hub');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('dev');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  // Refresh tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(agentManager.getAllTasks());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter agents by search
  const filteredAgents = searchQuery
    ? AGENTS.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.skillset.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : getAgentsByDepartment(selectedDepartment);

  const handleLaunch = async (agent: AgentConfig) => {
    setIsExecuting(agent.id);
    try {
      const result = await executeAgentTask(agent.id, `Execute ${agent.name} task`);
      if (result.success) {
        toast.success(`${agent.name} launched`);
      } else {
        toast.error(result.error || 'Failed to launch agent');
      }
    } finally {
      setIsExecuting(null);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 pb-20">
      {/* Header */}
      <PageHeader 
        title="Digital Godfather" 
        subtitle="30 Agents • Mobile-First Agent OS"
      />

      {/* Hub View */}
      {view === 'hub' && (
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Workflow} label="Total Agents" value="30" color="#10b981" />
            <StatCard icon={Activity} label="Active" value={tasks.filter(t => t.status === 'running').length.toString()} color="#3b82f6" />
            <StatCard icon={Zap} label="Completed" value={tasks.filter(t => t.status === 'completed').length.toString()} color="#f59e0b" />
          </div>

          {/* Department Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['dev', 'research', 'ops'] as Department[]).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedDepartment === dept 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-obsidian-800/50 text-slate-400 border border-transparent'
                }`}
              >
                <span>{DEPARTMENT_CONFIG[dept].icon}</span>
                <span>{DEPARTMENT_CONFIG[dept].label}</span>
              </button>
            ))}
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredAgents.slice(0, 6).map((agent) => (
              <AgentCardMini 
                key={agent.id} 
                agent={agent} 
                onLaunch={() => handleLaunch(agent)}
                isRunning={isExecuting === agent.id}
              />
            ))}
          </div>

          {/* Recent Tasks */}
          {tasks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-emerald-100 mb-3">Recent Tasks</h3>
              <div className="space-y-2">
                {tasks.slice(-5).reverse().map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agents View */}
      {view === 'agents' && (
        <div className="p-4 space-y-4">
          {/* Department Filter */}
          <div className="flex flex-col gap-2">
            {(Object.entries(DEPARTMENT_CONFIG) as [Department, { icon: string; label: string; color: string }][]).map(([dept, config]) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept as Department)}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  selectedDepartment === dept 
                    ? 'bg-obsidian-800 border-emerald-500/30' 
                    : 'bg-obsidian-800/30 border-transparent hover:border-emerald-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-emerald-100">{config.label}</h3>
                    <p className="text-xs text-slate-500">{getAgentsByDepartment(dept as Department).length} agents</p>
                  </div>
                </div>
                {selectedDepartment === dept && (
                  <span className="text-emerald-400">→</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal View */}
      {view === 'terminal' && (
        <div className="p-4 h-[calc(100vh-180px)]">
          <TerminalView 
            tasks={tasks} 
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
          />
        </div>
      )}

      {/* Search View */}
      {view === 'search' && (
        <div className="p-4 space-y-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search agents, tasks, skills..."
          />
          <div className="space-y-2">
            {filteredAgents.map((agent) => (
              <AgentCardList
                key={agent.id}
                agent={agent}
                onLaunch={() => handleLaunch(agent)}
                isRunning={isExecuting === agent.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileNavCustom view={view} onChange={setView} />

      {/* Task Drawer */}
      {selectedTask && (
        <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-obsidian-800/50 rounded-lg border border-emerald-500/10">
      <Icon className="w-5 h-5 mb-2" style={{ color }} />
      <span className="text-lg font-bold text-emerald-100">{value}</span>
      <span className="text-[10px] text-slate-500 uppercase">{label}</span>
    </div>
  );
}

// Agent Card Mini
function AgentCardMini({ agent, onLaunch, isRunning }: { 
  agent: AgentConfig; 
  onLaunch: () => void;
  isRunning: boolean;
}) {
  return (
    <button
      onClick={onLaunch}
      disabled={isRunning}
      className="flex flex-col items-center justify-center p-4 bg-obsidian-800/50 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-all disabled:opacity-50"
    >
      <span className="text-3xl mb-2">{agent.icon}</span>
      <span className="text-xs font-medium text-emerald-100">{agent.displayName}</span>
      <span 
        className="w-2 h-2 rounded-full mt-2 animate-pulse"
        style={{ backgroundColor: isRunning ? agent.color : 'transparent' }}
      />
    </button>
  );
}

// Task Card
function TaskCard({ task, onClick }: { task: AgentTask; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-3 bg-obsidian-800/50 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div className="text-left">
          <h4 className="text-xs font-medium text-emerald-100">{task.agentName}</h4>
          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{task.command}</p>
        </div>
      </div>
      <StatusBadge status={task.status} />
    </button>
  );
}

// Terminal View
function TerminalView({ tasks, selectedTask, onSelectTask }: { 
  tasks: AgentTask[];
  selectedTask: AgentTask | null;
  onSelectTask: (task: AgentTask | null) => void;
}) {
  return (
    <div className="flex flex-col h-full bg-obsidian-900 rounded-lg border border-emerald-500/20 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-obsidian-800/50 border-b border-emerald-500/10">
        <Terminal className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-400">Live Terminal</span>
      </div>
      
      {/* Log Output */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
        {selectedTask ? (
          <div className="space-y-1">
            <div className="text-emerald-100/60 mb-2">
              [{new Date(selectedTask.startTime).toLocaleTimeString()}] {selectedTask.agentName} started
            </div>
            {selectedTask.logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={log.level === 'error' ? 'text-red-400' : log.level === 'debug' ? 'text-emerald-400/60' : 'text-emerald-100/80'}>
                  {log.message}
                </span>
              </div>
            ))}
            {selectedTask.status === 'running' && (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="animate-pulse">▊</span>
                <span>Executing...</span>
              </div>
            )}
            {selectedTask.output && (
              <pre className="mt-4 text-emerald-100 whitespace-pre-wrap">{selectedTask.output}</pre>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-8">
            Select a task to view logs
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="border-t border-emerald-500/10">
        <div className="flex gap-1 p-2 overflow-x-auto">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onSelectTask(task)}
              className={`px-3 py-1.5 text-xs rounded transition-all ${
                selectedTask?.id === task.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-obsidian-800/50 text-slate-400'
              }`}
            >
              {task.agentName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Agent Card List
function AgentCardList({ agent, onLaunch, isRunning }: { 
  agent: AgentConfig; 
  onLaunch: () => void;
  isRunning: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-obsidian-800/50 rounded-lg border border-emerald-500/10">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}30` }}
      >
        {agent.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-emerald-100">{agent.displayName}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {agent.skillset.slice(0, 3).map(skill => (
            <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-obsidian-700 rounded text-slate-400">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={onLaunch}
        disabled={isRunning}
        className="px-3 py-1.5 text-xs font-medium bg-emerald-500/80 text-obsidian-900 rounded-md hover:bg-emerald-400 disabled:opacity-50"
      >
        {isRunning ? '...' : 'Launch'}
      </button>
    </div>
  );
}

// Mobile Nav Custom
function MobileNavCustom({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const tabs = [
    { id: 'hub', icon: Home, label: 'Hub' },
    { id: 'agents', icon: Workflow, label: 'Flow' },
    { id: 'terminal', icon: Terminal, label: 'Logs' },
    { id: 'search', icon: Search, label: 'Search' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian-900/95 backdrop-blur-lg border-t border-emerald-500/20">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id as View)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-2 w-4 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Task Drawer
function TaskDrawer({ task, onClose }: { task: AgentTask; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-obsidian-800 rounded-t-2xl border-t border-emerald-500/20 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/10">
          <div>
            <h3 className="text-sm font-medium text-emerald-100">{task.agentName}</h3>
            <p className="text-xs text-slate-500">{task.command}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <pre className="text-xs text-emerald-100/80 whitespace-pre-wrap font-mono">
            {task.output || task.logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.message}`).join('\n')}
          </pre>
        </div>

        <div className="p-4 border-t border-emerald-500/10">
          <StatusBadge status={task.status} />
        </div>
      </div>
    </div>
  );
}