/**
 * Digital Godfather - Skills Configuration
 * 
 * 30 Unique Agents organized by department.
 * Each agent has custom behavior, skillset, and backend engine mapping.
 * NO external names exposed - all white-labeled.
 */

import { AgentLog, AgentExecution, AgentStatus } from '@/types';

// Agent Roles
export type AgentRole = 
  // Dev Department (10)
  | 'architect' | 'coder' | 'debugger' | 'tester' | 'reviewer'
  | 'refactorer' | 'security' | 'devops' | 'api_designer' | 'docs_writer'
  // Research Department (10)
  | 'researcher' | 'analyst' | 'fetcher' | 'converter' | 'parser'
  | 'scanner' | 'indexer' | 'synthesizer' | 'reporter' | 'monitor'
  // Ops Department (10)
  | 'orchestrator' | 'scheduler' | 'monitor' | 'alerter' | 'healer'
  | 'backup' | 'deployer' | 'scaler' | 'logger' | 'guardian';

// Department Types
export type Department = 'dev' | 'research' | 'ops';

// Agent Tier
export type Tier = 'founder' | 'executive' | 'senior' | 'junior' | 'intern';

// Agent Interface
export interface AgentConfig {
  id: string;
  name: string;
  displayName: string;
  role: AgentRole;
  department: Department;
  tier: Tier;
  description: string;
  skillset: string[];
  icon: string;
  color: string;
  // Engine mapping (hidden from users)
  engine: 'openclaw' | 'autogpt' | 'crewai';
  // Unique behavior parameters
  behavior: {
    verbose: boolean;
    delay: number;
    parallel: boolean;
    retryAttempts: number;
  };
}

