'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Image, Link2, Send, Plus, X, Zap, Settings as SettingsIcon,
  Crown, Globe, Code, Database, Terminal, Users, GraduationCap, ShoppingBag,
  MoreVertical, Paperclip
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/Toast';
import { useSettingsStore, useChatStore, useKnowledgeStore, useSkillsStore, APIProvider } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { 
  BottomNav, APISettings, AgentsView, TrainingHub, SkillsMarket, HomeView,
  FloatingTerminalButton 
} from '@/components/GlassUI';
import { GlassCard, GlassButton, GlassInput, FullScreenOverlay, StatusBadge, ProgressBar } from '@/components/GlassComponents';

// ============================================================================
// Types
// ============================================================================

type TabId = 'home' | 'agents' | 'training' | 'market' | 'settings';
type Screen = 'main' | 'chat' | 'terminal';

// ============================================================================
// Main Dashboard
// ============================================================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<Screen>('main');
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian-900 pb-20">
      {/* Main Content Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ChatView onOpenChat={() => setScreen('chat')} />
            </motion.div>
          )}
          
          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AgentsView />
            </motion.div>
          )}
          
          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TrainingHub />
            </motion.div>
          )}
          
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SkillsMarket />
            </motion.div>
          )}
          
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SettingsContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Terminal Button */}
      <AnimatePresence>
        {screen === 'main' && (
          <FloatingTerminalButton isOpen={terminalOpen} onToggle={() => setTerminalOpen(true)} />
        )}
      </AnimatePresence>

      {/* Terminal Overlay */}
      <AnimatePresence>
        {terminalOpen && (
          <TerminalOverlay isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

// ============================================================================
// Chat View (Main Hub)
// ============================================================================

interface ChatViewProps {
  onOpenChat: () => void;
}

function ChatView({ onOpenChat }: ChatViewProps) {
  const { messages, addMessage, isTyping, setTyping, clearMessages } = useChatStore();
  const { activeAgent, setActiveAgent, agents, apis, activeModel, setActiveModel } = useSettingsStore();
  const [input, setInput] = useState('');
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `I've processed your request: "${userMessage}". Let me analyze and provide the best solution.`,
        `Running analysis on: "${userMessage}". Computing optimal approach...`,
        `Understood. Executing task: "${userMessage}". Results will be ready shortly.`,
      ];
      
      addMessage({
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        model: activeModel || 'default',
      });
      setTyping(false);
      toast.success('Response received');
    }, 1500 + Math.random() * 1000);
  }, [input, addMessage, setTyping, activeModel]);

  const handleFileUpload = useCallback((files: File[]) => {
    files.forEach((file) => {
      const type = file.type.startsWith('image/') ? 'image' : 'document';
      addMessage({
        role: 'user',
        content: `[Attached ${type}: ${file.name}]`,
      });
      
      // Simulate processing
      toast.success(`${file.name} attached`);
    });
  }, [addMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'text/*': [],
    },
    noClick: true,
  });

  // Get current agent
  const currentAgent = agents.find(a => a.id === activeAgent);

  return (
    <div className="space-y-4">
      {/* Agent Selector */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-inner flex items-center justify-center text-xl">
            {currentAgent?.icon || '👑'}
          </div>
          <div className="flex-1">
            <select 
              value={activeAgent || ''}
              onChange={(e) => setActiveAgent(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none"
            >
              {agents.filter(a => a.enabled).map((agent) => (
                <option key={agent.id} value={agent.id} className="bg-obsidian-800">
                  {agent.icon} {agent.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Model Selector */}
          {apis.filter(a => a.enabled && a.selectedModel).length > 0 && (
            <select
              value={activeModel || ''}
              onChange={(e) => setActiveModel(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg glass-inner text-slate-400"
            >
              <option value="">Auto</option>
              {apis.filter(a => a.enabled).map((api) => (
                <option key={api.provider} value={api.selectedModel} className="bg-obsidian-800">
                  {api.icon} {api.selectedModel}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        {...getRootProps()}
        className={cn(
          'glass-card p-4 min-h-[300px] max-h-[400px] overflow-y-auto',
          isDragActive && 'border-emerald-500'
        )}
      >
        <input {...getInputProps()} />
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <Crown className="w-12 h-12 text-emerald-400/30 mb-4" />
            <p className="text-sm text-slate-400 mb-2">Start a conversation</p>
            <p className="text-xs text-slate-500">
              {currentAgent?.name || 'Godfather'} is ready to assist
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cn(
                  'max-w-[80%] px-3 py-2 rounded-xl text-sm',
                  message.role === 'user' 
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/20' 
                    : 'glass-inner text-slate-200'
                )}>
                  {message.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400 text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentAgent?.name || 'Godfather'} is typing...
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Tools Toggle */}
      <AnimatePresence>
        {showTools && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-3">
              <p className="text-xs text-slate-400 mb-2">Available Tools</p>
              <div className="flex flex-wrap gap-2">
                {useSettingsStore.getState().tools.filter(t => t.enabled).map((tool) => (
                  <button
                    key={tool.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-inner text-xs text-slate-300"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTools(!showTools)}
            className={cn(
              'w-10 h-10 rounded-xl glass-inner flex items-center justify-center text-slate-400',
              showTools && 'text-emerald-400'
            )}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Godfather..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              input.trim() 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'glass-inner text-slate-500'
            )}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Settings Content
// ============================================================================

function SettingsContent() {
  return (
    <div className="space-y-6">
      <HomeView />
      
      <div className="mt-8">
        <APISettings />
      </div>
      
      <div className="mt-8">
        <SettingsView />
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Settings</h2>
      </div>
      
      <SettingsItem icon={Globe} label="Appearance" value="Dark" />
      <SettingsItem icon={Code} label="Code Theme" value="Obsidian" />
      <SettingsItem icon={Database} label="Database" value="Supabase" />
      <SettingsItem icon={Terminal} label="Terminal Shell" value="Godfather" />
      
      <GlassButton variant="secondary" className="w-full mt-4 text-red-400">
        Reset All Settings
      </GlassButton>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 glass-card">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-emerald-400" />
        <span className="text-sm text-white">{label}</span>
      </div>
      <span className="text-xs text-slate-400">{value}</span>
    </button>
  );
}

// ============================================================================
// Terminal Overlay
// ============================================================================

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function TerminalOverlay({ isOpen, onClose }: TerminalOverlayProps) {
  const { messages } = useChatStore();
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] System: Terminal opened`,
        ...messages.map(m => 
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role === 'user' ? '>' : '<'} ${m.content}`
        ),
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="Terminal">
      <div className="font-mono text-xs space-y-1">
        <div className="text-emerald-400/60 mb-4">
          ╔═══════════════════════════════════════╗
          ║   DIGITAL GODFATHER TERMINAL v3.0   ║
          ╚═══════════════════════════════════════╝
        </div>
        
        {logs.length === 0 ? (
          <div className="text-slate-500">Waiting for logs...</div>
        ) : (
          logs.map((log, i) => (
            <div 
              key={i} 
              className={cn(
                log.includes('Error') ? 'text-red-400' :
                log.includes('>') ? 'text-emerald-400' :
                log.includes('<') ? 'text-blue-400' :
                'text-slate-400'
              )}
            >
              {log}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
        
        {useChatStore.getState().isTyping && (
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="animate-pulse">▊</span>
            <span>Processing...</span>
          </div>
        )}
      </div>
      
      {/* Clear Button */}
      <GlassButton
        variant="secondary"
        size="sm"
        onClick={() => setLogs([])}
        className="mt-4"
      >
        Clear Logs
      </GlassButton>
    </FullScreenOverlay>
  );
}