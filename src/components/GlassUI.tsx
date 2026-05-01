'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard, GlassButton, GlassInput } from './GlassComponents';
import AgentChat from './AgentChat';
import { useSettingsStore, useKnowledgeStore, useSkillsStore, useChatStore } from '@/lib/stores';
import { 
  Home, Users, GraduationCap, ShoppingBag, Settings as SettingsIcon,
  Plus, X, ChevronRight, Crown, Zap, Shield, Key, Globe, Eye, EyeOff,
  Check, Download, Star, FileText, Image, Link2, Play, Square, Trash2
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { toast } from '@/components/Toast';

// ============================================================================
// Navigation
// ============================================================================

type TabId = 'home' | 'agents' | 'training' | 'market' | 'settings';

interface NavTab {
  id: TabId;
  icon: React.ElementType;
  label: string;
}

const navTabs: NavTab[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'agents', icon: Users, label: 'Agents' },
  { id: 'training', icon: GraduationCap, label: 'Training' },
  { id: 'market', icon: ShoppingBag, label: 'Market' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 glass-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navTabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors',
                isActive ? 'text-emerald-400' : 'text-slate-500'
              )}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {isActive && (
                <motion.div 
                  className="absolute bottom-2 w-6 h-0.5 bg-emerald-400 rounded-full"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ============================================================================
// Floating Terminal Button
// ============================================================================

interface FloatingTerminalProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingTerminalButton({ isOpen, onToggle }: FloatingTerminalProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full glass-button flex items-center justify-center',
        'hover:scale-110 transition-transform'
      )}
      whileTap={{ scale: 0.9 }}
      style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}
    >
      <Zap className={cn('w-6 h-6 text-emerald-400', isOpen && 'animate-pulse')} />
    </motion.button>
  );
}

// ============================================================================
// API Hub Settings
// ============================================================================