// Skills Definitions - 30 Unique Agents
export const AGENTS: AgentConfig[] = [
  // ============ DEV DEPARTMENT (10) ============
  {
    id: 'dev-001',
    name: 'The Architect',
    displayName: 'The Architect',
    role: 'architect',
    department: 'dev',
    tier: 'founder',
    description: 'Designs system architecture and makes high-level code decisions',
    skillset: ['System Design', 'Architecture', 'Code Generation', 'API Planning'],
    icon: '📐',
    color: '#10b981',
    engine: 'autogpt',
    behavior: { verbose: true, delay: 1500, parallel: false, retryAttempts: 3 },
  },
  {
    id: 'dev-002',
    name: 'The Coder',
    displayName: 'The Coder',
    role: 'coder',
    department: 'dev',
    tier: 'executive',
    description: 'Writes clean, efficient code for any task',
    skillset: ['Code Writing', 'Implementation', 'Algorithms', 'Optimization'],
    icon: '💻',
    color: '#3b82f6',
    engine: 'autogpt',
    behavior: { verbose: false, delay: 800, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'dev-003',
    name: 'The Debugger',
    displayName: 'The Debugger',
    role: 'debugger',
    department: 'dev',
    tier: 'senior',
    description: 'Finds and fixes bugs with surgical precision',
    skillset: ['Debugging', 'Root Cause Analysis', 'Error Tracking', 'Fix Application'],
    icon: '🔍',
    color: '#ef4444',
    engine: 'autogpt',
    behavior: { verbose: true, delay: 600, parallel: false, retryAttempts: 5 },
  },
  {
    id: 'dev-004',
    name: 'The Tester',
    displayName: 'The Tester',
    role: 'tester',
    department: 'dev',
    tier: 'senior',
    description: 'Creates comprehensive test suites',
    skillset: ['Test Generation', 'Coverage Analysis', 'Unit Tests', 'Integration Tests'],
    icon: '🧪',
    color: '#8b5cf6',
    engine: 'autogpt',
    behavior: { verbose: false, delay: 1000, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'dev-005',
    name: 'The Reviewer',
    displayName: 'The Reviewer',
    role: 'reviewer',
    department: 'dev',
    tier: 'senior',
    description: 'Reviews code for quality and security',
    skillset: ['Code Review', 'Security Audit', 'Quality Assurance', 'Best Practices'],
    icon: '👁️',
    color: '#f59e0b',
    engine: 'autogpt',
    behavior: { verbose: true, delay: 700, parallel: false, retryAttempts: 1 },
  },
  {
    id: 'dev-006',
    name: 'The Refactorer',
    displayName: 'The Refactorer',
    role: 'refactorer',
    department: 'dev',
    tier: 'junior',
    description: 'Improves existing code without changing behavior',
    skillset: ['Refactoring', 'Code Cleanup', 'Debt Reduction', 'Optimization'],
    icon: '🔧',
    color: '#06b6d4',
    engine: 'autogpt',
    behavior: { verbose: false, delay: 900, parallel: false, retryAttempts: 3 },
  },
  {
    id: 'dev-007',
    name: 'The Security Guard',
    displayName: 'The Security Guard',
    role: 'security',
    department: 'dev',
    tier: 'executive',
    description: 'Scans for vulnerabilities and secures code',
    skillset: ['Security Scanning', 'Vulnerability Detection', 'Hardening', 'Pen Testing'],
    icon: '🛡️',
    color: '#dc2626',
    engine: 'autogpt',
    behavior: { verbose: true, delay: 1200, parallel: true, retryAttempts: 3 },
  },
  {
    id: 'dev-008',
    name: 'The DevOps',
    displayName: 'The DevOps',
    role: 'devops',
    department: 'dev',
    tier: 'senior',
    description: 'Manages CI/CD pipelines and infrastructure',
    skillset: ['CI/CD', 'Infrastructure', 'Docker', 'Kubernetes'],
    icon: '⚙️',
    color: '#64748b',
    engine: 'crewai',
    behavior: { verbose: false, delay: 1100, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'dev-009',
    name: 'The API Designer',
    displayName: 'The API Designer',
    role: 'api_designer',
    department: 'dev',
    tier: 'junior',
    description: 'Designs and documents REST/GraphQL APIs',
    skillset: ['API Design', 'Schema Creation', 'Documentation', 'Validation'],
    icon: '🔗',
    color: '#0ea5e9',
    engine: 'autogpt',
    behavior: { verbose: true, delay: 600, parallel: false, retryAttempts: 2 },
  },
  {
    id: 'dev-010',
    name: 'The Docs Writer',
    displayName: 'The Docs Writer',
    role: 'docs_writer',
    department: 'dev',
    tier: 'junior',
    description: 'Writes beautiful documentation',
    skillset: ['Documentation', 'Markdown', 'API Docs', 'README'],
    icon: '📝',
    color: '#a3e635',
    engine: 'autogpt',
    behavior: { verbose: false, delay: 500, parallel: true, retryAttempts: 1 },
  },

  // ============ RESEARCH DEPARTMENT (10) ============
  {
    id: 'research-001',
    name: 'The Lead Researcher',
    displayName: 'The Lead Researcher',
    role: 'researcher',
    department: 'research',
    tier: 'founder',
    description: 'Leads research initiatives and analyzes findings',
    skillset: ['Research', 'Analysis', 'Problem Solving', 'Innovation'],
    icon: '🔬',
    color: '#10b981',
    engine: 'openclaw',
    behavior: { verbose: true, delay: 1400, parallel: false, retryAttempts: 3 },
  },
  {
    id: 'research-002',
    name: 'The Analyst',
    displayName: 'The Analyst',
    role: 'analyst',
    department: 'research',
    tier: 'executive',
    description: 'Analyzes data and provides insights',
    skillset: ['Data Analysis', 'Statistics', 'Reporting', 'Visualization'],
    icon: '📊',
    color: '#f59e0b',
    engine: 'openclaw',
    behavior: { verbose: true, delay: 1000, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'research-003',
    name: 'The Fetcher',
    displayName: 'The Fetcher',
    role: 'fetcher',
    department: 'research',
    tier: 'senior',
    description: 'Fetches data from any source',
    skillset: ['Web Scraping', 'API Fetching', 'Data Collection', 'ETL'],
    icon: '📥',
    color: '#3b82f6',
    engine: 'openclaw',
    behavior: { verbose: false, delay: 600, parallel: true, retryAttempts: 4 },
  },
  {
    id: 'research-004',
    name: 'The Converter',
    displayName: 'The Converter',
    role: 'converter',
    department: 'research',
    tier: 'junior',
    description: 'Converts data between formats',
    skillset: ['Format Conversion', 'Data Transform', 'Import/Export', 'Parsing'],
    icon: '🔄',
    color: '#8b5cf6',
    engine: 'openclaw',
    behavior: { verbose: false, delay: 400, parallel: true, retryAttempts: 1 },
  },
  {
    id: 'research-005',
    name: 'The Parser',
    displayName: 'The Parser',
    role: 'parser',
    department: 'research',
    tier: 'junior',
    description: 'Parses unstructured data into structured format',
    skillset: ['Parsing', 'NLP', 'Data Extraction', 'Pattern Recognition'],
    icon: '🎯',
    color: '#ef4444',
    engine: 'openclaw',
    behavior: { verbose: true, delay: 700, parallel: false, retryAttempts: 2 },
  },
  {
    id: 'research-006',
    name: 'The Scanner',
    displayName: 'The Scanner',
    role: 'scanner',
    department: 'research',
    tier: 'senior',
    description: 'Scans systems and identifies patterns',
    skillset: ['Scanning', 'Discovery', 'Inventory', 'Assessment'],
    icon: '📡',
    color: '#06b6d4',
    engine: 'openclaw',
    behavior: { verbose: false, delay: 800, parallel: true, retryAttempts: 3 },
  },
  {
    id: 'research-007',
    name: 'The Indexer',
    displayName: 'The Indexer',
    role: 'indexer',
    department: 'research',
    tier: 'junior',
    description: 'Indexes and organizes knowledge',
    skillset: ['Indexing', 'Tagging', 'Categorization', 'Search'],
    icon: '📇',
    color: '#f97316',
    engine: 'openclaw',
    behavior: { verbose: false, delay: 500, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'research-008',
    name: 'The Synthesizer',
    displayName: 'The Synthesizer',
    role: 'synthesizer',
    department: 'research',
    tier: 'senior',
    description: 'Synthesizes information from multiple sources',
    skillset: ['Synthesis', 'Integration', 'Summarization', 'Cross-referencing'],
    icon: '🧬',
    color: '#14b8a6',
    engine: 'openclaw',
    behavior: { verbose: true, delay: 1200, parallel: false, retryAttempts: 2 },
  },
  {
    id: 'research-009',
    name: 'The Reporter',
    displayName: 'The Reporter',
    role: 'reporter',
    department: 'research',
    tier: 'junior',
    description: 'Generates detailed reports',
    skillset: ['Report Generation', 'Formatting', 'Charts', 'Export'],
    icon: '📋',
    color: '#a855f7',
    engine: 'openclaw',
    behavior: { verbose: false, delay: 600, parallel: false, retryAttempts: 1 },
  },
  {
    id: 'research-010',
    name: 'The Monitor',
    displayName: 'The Monitor',
    role: 'monitor',
    department: 'research',
    tier: 'senior',
    description: 'Monitors and tracks metrics',
    skillset: ['Monitoring', 'Metrics', 'Dashboard', 'Alerts'],
    icon: '📺',
    color: '#ec4899',
    engine: 'openclaw',
    behavior: { verbose: true, delay: 800, parallel: true, retryAttempts: 3 },
  },

  // ============ OPS DEPARTMENT (10) ============
  {
    id: 'ops-001',
    name: 'The Orchestrator',
    displayName: 'The Orchestrator',
    role: 'orchestrator',
    department: 'ops',
    tier: 'founder',
    description: 'Coordinates multiple agents for complex tasks',
    skillset: ['Orchestration', 'Task Management', 'Coordination', 'Workflow'],
    icon: '🎭',
    color: '#10b981',
    engine: 'crewai',
    behavior: { verbose: true, delay: 2000, parallel: true, retryAttempts: 3 },
  },
  {
    id: 'ops-002',
    name: 'The Scheduler',
    displayName: 'The Scheduler',
    role: 'scheduler',
    department: 'ops',
    tier: 'executive',
    description: 'Schedules and manages cron jobs',
    skillset: ['Scheduling', 'Cron Jobs', 'Task Queue', 'Automation'],
    icon: '⏰',
    color: '#f59e0b',
    engine: 'crewai',
    behavior: { verbose: false, delay: 400, parallel: true, retryAttempts: 1 },
  },
  {
    id: 'ops-003',
    name: 'The System Monitor',
    displayName: 'The System Monitor',
    role: 'monitor',
    department: 'ops',
    tier: 'executive',
    description: 'Monitors system health in real-time',
    skillset: ['System Health', 'Performance', 'Resources', 'Uptime'],
    icon: '📈',
    color: '#3b82f6',
    engine: 'crewai',
    behavior: { verbose: true, delay: 1000, parallel: true, retryAttempts: 5 },
  },
  {
    id: 'ops-004',
    name: 'The Alerter',
    displayName: 'The Alerter',
    role: 'alerter',
    department: 'ops',
    tier: 'senior',
    description: 'Sends alerts when thresholds are crossed',
    skillset: ['Alerting', 'Notifications', 'Thresholds', 'Escalation'],
    icon: '🔔',
    color: '#ef4444',
    engine: 'crewai',
    behavior: { verbose: true, delay: 200, parallel: false, retryAttempts: 3 },
  },
  {
    id: 'ops-005',
    name: 'The Healer',
    displayName: 'The Healer',
    role: 'healer',
    department: 'ops',
    tier: 'senior',
    description: 'Auto-heals failed processes',
    skillset: ['Auto-healing', 'Failover', 'Recovery', 'Resilience'],
    icon: '💊',
    color: '#8b5cf6',
    engine: 'crewai',
    behavior: { verbose: true, delay: 800, parallel: false, retryAttempts: 5 },
  },
  {
    id: 'ops-006',
    name: 'The Backup',
    displayName: 'The Backup',
    role: 'backup',
    department: 'ops',
    tier: 'senior',
    description: 'Manages backup and restore operations',
    skillset: ['Backup', 'Restore', 'Disaster Recovery', 'Snapshots'],
    icon: '💾',
    color: '#64748b',
    engine: 'crewai',
    behavior: { verbose: false, delay: 1500, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'ops-007',
    name: 'The Deployer',
    displayName: 'The Deployer',
    role: 'deployer',
    department: 'ops',
    tier: 'junior',
    description: 'Deploys applications to production',
    skillset: ['Deployment', 'Release', 'Rollback', 'Blue-Green'],
    icon: '🚀',
    color: '#22c55e',
    engine: 'crewai',
    behavior: { verbose: true, delay: 900, parallel: false, retryAttempts: 3 },
  },
  {
    id: 'ops-008',
    name: 'The Scaler',
    displayName: 'The Scaler',
    role: 'scaler',
    department: 'ops',
    tier: 'junior',
    description: 'Scales resources based on demand',
    skillset: ['Auto-scaling', 'Load Balancing', 'Resource Mgmt', 'Optimization'],
    icon: '📏',
    color: '#0ea5e9',
    engine: 'crewai',
    behavior: { verbose: false, delay: 600, parallel: true, retryAttempts: 2 },
  },
  {
    id: 'ops-009',
    name: 'The Logger',
    displayName: 'The Logger',
    role: 'logger',
    department: 'ops',
    tier: 'junior',
    description: 'Aggregates and analyzes logs',
    skillset: ['Logging', 'Log Analysis', 'Search', 'Retention'],
    icon: '📜',
    color: '#d97706',
    engine: 'crewai',
    behavior: { verbose: false, delay: 500, parallel: true, retryAttempts: 1 },
  },
  {
    id: 'ops-010',
    name: 'The Guardian',
    displayName: 'The Guardian',
    role: 'guardian',
    department: 'ops',
    tier: 'senior',
    description: 'Protects infrastructure from threats',
    skillset: ['Security', 'Access Control', 'Compliance', 'Audit'],
    icon: '👮',
    color: '#dc2626',
    engine: 'crewai',
    behavior: { verbose: true, delay: 700, parallel: false, retryAttempts: 4 },
  },
];

// Helper functions
export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS.find(a => a.id === id);
}

export function getAgentsByDepartment(department: Department): AgentConfig[] {
  return AGENTS.filter(a => a.department === department);
}

export function getAgentsByTier(tier: Tier): AgentConfig[] {
  return AGENTS.filter(a => a.tier === tier);
}

export function searchAgents(query: string): AgentConfig[] {
  const lower = query.toLowerCase();
  return AGENTS.filter(a => 
    a.name.toLowerCase().includes(lower) ||
    a.displayName.toLowerCase().includes(lower) ||
    a.description.toLowerCase().includes(lower) ||
    a.skillset.some(s => s.toLowerCase().includes(lower))
  );
}

// Department icons and colors
export const DEPARTMENT_CONFIG = {
  dev: { icon: '💻', color: '#3b82f6', label: 'Development' },
  research: { icon: '🔬', color: '#10b981', label: 'Research' },
  ops: { icon: '🎭', color: '#f59e0b', label: 'Operations' },
};

// Tier hierarchy
export const TIER_CONFIG = {
  founder: { badge: 'Founder', color: '#fbbf24' },
  executive: { badge: 'Exec', color: '#10b981' },
  senior: { badge: 'Senior', color: '#3b82f6' },
  junior: { badge: 'Junior', color: '#8b5cf6' },
  intern: { badge: 'Intern', color: '#64748b' },
};