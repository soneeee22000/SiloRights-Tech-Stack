'use client';

import React, { useState, useEffect } from 'react';
import {
  Database, Server, Globe, Shield, Zap, FileText,
  CheckCircle, ArrowRight, ArrowDown, Layers, Code,
  Lock, Cloud, CreditCard, Search, FileCheck,
  GitBranch, Network, Box, Cpu, HardDrive, Radio,
  Users, Building, Sparkles, TrendingUp, AlertTriangle,
  Play, ChevronRight, ChevronDown, ExternalLink, Copy
} from 'lucide-react';

// Custom EU-themed color tokens
const colors = {
  euBlue: '#003399',
  euGold: '#FFCC00',
  deepNavy: '#0A1628',
  slate: '#1E293B',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

interface Component {
  name: string;
  desc: string;
}

interface ArchitectureLayer {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  color: string;
  borderColor: string;
  icon: React.ElementType;
  tech: string[];
  components: Component[];
  responsibilities: string[];
  metrics: Record<string, string>;
}

interface DataFlowStep {
  id: number;
  actor: string;
  action: string;
  target: string;
  data: string;
  color: string;
}

interface Endpoint {
  method: string;
  path: string;
  desc: string;
}

interface ApiCategory {
  category: string;
  endpoints: Endpoint[];
}

interface TechStackItem {
  name: string;
  purpose: string;
  why: string;
}

interface TechStackCategory {
  category: string;
  items: TechStackItem[];
}

interface SecurityFeature {
  category: string;
  icon: React.ElementType;
  features: string[];
}

interface ScalabilityMetric {
  label: string;
  value: string;
  icon: React.ElementType;
}

const SiloettRightsArchitecture = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [showAPIDemo, setShowAPIDemo] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ assets: 0, licenses: 0, compliance: 0 });
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Animate stats on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ assets: 500000, licenses: 10000, compliance: 99.9 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: 'overview', label: 'Architecture Overview', icon: Layers },
    { id: 'layers', label: 'Layer Deep-Dive', icon: Box },
    { id: 'dataflow', label: 'Data Flow', icon: GitBranch },
    { id: 'api', label: 'API Design', icon: Code },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'scalability', label: 'Scalability', icon: TrendingUp },
    { id: 'stack', label: 'Tech Stack', icon: Cpu }
  ];

  const architectureLayers: ArchitectureLayer[] = [
    {
      id: 'presentation',
      number: 5,
      name: 'Presentation Layer',
      subtitle: 'User Interfaces',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      icon: Globe,
      tech: ['Next.js 14', 'React 18', 'Tailwind CSS', 'shadcn/ui'],
      components: [
        { name: 'IP Holder Portal', desc: 'Catalog management, rights definition, license approval' },
        { name: 'AI Company Portal', desc: 'Content discovery, licensing, compliance reports' },
        { name: 'Admin Dashboard', desc: 'Platform monitoring, user management' }
      ],
      responsibilities: [
        'Server-side rendering for SEO',
        'Real-time updates via WebSocket',
        'Responsive design (tablet minimum)',
        'Accessibility (WCAG 2.1 AA)'
      ],
      metrics: { latency: '<100ms FCP', uptime: '99.9%' }
    },
    {
      id: 'api',
      number: 4,
      name: 'API Gateway Layer',
      subtitle: 'Request Routing & Authentication',
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      icon: Server,
      tech: ['FastAPI', 'Pydantic v2', 'JWT/OAuth 2.0', 'Rate Limiting'],
      components: [
        { name: 'REST API', desc: '/catalog, /license, /compliance, /auth endpoints' },
        { name: 'GraphQL Gateway', desc: 'Flexible queries for complex data needs' },
        { name: 'WebSocket Server', desc: 'Real-time notifications and updates' }
      ],
      responsibilities: [
        'Request validation & sanitization',
        'Authentication & authorization',
        'Rate limiting (tiered by plan)',
        'API versioning (/v1, /v2)'
      ],
      metrics: { latency: '<200ms p95', throughput: '10K req/s' }
    },
    {
      id: 'services',
      number: 3,
      name: 'Service Layer',
      subtitle: 'Business Logic & Orchestration',
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      icon: Zap,
      tech: ['Python 3.11+', 'Celery', 'Redis Pub/Sub', 'Event-Driven'],
      components: [
        { name: 'Catalog Service', desc: 'Asset indexing, metadata management' },
        { name: 'License Service', desc: 'Request processing, agreement generation' },
        { name: 'Compliance Service', desc: 'EU AI Act report generation' },
        { name: 'Payment Service', desc: 'Stripe Connect integration' },
        { name: 'Notification Service', desc: 'Email, SMS, webhooks' }
      ],
      responsibilities: [
        'Domain-driven design patterns',
        'CQRS for read/write separation',
        'Saga pattern for transactions',
        'Circuit breaker for resilience'
      ],
      metrics: { latency: '<50ms', errorRate: '<0.1%' }
    },
    {
      id: 'data',
      number: 2,
      name: 'Data Layer',
      subtitle: 'Persistence & Search',
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
      icon: Database,
      tech: ['PostgreSQL 16', 'Meilisearch', 'Redis', 'S3-compatible'],
      components: [
        { name: 'PostgreSQL', desc: 'Primary relational database (ACID compliant)' },
        { name: 'Meilisearch', desc: 'Full-text search engine (EU-created)' },
        { name: 'Redis', desc: 'Caching, sessions, rate limiting' },
        { name: 'Object Storage', desc: 'Compliance reports, agreements (Scaleway)' }
      ],
      responsibilities: [
        'Connection pooling (pgBouncer)',
        'Read replicas for scaling',
        'Point-in-time recovery',
        'Automated backups (hourly)'
      ],
      metrics: { queryTime: '<50ms p95', storage: '∞ scalable' }
    },
    {
      id: 'blockchain',
      number: 1,
      name: 'Blockchain Layer',
      subtitle: 'Immutable Audit Trail',
      color: 'from-indigo-500 to-indigo-600',
      borderColor: 'border-indigo-500',
      icon: Lock,
      tech: ['Polygon (L2)', 'Solidity', 'ethers.js', 'IPFS'],
      components: [
        { name: 'License Smart Contract', desc: 'Immutable license records' },
        { name: 'Agreement Hash Storage', desc: 'SHA-256 of full agreements' },
        { name: 'Audit Trail', desc: 'Timestamped transaction history' }
      ],
      responsibilities: [
        'Gas-optimized contracts',
        'Multi-sig for admin actions',
        'Event emission for indexing',
        'Mainnet for production'
      ],
      metrics: { confirmation: '<30s', cost: '<$0.01/tx' }
    },
    {
      id: 'infrastructure',
      number: 0,
      name: 'Infrastructure Layer',
      subtitle: 'EU-Sovereign Cloud',
      color: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-500',
      icon: Cloud,
      tech: ['Scaleway (France)', 'Kubernetes', 'Terraform', 'GitOps'],
      components: [
        { name: 'Kubernetes Cluster', desc: 'Container orchestration (Kapsule)' },
        { name: 'Load Balancer', desc: 'Traffic distribution, SSL termination' },
        { name: 'CDN', desc: 'Cloudflare for static assets' }
      ],
      responsibilities: [
        'Auto-scaling (HPA/VPA)',
        'Infrastructure as Code',
        'Blue-green deployments',
        'Multi-region DR (planned)'
      ],
      metrics: { uptime: '99.99%', regions: 'EU (Paris, AMS)' }
    }
  ];

  const dataFlowSteps: DataFlowStep[] = [
    {
      id: 1,
      actor: 'IP Holder',
      action: 'Uploads Catalog Metadata',
      target: 'API Gateway',
      data: 'CSV/JSON with 500+ assets',
      color: 'blue'
    },
    {
      id: 2,
      actor: 'API Gateway',
      action: 'Validates & Routes',
      target: 'Catalog Service',
      data: 'Authenticated request + payload',
      color: 'purple'
    },
    {
      id: 3,
      actor: 'Catalog Service',
      action: 'Processes & Indexes',
      target: 'PostgreSQL + Meilisearch',
      data: 'Normalized records + search index',
      color: 'green'
    },
    {
      id: 4,
      actor: 'AI Company',
      action: 'Searches Catalog',
      target: 'Search Engine',
      data: 'Query: "documentary 4K Europe"',
      color: 'orange'
    },
    {
      id: 5,
      actor: 'AI Company',
      action: 'Requests License',
      target: 'License Service',
      data: 'Asset IDs + intended use + territory',
      color: 'green'
    },
    {
      id: 6,
      actor: 'IP Holder',
      action: 'Approves Request',
      target: 'License Service',
      data: 'Approval + optional notes',
      color: 'blue'
    },
    {
      id: 7,
      actor: 'License Service',
      action: 'Records on Blockchain',
      target: 'Polygon Network',
      data: 'Agreement hash + parties + timestamp',
      color: 'indigo'
    },
    {
      id: 8,
      actor: 'Compliance Service',
      action: 'Generates Report',
      target: 'AI Company',
      data: 'EU AI Act compliant PDF/JSON/XML',
      color: 'green'
    }
  ];

  const apiEndpoints: ApiCategory[] = [
    {
      category: 'Authentication',
      endpoints: [
        { method: 'POST', path: '/v1/auth/register', desc: 'Register new user' },
        { method: 'POST', path: '/v1/auth/login', desc: 'Authenticate & get JWT' },
        { method: 'POST', path: '/v1/auth/refresh', desc: 'Refresh access token' }
      ]
    },
    {
      category: 'Catalog Management',
      endpoints: [
        { method: 'POST', path: '/v1/catalog/upload', desc: 'Upload catalog metadata (IP Holder)' },
        { method: 'GET', path: '/v1/catalog/my-assets', desc: 'List holder\'s assets' },
        { method: 'PUT', path: '/v1/catalog/assets/{id}', desc: 'Update asset terms' },
        { method: 'DELETE', path: '/v1/catalog/assets/{id}', desc: 'Archive asset' }
      ]
    },
    {
      category: 'Catalog Discovery',
      endpoints: [
        { method: 'GET', path: '/v1/catalog/search', desc: 'Search available content (AI Company)' },
        { method: 'GET', path: '/v1/catalog/assets/{id}', desc: 'Get asset details' }
      ]
    },
    {
      category: 'Licensing',
      endpoints: [
        { method: 'POST', path: '/v1/license/request', desc: 'Request license for assets' },
        { method: 'GET', path: '/v1/license/requests', desc: 'List license requests' },
        { method: 'PUT', path: '/v1/license/requests/{id}/approve', desc: 'Approve request (IP Holder)' },
        { method: 'PUT', path: '/v1/license/requests/{id}/reject', desc: 'Reject request (IP Holder)' }
      ]
    },
    {
      category: 'Compliance',
      endpoints: [
        { method: 'GET', path: '/v1/compliance/report', desc: 'Generate EU AI Act report' },
        { method: 'GET', path: '/v1/compliance/summary', desc: 'Get compliance summary stats' }
      ]
    }
  ];

  const techStackCategories: TechStackCategory[] = [
    {
      category: 'Frontend',
      items: [
        { name: 'Next.js 14', purpose: 'React framework with SSR', why: 'Performance, SEO, great DX' },
        { name: 'Tailwind CSS', purpose: 'Utility-first styling', why: 'Rapid development' },
        { name: 'shadcn/ui', purpose: 'Component library', why: 'Accessible, customizable' },
        { name: 'Zustand', purpose: 'State management', why: 'Lightweight, TypeScript-friendly' }
      ]
    },
    {
      category: 'Backend',
      items: [
        { name: 'FastAPI', purpose: 'Python web framework', why: 'Async, auto-docs, type hints' },
        { name: 'SQLAlchemy 2.0', purpose: 'ORM', why: 'Async support, mature' },
        { name: 'Celery', purpose: 'Task queue', why: 'Distributed job processing' },
        { name: 'Pydantic v2', purpose: 'Validation', why: 'Fast, type-safe schemas' }
      ]
    },
    {
      category: 'Database',
      items: [
        { name: 'PostgreSQL 16', purpose: 'Primary database', why: 'Reliable, EU-hostable, JSONB' },
        { name: 'Meilisearch', purpose: 'Search engine', why: 'EU-created, fast, simple' },
        { name: 'Redis', purpose: 'Cache/sessions', why: 'Standard, performant' }
      ]
    },
    {
      category: 'Infrastructure',
      items: [
        { name: 'Scaleway', purpose: 'Cloud provider', why: 'EU sovereign, GDPR-native' },
        { name: 'Kubernetes', purpose: 'Container orchestration', why: 'Scalable, portable' },
        { name: 'Terraform', purpose: 'IaC', why: 'Reproducible infrastructure' },
        { name: 'GitHub Actions', purpose: 'CI/CD', why: 'Industry standard' }
      ]
    },
    {
      category: 'Blockchain',
      items: [
        { name: 'Polygon', purpose: 'Ethereum L2', why: 'Low cost, fast, mature tooling' },
        { name: 'Solidity', purpose: 'Smart contracts', why: 'Industry standard' },
        { name: 'ethers.js', purpose: 'Blockchain SDK', why: 'Well-documented' }
      ]
    }
  ];

  const securityFeatures: SecurityFeature[] = [
    {
      category: 'Authentication & Authorization',
      icon: Lock,
      features: [
        'JWT with RS256 signing',
        'OAuth 2.0 / OpenID Connect',
        'Role-based access control (RBAC)',
        'Multi-factor authentication (MFA)',
        'API key management for AI companies'
      ]
    },
    {
      category: 'Data Protection',
      icon: Shield,
      features: [
        'Encryption at rest (AES-256)',
        'Encryption in transit (TLS 1.3)',
        'GDPR-compliant data handling',
        'EU-sovereign infrastructure',
        'Data residency controls'
      ]
    },
    {
      category: 'Compliance',
      icon: FileCheck,
      features: [
        'EU AI Act Article 53 compliance',
        'ISO 27001 aligned processes',
        'SOC 2 Type II (planned)',
        'Automated audit trails',
        'Immutable blockchain records'
      ]
    },
    {
      category: 'Infrastructure Security',
      icon: Cloud,
      features: [
        'Network isolation (VPC)',
        'WAF protection',
        'DDoS mitigation',
        'Secrets management (Vault)',
        'Container scanning'
      ]
    }
  ];

  const scalabilityMetrics: ScalabilityMetric[] = [
    { label: 'Peak Throughput', value: '10,000 req/s', icon: Zap },
    { label: 'Database Connections', value: '1,000 pooled', icon: Database },
    { label: 'Search Index Size', value: '100M documents', icon: Search },
    { label: 'Auto-scaling Range', value: '2-50 pods', icon: Server },
    { label: 'Global CDN Nodes', value: '200+', icon: Globe },
    { label: 'Blockchain TPS', value: '7,000 (Polygon)', icon: Lock }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const renderMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${methodColors[method]}`}>
        {method}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59,130,246,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#0A0F1C]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  SILOETT<span className="text-blue-400">Rights</span>
                </h1>
                <p className="text-xs text-slate-400 tracking-wide uppercase">
                  Technical Architecture v1.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400">
                EU AI Act Ready
              </span>
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-medium text-red-400 animate-pulse">
                Aug 2026 Deadline
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 min-h-[calc(100vh-73px)] border-r border-white/10 bg-[#0D1424]/50 backdrop-blur-sm p-4 sticky top-[73px] self-start">
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Target Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Assets</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {animatedStats.assets.toLocaleString()}+
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Licenses/yr</span>
                <span className="text-sm font-mono font-bold text-blue-400">
                  {animatedStats.licenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Uptime</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {animatedStats.compliance}%
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-[calc(100vh-73px)]">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">System Architecture Overview</h2>
                <p className="text-slate-400 max-w-3xl">
                  SILOETT Rights is built as a 6-layer microservices architecture, designed for
                  EU sovereignty, horizontal scalability, and EU AI Act compliance from day one.
                </p>
              </div>

              {/* Architecture Diagram */}
              <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8 overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setShowDataFlow(!showDataFlow)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      showDataFlow
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {showDataFlow ? 'Hide' : 'Show'} Data Flow
                  </button>
                </div>

                <div className="space-y-4">
                  {architectureLayers.map((layer, index) => {
                    const Icon = layer.icon;
                    const isExpanded = activeLayer === layer.id;
                    return (
                      <div key={layer.id}>
                        <button
                          onClick={() => setActiveLayer(isExpanded ? null : layer.id)}
                          className={`w-full transition-all duration-300 rounded-xl p-5 border ${
                            isExpanded
                              ? `bg-gradient-to-r ${layer.color} border-transparent shadow-lg`
                              : `bg-slate-800/50 ${layer.borderColor} border-opacity-30 hover:border-opacity-60`
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isExpanded ? 'bg-white/20' : `bg-gradient-to-br ${layer.color}`
                            }`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                                  isExpanded ? 'bg-white/20' : 'bg-white/10'
                                }`}>
                                  L{layer.number}
                                </span>
                                <h3 className="font-semibold">{layer.name}</h3>
                              </div>
                              <p className={`text-sm ${isExpanded ? 'text-white/80' : 'text-slate-400'}`}>
                                {layer.subtitle}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {layer.tech.slice(0, 3).map((tech, i) => (
                                <span key={i} className={`text-xs px-2 py-1 rounded ${
                                  isExpanded ? 'bg-white/20' : 'bg-white/5'
                                }`}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`} />
                          </div>

                          {isExpanded && (
                            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-6 text-left">
                              <div>
                                <h4 className="text-sm font-semibold mb-3 text-white/90">Components</h4>
                                <div className="space-y-2">
                                  {layer.components.map((comp, i) => (
                                    <div key={i} className="bg-white/10 rounded-lg p-3">
                                      <div className="font-medium text-sm">{comp.name}</div>
                                      <div className="text-xs text-white/70">{comp.desc}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold mb-3 text-white/90">Responsibilities</h4>
                                <ul className="space-y-2">
                                  {layer.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                                      <CheckCircle className="w-4 h-4 mt-0.5 text-white/60" />
                                      {resp}
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-4 flex gap-4">
                                  {Object.entries(layer.metrics).map(([key, value]) => (
                                    <div key={key} className="bg-white/10 rounded-lg px-3 py-2">
                                      <div className="text-xs text-white/60">{key}</div>
                                      <div className="text-sm font-mono font-bold">{value}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </button>

                        {index < architectureLayers.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ArrowDown className={`w-5 h-5 ${
                              showDataFlow ? 'text-blue-400 animate-pulse' : 'text-slate-600'
                            }`} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Architecture Decisions */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Metadata-First',
                    desc: 'IP never leaves holder custody. We index metadata only, minimizing liability.',
                    icon: FileText,
                    color: 'blue'
                  },
                  {
                    title: 'EU Sovereign',
                    desc: 'All infrastructure hosted in EU data centers (Scaleway France).',
                    icon: Shield,
                    color: 'amber'
                  },
                  {
                    title: 'API-First',
                    desc: 'AI companies integrate programmatically. OpenAPI spec for all endpoints.',
                    icon: Code,
                    color: 'emerald'
                  }
                ].map((decision, i) => (
                  <div key={i} className={`bg-gradient-to-br from-${decision.color}-500/10 to-transparent rounded-xl p-6 border border-${decision.color}-500/20`}>
                    <decision.icon className={`w-8 h-8 text-${decision.color}-400 mb-4`} />
                    <h3 className="font-semibold mb-2">{decision.title}</h3>
                    <p className="text-sm text-slate-400">{decision.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer Deep-Dive Section */}
          {activeSection === 'layers' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">Layer Deep-Dive</h2>
                <p className="text-slate-400">
                  Click on any layer to explore its components, technologies, and responsibilities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {architectureLayers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <div
                      key={layer.id}
                      className={`bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all`}
                    >
                      <div className={`h-2 bg-gradient-to-r ${layer.color}`} />
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10">
                                Layer {layer.number}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold">{layer.name}</h3>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {layer.tech.map((tech, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="space-y-2">
                          {layer.components.slice(0, 3).map((comp, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              <span className="text-slate-300">{comp.name}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
                          {Object.entries(layer.metrics).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-xs text-slate-500">{key}</div>
                              <div className="text-sm font-mono font-semibold text-emerald-400">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Data Flow Section */}
          {activeSection === 'dataflow' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">Data Flow Architecture</h2>
                <p className="text-slate-400">
                  Complete licensing workflow from catalog upload to compliance report generation.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
                <div className="space-y-4">
                  {dataFlowSteps.map((step, index) => {
                    const colorMap: Record<string, string> = {
                      blue: 'from-blue-500 to-blue-600',
                      purple: 'from-purple-500 to-purple-600',
                      green: 'from-emerald-500 to-emerald-600',
                      orange: 'from-orange-500 to-orange-600',
                      indigo: 'from-indigo-500 to-indigo-600'
                    };
                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorMap[step.color]} flex items-center justify-center font-bold text-sm shadow-lg`}>
                          {step.id}
                        </div>
                        <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-white">{step.actor}</span>
                              <ArrowRight className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400">{step.target}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${colorMap[step.color]} bg-opacity-20`}>
                              {step.action}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-mono">{step.data}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flow Diagram */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <Building className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="font-semibold mb-2">IP Holders</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Upload catalog metadata</li>
                    <li>• Define licensing terms</li>
                    <li>• Approve/reject requests</li>
                    <li>• Track revenue</li>
                  </ul>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                  <Server className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">SILOETT Platform</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Catalog indexing</li>
                    <li>• License orchestration</li>
                    <li>• Payment processing</li>
                    <li>• Blockchain recording</li>
                  </ul>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <Cpu className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="font-semibold mb-2">AI Companies</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Search catalog</li>
                    <li>• Request licenses</li>
                    <li>• Access content metadata</li>
                    <li>• Generate compliance reports</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* API Design Section */}
          {activeSection === 'api' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">API Design</h2>
                <p className="text-slate-400">
                  RESTful API with OpenAPI 3.0 specification. All endpoints require JWT authentication.
                </p>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-slate-400">GET</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-slate-400">POST</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-slate-400">PUT</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-slate-400">DELETE</span>
                </div>
              </div>

              <div className="space-y-6">
                {apiEndpoints.map((category) => (
                  <div key={category.category} className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                      <h3 className="font-semibold">{category.category}</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {category.endpoints.map((endpoint, i) => {
                        const endpointId = `${category.category}-${i}`;
                        return (
                          <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                            {renderMethodBadge(endpoint.method)}
                            <code className="flex-1 text-sm font-mono text-slate-300">
                              {endpoint.path}
                            </code>
                            <span className="text-sm text-slate-500">{endpoint.desc}</span>
                            <button
                              onClick={() => copyToClipboard(endpoint.path, endpointId)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded"
                            >
                              {copiedEndpoint === endpointId ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* API Demo */}
              <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">Example Request</span>
                </div>
                <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto">
{`curl -X POST https://api.siloett.ai/v1/license/request \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "assets": [
      {"asset_id": "uuid-1234", "quantity": 1},
      {"asset_id": "uuid-5678", "quantity": 1}
    ],
    "intended_use": "Training multimodal AI model",
    "model_name": "MistralVideo-2026",
    "territory": "EU"
  }'`}
                </pre>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">Security & Compliance</h2>
                <p className="text-slate-400">
                  Enterprise-grade security with EU AI Act compliance built-in from day one.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {securityFeatures.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category} className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold">{category.category}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* EU AI Act Compliance */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">EU AI Act Compliance (Article 53)</h3>
                    <p className="text-slate-400 mb-4">
                      Effective August 2, 2026 — GPAI providers must document training data sources.
                      Penalties up to €15M or 3% of global revenue.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        'Training data source descriptions',
                        'Copyrighted content summaries',
                        'Proof of licensing/legal basis',
                        'Technical compliance measures'
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-slate-300">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scalability Section */}
          {activeSection === 'scalability' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">Scalability Architecture</h2>
                <p className="text-slate-400">
                  Designed to handle 500K+ assets, 10K+ licenses/year, and peak loads of 10K req/s.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {scalabilityMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-white/10 p-6 text-center">
                      <Icon className="w-8 h-8 mx-auto text-blue-400 mb-3" />
                      <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-400">{metric.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Scaling Patterns */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    Horizontal Scaling
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Kubernetes HPA</strong> — Auto-scale pods based on CPU/memory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Read Replicas</strong> — PostgreSQL replicas for read-heavy queries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">CDN Caching</strong> — Static assets via Cloudflare edge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Redis Cluster</strong> — Distributed caching layer</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-400" />
                    Event-Driven Architecture
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">CQRS Pattern</strong> — Separate read/write models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Event Sourcing</strong> — Immutable audit trail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Celery Workers</strong> — Async job processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span><strong className="text-white">Circuit Breaker</strong> — Graceful degradation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Load Distribution */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
                <h3 className="font-semibold mb-6">Load Distribution Strategy</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'API Gateway', load: '40%', color: 'blue' },
                    { label: 'Search', load: '30%', color: 'emerald' },
                    { label: 'Database', load: '20%', color: 'orange' },
                    { label: 'Blockchain', load: '10%', color: 'indigo' }
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-2xl font-bold font-mono text-white mb-2">{item.load}</div>
                      <div className={`h-2 rounded-full bg-${item.color}-500 mb-2`} style={{ width: item.load }} />
                      <div className="text-sm text-slate-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack Section */}
          {activeSection === 'stack' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-2">Technology Stack</h2>
                <p className="text-slate-400">
                  Production-ready technologies chosen for EU sovereignty, scalability, and developer experience.
                </p>
              </div>

              <div className="space-y-6">
                {techStackCategories.map((category) => (
                  <div key={category.category} className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                      <h3 className="font-semibold">{category.category}</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {category.items.map((item) => (
                          <div key={item.name} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.name}</h4>
                              <p className="text-sm text-slate-400">{item.purpose}</p>
                              <p className="text-xs text-emerald-400 mt-1">→ {item.why}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                  <h3 className="font-semibold">Why These Choices?</h3>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400">
                        <th className="pb-4">Decision</th>
                        <th className="pb-4">Alternative</th>
                        <th className="pb-4">Why We Chose</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5">
                        <td className="py-3 font-semibold text-white">FastAPI</td>
                        <td className="py-3">Django, Flask</td>
                        <td className="py-3 text-emerald-400">Async native, auto-docs, type hints</td>
                      </tr>
                      <tr className="border-t border-white/5">
                        <td className="py-3 font-semibold text-white">Meilisearch</td>
                        <td className="py-3">Elasticsearch, Algolia</td>
                        <td className="py-3 text-emerald-400">EU-created, simple, fast, open-source</td>
                      </tr>
                      <tr className="border-t border-white/5">
                        <td className="py-3 font-semibold text-white">Polygon</td>
                        <td className="py-3">Ethereum, Solana</td>
                        <td className="py-3 text-emerald-400">Low cost (&lt; $0.01/tx), fast, mature</td>
                      </tr>
                      <tr className="border-t border-white/5">
                        <td className="py-3 font-semibold text-white">Scaleway</td>
                        <td className="py-3">AWS, GCP, Azure</td>
                        <td className="py-3 text-emerald-400">EU sovereign, GDPR-native, Paris DC</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0A0F1C]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-4">
              <span>SILOETT Rights — Technical Architecture v1.0</span>
              <span className="text-slate-600">|</span>
              <span>Last Updated: January 28, 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-medium text-emerald-400">
                Ready for VC Demo
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SiloettRightsArchitecture;
