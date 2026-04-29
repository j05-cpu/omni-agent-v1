'use client';

import { GitBranch, Circle, ChevronRight, Bot, Network, Cpu, Loader2 } from 'lucide-react';
import { useGodfatherStore, selectNeuralMap, selectAgentStatuses, selectSelectedAgent } from '@/services/store';
import { NeuralNode, AgentStatus } from '@/types';

interface NeuralMapProps {
  onSelectAgent?: (agentId: string) => void;
}

export default function NeuralMap({ onSelectAgent }: NeuralMapProps) {
  const neuralMap = useGodfatherStore(selectNeuralMap);
  const agentStatuses = useGodfatherStore(selectAgentStatuses);
  const selectedAgent = useGodfatherStore(selectSelectedAgent);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return 'text-emerald-400 animate-pulse';
      case 'completed':
        return 'text-emerald-500';
      case 'error':
        return 'text-red-400';
      case 'paused':
        return 'text-amber-400';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    if (status === 'running') {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }
    return <Circle className="w-2 h-2" />;
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'godfather':
        return <Network className="w-4 h-4" />;
      case 'agent':
        return <Bot className="w-4 h-4" />;
      case 'task':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (onSelectAgent) {
      onSelectAgent(nodeId);
    }
  };

  const renderNode = (node: NeuralNode, depth: number = 0) => {
    const isSelected = selectedAgent === node.id || 
      (node.id === 'godfather' && selectedAgent === 'godfather');
    const status = agentStatuses[`${node.id}-001`] || node.status;

    return (
      <div 
        key={node.id} 
        className="relative"
        style={{ paddingLeft: depth * 20 }}
      >
        {/* Connection Line */}
        {depth > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-emerald-500/20"
            style={{ left: -10 }}
          />
        )}
        
        <div
          onClick={() => handleNodeClick(node.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
            transition-all duration-200 group
            ${isSelected 
              ? 'bg-emerald-500/10 border border-emerald-500/30' 
              : 'hover:bg-obsidian-700/50 border border-transparent'
            }
          `}
        >
          {/* Expand/Collapse for nodes with children */}
          {node.children && node.children.length > 0 && (
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          )}
          
          {/* Node Icon */}
          <span className={`${getStatusColor(status)}`}>
            {getNodeIcon(node.type)}
          </span>
          
          {/* Node Label */}
          <span className={`text-sm font-medium ${
            isSelected ? 'text-emerald-400' : 'text-slate-300'
          }`}>
            {node.label}
          </span>
          
          {/* Status Indicator */}
          <span className={`${getStatusColor(status)} ml-auto`}>
            {getStatusIcon(status)}
          </span>
        </div>
        
        {/* Render Children */}
        {node.children && node.children.length > 0 && (
          <div className="ml-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-obsidian-800 rounded-lg border border-emerald-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-obsidian-700/50 border-b border-emerald-500/10">
        <GitBranch className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-emerald-400">NEURAL MAP</span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {renderNode(neuralMap)}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-obsidian-700/30 border-t border-emerald-500/10">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 text-slate-500" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1">
            <Loader2 className="w-2 h-2 text-emerald-400 animate-spin" />
            <span>Running</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 text-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 text-red-400" />
            <span>Error</span>
          </div>
        </div>
      </div>
    </div>
  );
}