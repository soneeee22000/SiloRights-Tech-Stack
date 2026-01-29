'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  Database, Server, Globe, Shield, Zap, FileText,
  CheckCircle, ArrowRight, ArrowDown, Layers, Code,
  Lock, Cloud, Box, Cpu, ChevronDown
} from 'lucide-react';

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

export default function Home() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ assets: 0, licenses: 0, compliance: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ assets: 500000, licenses: 10000, compliance: 99.9 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">System Architecture Overview</h1>
              <p className="text-slate-400">6-layer microservices architecture for EU AI Act compliance</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-3xl">
            SILOETT Rights is built as a 6-layer microservices architecture, designed for
            EU sovereignty, horizontal scalability, and EU AI Act compliance from day one.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl p-6 border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {animatedStats.assets.toLocaleString()}+
            </div>
            <div className="text-sm text-slate-400">Target Assets</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {animatedStats.licenses.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Licenses/year</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl p-6 border border-amber-500/20">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {animatedStats.compliance}%
            </div>
            <div className="text-sm text-slate-400">Uptime Target</div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8 overflow-hidden mb-12">
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
        <h2 className="text-2xl font-bold mb-6">Key Design Principles</h2>
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
          ].map((decision, i) => {
            const Icon = decision.icon;
            return (
              <div key={i} className={`bg-gradient-to-br from-${decision.color}-500/10 to-transparent rounded-xl p-6 border border-${decision.color}-500/20`}>
                <Icon className={`w-8 h-8 text-${decision.color}-400 mb-4`} />
                <h3 className="font-semibold mb-2">{decision.title}</h3>
                <p className="text-sm text-slate-400">{decision.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
