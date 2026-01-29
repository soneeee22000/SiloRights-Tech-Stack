'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  Activity, AlertTriangle, Bell, BarChart3,
  CheckCircle, Clock, Cpu, Database, Globe,
  Server, Zap, Eye, Code, Copy, TrendingUp
} from 'lucide-react';

export default function MonitoringPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState({
    requests: 0,
    latency: 0,
    errors: 0,
    uptime: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedMetrics({
        requests: 8547,
        latency: 142,
        errors: 0.02,
        uptime: 99.99
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const alertRules = `groups:
  - name: siloett-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected (> 1%)"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API latency above 500ms (p95)"

      - alert: DatabaseConnectionsHigh
        expr: pg_stat_activity_count > 900
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections above 900/1000"

      - alert: DatabaseDown
        expr: pg_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL is down"

      - alert: RedisDown
        expr: redis_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis is down"

      - alert: MeilisearchDown
        expr: meilisearch_up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Meilisearch is down"

      - alert: PodCrashLooping
        expr: |
          rate(kube_pod_container_status_restarts_total[15m])
          * 60 * 15 > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"`;

  const observabilityStack = [
    {
      name: 'Prometheus',
      icon: BarChart3,
      purpose: 'Metrics Collection',
      description: 'Time-series database for system and application metrics',
      color: 'orange',
      metrics: ['CPU/Memory usage', 'Request rates', 'Custom business metrics']
    },
    {
      name: 'Grafana',
      icon: TrendingUp,
      purpose: 'Visualization',
      description: 'Dashboards and alerting interface',
      color: 'amber',
      metrics: ['Real-time dashboards', 'Alert management', 'Annotations']
    },
    {
      name: 'Loki',
      icon: Eye,
      purpose: 'Log Aggregation',
      description: 'Horizontally-scalable log aggregation system',
      color: 'emerald',
      metrics: ['Application logs', 'Access logs', 'Error tracking']
    },
    {
      name: 'Jaeger',
      icon: Activity,
      purpose: 'Distributed Tracing',
      description: 'End-to-end request tracing across services',
      color: 'blue',
      metrics: ['Request flows', 'Latency breakdown', 'Service dependencies']
    },
    {
      name: 'Sentry',
      icon: AlertTriangle,
      purpose: 'Error Tracking',
      description: 'Application error monitoring and reporting',
      color: 'red',
      metrics: ['Stack traces', 'Error grouping', 'Release tracking']
    },
    {
      name: 'UptimeRobot',
      icon: Globe,
      purpose: 'External Monitoring',
      description: 'External availability monitoring from multiple locations',
      color: 'purple',
      metrics: ['Endpoint health', 'SSL expiry', 'Response times']
    }
  ];

  const dashboards = [
    {
      name: 'System Health',
      panels: ['CPU/Memory/Disk usage', 'Pod status', 'Network I/O', 'Node health'],
      refresh: '10s'
    },
    {
      name: 'API Performance',
      panels: ['Request rate', 'Latency percentiles (p50, p95, p99)', 'Error rate by endpoint', 'Throughput'],
      refresh: '5s'
    },
    {
      name: 'Business Metrics',
      panels: ['Assets indexed', 'Licenses created', 'Revenue processed', 'Compliance reports'],
      refresh: '1m'
    },
    {
      name: 'Database',
      panels: ['Connection pool', 'Query latency', 'Replication lag', 'Table sizes'],
      refresh: '30s'
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Monitoring & Observability</h1>
              <p className="text-slate-400">Prometheus, Grafana, Loki, Jaeger, Sentry</p>
            </div>
          </div>
        </div>

        {/* Live Metrics Simulation */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-emerald-400">Live</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {animatedMetrics.requests.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Requests / min</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl p-6 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-400">p95</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {animatedMetrics.latency}ms
            </div>
            <div className="text-sm text-slate-400">API Latency</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-transparent rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-emerald-400">Healthy</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {animatedMetrics.errors}%
            </div>
            <div className="text-sm text-slate-400">Error Rate</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-emerald-400">30d</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {animatedMetrics.uptime}%
            </div>
            <div className="text-sm text-slate-400">Uptime</div>
          </div>
        </div>

        {/* Observability Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Observability Stack</h2>
          <div className="grid grid-cols-3 gap-6">
            {observabilityStack.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${tool.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${tool.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{tool.name}</h3>
                      <p className="text-xs text-slate-500">{tool.purpose}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{tool.description}</p>
                  <div className="space-y-1">
                    {tool.metrics.map((metric, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Grafana Dashboards</h2>
          <div className="grid grid-cols-2 gap-6">
            {dashboards.map((dashboard, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{dashboard.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Refresh: {dashboard.refresh}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dashboard.panels.map((panel, j) => (
                    <div key={j} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-sm text-slate-400">
                      <BarChart3 className="w-4 h-4 text-slate-500" />
                      {panel}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Rules */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Prometheus Alerting Rules</h2>
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-mono text-slate-400">prometheus/alerts.yml</span>
              </div>
              <button
                onClick={() => copyCode('alerts', alertRules)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                {copiedCode === 'alerts' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto max-h-96">
              {alertRules}
            </pre>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {[
            {
              severity: 'Critical',
              color: 'red',
              alerts: ['HighErrorRate', 'DatabaseDown', 'RedisDown', 'PodCrashLooping'],
              action: 'Immediate response required'
            },
            {
              severity: 'Warning',
              color: 'amber',
              alerts: ['HighLatency', 'DatabaseConnectionsHigh', 'DiskSpaceLow'],
              action: 'Investigate within 1 hour'
            },
            {
              severity: 'Info',
              color: 'blue',
              alerts: ['DeploymentStarted', 'ScaleUpTriggered', 'BackupCompleted'],
              action: 'No action required'
            }
          ].map((level, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br from-${level.color}-500/10 to-transparent rounded-xl p-6 border border-${level.color}-500/20`}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={`w-5 h-5 text-${level.color}-400`} />
                <h3 className={`font-semibold text-${level.color}-400`}>{level.severity}</h3>
              </div>
              <ul className="space-y-1 mb-4">
                {level.alerts.map((alert, j) => (
                  <li key={j} className="text-sm text-slate-400">• {alert}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">{level.action}</p>
            </div>
          ))}
        </div>

        {/* SLOs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Service Level Objectives (SLOs)</h2>
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-4 text-slate-400 font-medium">Service</th>
                  <th className="pb-4 text-slate-400 font-medium">SLI</th>
                  <th className="pb-4 text-slate-400 font-medium">Target</th>
                  <th className="pb-4 text-slate-400 font-medium">Current</th>
                  <th className="pb-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: 'API Gateway', sli: 'Availability', target: '99.9%', current: '99.99%', status: 'met' },
                  { service: 'API Gateway', sli: 'Latency (p95)', target: '<200ms', current: '142ms', status: 'met' },
                  { service: 'Search', sli: 'Latency (p95)', target: '<100ms', current: '67ms', status: 'met' },
                  { service: 'Database', sli: 'Query Time (p95)', target: '<50ms', current: '38ms', status: 'met' },
                  { service: 'Blockchain', sli: 'Confirmation', target: '<30s', current: '12s', status: 'met' },
                ].map((slo, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 text-white font-medium">{slo.service}</td>
                    <td className="py-4 text-slate-300">{slo.sli}</td>
                    <td className="py-4 text-slate-400 font-mono">{slo.target}</td>
                    <td className="py-4 text-emerald-400 font-mono">{slo.current}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        slo.status === 'met'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {slo.status === 'met' ? 'SLO Met' : 'SLO Breach'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
