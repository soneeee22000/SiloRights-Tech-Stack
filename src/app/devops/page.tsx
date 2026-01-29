'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  GitBranch, Server, Cloud, Container, Shield,
  CheckCircle, ArrowRight, Play, Code, Copy,
  Globe, Database, Cpu, Lock, Zap
} from 'lucide-react';

export default function DevOpsPage() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'cicd' | 'kubernetes'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const cicdPipeline = `name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-asyncio httpx

      - name: Run tests
        run: pytest tests/ -v --cov=app

      - name: Upload coverage
        uses: codecov/codecov-action@v4

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t siloett-api:\${{ github.sha }} .

      - name: Push to Scaleway Registry
        run: |
          docker tag siloett-api:\${{ github.sha }} \\
            rg.fr-par.scw.cloud/siloett/api:\${{ github.sha }}
          docker push rg.fr-par.scw.cloud/siloett/api:\${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/api-gateway \\
            api=rg.fr-par.scw.cloud/siloett/api:\${{ github.sha }}
          kubectl rollout status deployment/api-gateway`;

  const hpaConfig = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: siloett
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60`;

  const deploymentConfig = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: siloett
  labels:
    app: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
        - name: api
          image: rg.fr-par.scw.cloud/siloett/api:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
            - name: REDIS_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: redis_url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5`;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">DevOps & Deployment</h1>
              <p className="text-slate-400">CI/CD, Kubernetes, and EU-Sovereign Infrastructure</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'architecture', label: 'Infrastructure', icon: Cloud },
            { id: 'cicd', label: 'CI/CD Pipeline', icon: GitBranch },
            { id: 'kubernetes', label: 'Kubernetes', icon: Container },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Infrastructure Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            {/* Infrastructure Diagram */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
              <h2 className="text-xl font-bold mb-6">Deployment Architecture</h2>

              {/* Scaleway Section */}
              <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold">Scaleway (Paris, France)</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    EU Sovereign
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Kubernetes Cluster */}
                  <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Container className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold">Kubernetes Cluster (Kapsule)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'API Pods', icon: Server, color: 'blue' },
                        { name: 'Catalog Service', icon: Database, color: 'orange' },
                        { name: 'License Service', icon: Shield, color: 'emerald' },
                        { name: 'Celery Workers', icon: Zap, color: 'purple' },
                        { name: 'Redis Cache', icon: Database, color: 'red' },
                        { name: 'Meilisearch', icon: Globe, color: 'amber' },
                      ].map((svc, i) => {
                        const Icon = svc.icon;
                        return (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Icon className={`w-4 h-4 text-${svc.color}-400`} />
                            <span className="text-xs text-slate-300">{svc.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Managed Services */}
                  <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-5 h-5 text-orange-400" />
                      <span className="font-semibold">Managed Services</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'PostgreSQL Managed DB', desc: 'HA Primary + Read Replicas' },
                        { name: 'Object Storage (S3)', desc: 'Reports, Agreements, Exports' },
                        { name: 'Secret Manager', desc: 'API Keys, DB Credentials' },
                        { name: 'Container Registry', desc: 'Docker Images' },
                      ].map((svc, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white/5">
                          <div className="text-sm font-medium text-white">{svc.name}</div>
                          <div className="text-xs text-slate-500">{svc.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* External Services */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold">Cloudflare</span>
                  </div>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• CDN (Global Edge)</li>
                    <li>• WAF Protection</li>
                    <li>• DDoS Mitigation</li>
                    <li>• SSL/TLS Termination</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Vercel</span>
                  </div>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• IP Holder Portal</li>
                    <li>• AI Company Portal</li>
                    <li>• Admin Dashboard</li>
                    <li>• Edge Functions</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold">Polygon Network</span>
                  </div>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• License Smart Contracts</li>
                    <li>• Immutable Audit Trail</li>
                    <li>• &lt; $0.01/transaction</li>
                    <li>• &lt; 30s confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Infrastructure Stats */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Uptime Target', value: '99.99%', color: 'emerald' },
                { label: 'Regions', value: 'EU (Paris)', color: 'blue' },
                { label: 'Auto-scaling', value: '2-50 pods', color: 'purple' },
                { label: 'Data Residency', value: 'France', color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br from-${stat.color}-500/10 to-transparent rounded-xl p-6 border border-${stat.color}-500/20`}>
                  <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CI/CD Pipeline Tab */}
        {activeTab === 'cicd' && (
          <div className="space-y-8">
            {/* Pipeline Visualization */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
              <h2 className="text-xl font-bold mb-6">GitHub Actions Pipeline</h2>

              <div className="flex items-center justify-between mb-8">
                {[
                  { name: 'Push to main', icon: GitBranch, color: 'slate' },
                  { name: 'Run Tests', icon: Play, color: 'blue' },
                  { name: 'Build Image', icon: Container, color: 'purple' },
                  { name: 'Push Registry', icon: Cloud, color: 'orange' },
                  { name: 'Deploy K8s', icon: Server, color: 'emerald' },
                ].map((step, i, arr) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm text-slate-400 text-center">{step.name}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-slate-600" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Pipeline Code */}
              <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-mono text-slate-400">.github/workflows/deploy.yml</span>
                  </div>
                  <button
                    onClick={() => copyCode('cicd', cicdPipeline)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedCode === 'cicd' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto max-h-96">
                  {cicdPipeline}
                </pre>
              </div>
            </div>

            {/* Pipeline Features */}
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  title: 'Automated Testing',
                  items: ['pytest with coverage', 'Async test support', 'Integration tests', 'Codecov reporting']
                },
                {
                  title: 'Container Build',
                  items: ['Multi-stage Dockerfile', 'Layer caching', 'Security scanning', 'Size optimization']
                },
                {
                  title: 'Deployment',
                  items: ['Rolling updates', 'Health checks', 'Automatic rollback', 'Zero downtime']
                }
              ].map((section, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-white/10 p-6">
                  <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kubernetes Tab */}
        {activeTab === 'kubernetes' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {/* HPA Config */}
              <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-mono text-slate-400">HorizontalPodAutoscaler</span>
                  </div>
                  <button
                    onClick={() => copyCode('hpa', hpaConfig)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedCode === 'hpa' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
                  {hpaConfig}
                </pre>
              </div>

              {/* Deployment Config */}
              <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-mono text-slate-400">Deployment</span>
                  </div>
                  <button
                    onClick={() => copyCode('deployment', deploymentConfig)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedCode === 'deployment' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
                  {deploymentConfig}
                </pre>
              </div>
            </div>

            {/* Kubernetes Features */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
              <h2 className="text-xl font-bold mb-6">Kubernetes Configuration Highlights</h2>

              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Min Replicas', value: '2', desc: 'Always running' },
                  { label: 'Max Replicas', value: '50', desc: 'Peak capacity' },
                  { label: 'CPU Target', value: '70%', desc: 'Scale trigger' },
                  { label: 'Memory Target', value: '80%', desc: 'Scale trigger' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-sm font-medium text-slate-300">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Scale Up Behavior</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Stabilization window: 60 seconds
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Can double pods per minute (100%)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Fast response to traffic spikes
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Scale Down Behavior</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Stabilization window: 300 seconds
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Reduce by 10% per minute max
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Gradual scale down prevents thrashing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