export function APISettings() {
  const { apis, setApiKey, setModel, toggleApi } = useSettingsStore();
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">API Hub</h2>
      </div>
      
      {apis.map((api) => (
        <motion.div
          key={api.provider}
          layout
          className="glass-card overflow-hidden"
        >
          <button
            onClick={() => setExpandedProvider(expandedProvider === api.provider ? null : api.provider)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${api.color}20` }}
              >
                {api.icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-white">{api.name}</h3>
                <p className="text-xs text-slate-400">
                  {api.enabled ? (api.selectedModel || 'Enabled') : 'Not configured'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  'w-2 h-2 rounded-full',
                  api.enabled ? 'bg-emerald-400' : 'bg-slate-600'
                )}
              />
              <ChevronRight className={cn(
                'w-4 h-4 text-slate-400 transition-transform',
                expandedProvider === api.provider && 'rotate-90'
              )} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedProvider === api.provider && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/5"
              >
                <div className="p-4 space-y-4">
                  {/* API Key Input */}
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      {api.requiresApiKey ? 'API Key' : 'Base URL'}
                    </label>
                    <div className="relative">
                      <GlassInput
                        type={showKey[api.provider] ? 'text' : 'password'}
                        value={api.apiKey || ''}
                        onChange={(e) => setApiKey(api.provider as any, e.target.value)}
                        placeholder={api.requiresApiKey ? 'sk-...' : 'http://localhost:11434/v1'}
                        className="pr-10"
                      />
                      <button
                        onClick={() => setShowKey(prev => ({ ...prev, [api.provider]: !prev[api.provider] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showKey[api.provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Model Selector */}
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Model</label>
                    <select
                      value={api.selectedModel || ''}
                      onChange={(e) => setModel(api.provider as any, e.target.value)}
                      className="w-full h-10 px-3 glass-input rounded-lg text-sm"
                    >
                      <option value="">Select model...</option>
                      {api.models.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Enable Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Enable Provider</span>
                    <button
                      onClick={() => toggleApi(api.provider as any, !api.enabled)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors relative',
                        api.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      )}
                    >
                      <motion.div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white"
                        animate={{ left: api.enabled ? '28px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// Agents View
// ============================================================================

export function AgentsView() {
  const { agents, toggleAgent } = useSettingsStore();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Digital Godfather Agents</h2>
      </div>
      
      {agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl glass-inner flex items-center justify-center text-2xl">
              {agent.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{agent.name}</h3>
              <p className="text-xs text-slate-400">{agent.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {agent.skills.map((skill) => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full glass-inner text-emerald-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => toggleAgent(agent.id, !agent.enabled)}
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                agent.enabled ? 'bg-emerald-500' : 'bg-slate-700'
              )}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                animate={{ left: agent.enabled ? '28px' : '4px' }}
              />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// Training Hub
// ============================================================================

export function TrainingHub() {
  const { items, addItem, removeItem } = useKnowledgeStore();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<'pdf' | 'text' | 'image' | 'youtube'>('text');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  
  const handleUpload = () => {
    if (!uploadTitle || !uploadContent) {
      toast.error('Please fill in all fields');
      return;
    }
    addItem({
      type: uploadType,
      title: uploadTitle,
      source: uploadType === 'youtube' ? uploadContent : 'Local upload',
      content: uploadContent,
    });
    toast.success('Knowledge uploaded successfully');
    setShowUpload(false);
    setUploadTitle('');
    setUploadContent('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Training Hub</h2>
        </div>
        <GlassButton onClick={() => setShowUpload(true)} icon={Plus} size="sm" />
      </div>
      
      {items.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FileText className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No knowledge uploaded yet</p>
          <p className="text-xs text-slate-500 mt-1">Upload PDFs, text, images, or YouTube links</p>
        </div>
      ) : (
        items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass-inner flex items-center justify-center">
                {item.type === 'pdf' ? <FileText className="w-5 h-5 text-red-400" /> :
                 item.type === 'image' ? <Image className="w-5 h-5 text-blue-400" /> :
                 item.type === 'youtube' ? <Play className="w-5 h-5 text-red-400" /> :
                 <FileText className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.source}</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))
      )}
      
      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Add Knowledge</h3>
                <button onClick={() => setShowUpload(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-2 mb-4">
                {(['text', 'pdf', 'image', 'youtube'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setUploadType(type)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
                      uploadType === type 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'glass-inner text-slate-400'
                    )}
                  >
                    {type === 'text' && <FileText className="w-4 h-4 mx-auto mb-1" />}
                    {type === 'pdf' && <FileText className="w-4 h-4 mx-auto mb-1" />}
                    {type === 'image' && <Image className="w-4 h-4 mx-auto mb-1" />}
                    {type === 'youtube' && <Link2 className="w-4 h-4 mx-auto mb-1" />}
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Title</label>
                  <GlassInput
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    {uploadType === 'youtube' ? 'YouTube URL' : 'Content'}
                  </label>
                  <textarea
                    value={uploadContent}
                    onChange={(e) => setUploadContent(e.target.value)}
                    placeholder={uploadType === 'youtube' ? 'https://youtube.com/...' : 'Enter content...'}
                    className="w-full h-32 px-3 py-2 glass-input rounded-lg text-sm resize-none"
                  />
                </div>
                <GlassButton onClick={handleUpload} className="w-full" icon={Check}>
                  Upload Knowledge
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Skills Market
// ============================================================================

export function SkillsMarket() {
  const { marketplace, installed, installSkill, uninstallSkill } = useSkillsStore();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Skills Market</h2>
      </div>
      
      {installed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs text-slate-400 uppercase mb-2">Installed</h3>
          <div className="flex flex-wrap gap-2">
            {installed.map((skill) => (
              <motion.div
                key={skill.id}
                layout
                className="flex items-center gap-2 px-3 py-2 rounded-full glass-inner"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid gap-3">
        {marketplace.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl glass-inner flex items-center justify-center text-xl">
                📦
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white">{skill.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full glass-inner text-slate-400">
                    v{skill.version}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {skill.installs.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    {skill.rating}
                  </span>
                </div>
              </div>
              <GlassButton
                onClick={() => skill.installed ? uninstallSkill(skill.id) : installSkill(skill.id)}
                variant={skill.installed ? 'secondary' : 'primary'}
                size="sm"
              >
                {skill.installed ? 'Installed' : 'Install'}
              </GlassButton>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Home View
// ============================================================================

export function HomeView() {
  const { agents, tools, activeAgent, setActiveAgent } = useSettingsStore();
  const { messages } = useChatStore();
  
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass-card p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full glass-inner mx-auto mb-4 flex items-center justify-center"
        >
          <Crown className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <h1 className="text-xl font-bold text-white mb-2">Digital Godfather</h1>
        <p className="text-sm text-slate-400">Your AI Agent Operating System</p>
      </div>
      
      {/* Active Agent */}
      <div className="glass-card p-4">
        <h3 className="text-xs text-slate-400 uppercase mb-3">Active Agent</h3>
        <div className="flex items-center gap-3">
          {agents.find(a => a.id === activeAgent) && (
            <>
              <div className="w-12 h-12 rounded-xl glass-inner flex items-center justify-center text-xl">
                {agents.find(a => a.id === activeAgent)?.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  {agents.find(a => a.id === activeAgent)?.name}
                </h4>
                <p className="text-xs text-slate-400">Ready to assist</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Quick Tools */}
      <div className="glass-card p-4">
        <h3 className="text-xs text-slate-400 uppercase mb-3">Quick Tools</h3>
        <div className="grid grid-cols-5 gap-2">
          {tools.filter(t => t.enabled).map((tool) => (
            <motion.button
              key={tool.id}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 p-2 glass-inner rounded-lg"
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-[10px] text-slate-400 truncate w-full text-center">
                {tool.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white">{messages.length}</span>
          <span className="text-[10px] text-slate-400 block">Messages</span>
        </div>
        <div className="glass-card p-3 text-center">
          <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white">{agents.length}</span>
          <span className="text-[10px] text-slate-400 block">Agents</span>
        </div>
        <div className="glass-card p-3 text-center">
          <Crown className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-white">v3.0</span>
          <span className="text-[10px] text-slate-400 block">Version</span>
        </div>
      </div>
    </div>
  );
}

// Export components
export { GlassCard, GlassButton, GlassInput } from './GlassComponents';
export { GraduationCap, ShoppingBag } from 'lucide-react';