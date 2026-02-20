"use client";

import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  Map,
  CheckCircle,
  Clock,
  Circle,
  Server,
  Lock,
  Globe,
  Zap,
  Rocket,
  Users,
  ChevronDown,
  ChevronRight,
  CalendarClock,
} from "lucide-react";

type PhaseStatus = "complete" | "in-progress" | "planned";

interface Phase {
  id: string;
  number: number;
  name: string;
  quarter: string;
  status: PhaseStatus;
  goal: string;
  deliverables: string[];
  tech: string[];
  successMetrics: string;
  icon: React.ElementType;
  color: string;
}

const phases: Phase[] = [
  {
    id: "phase-0",
    number: 0,
    name: "Foundation",
    quarter: "Q1 2026",
    status: "in-progress",
    goal: "Infrastructure scaffold and auth system.",
    deliverables: [
      "MVP frontend with role-based dashboards (IP Holder, AI Company, Admin) \u2714",
      "Demo authentication flow with cookie-based sessions \u2714",
      "Landing page with value proposition and content marketing \u2714",
      "Technical architecture documentation \u2714",
      "Scaleway Kubernetes cluster provisioning (Kapsule, Paris region)",
      "FastAPI project scaffold with Clean Architecture",
      "JWT authentication with OAuth 2.0 / MFA",
      "CI/CD pipeline (GitHub Actions \u2192 Scaleway)",
      "PostgreSQL 17 + Redis deployment",
    ],
    tech: ["Next.js 16", "React 19", "FastAPI", "Scaleway", "PostgreSQL 17"],
    successMetrics:
      "Backend serves /health from EU infrastructure. Auth flow works end-to-end.",
    icon: Server,
    color: "blue",
  },
  {
    id: "phase-1",
    number: 1,
    name: "Core Backend",
    quarter: "Q2 2026",
    status: "planned",
    goal: "Replace mock data with real services.",
    deliverables: [
      "Catalog Service \u2014 asset metadata CRUD, CSV/JSON bulk upload",
      "Meilisearch integration \u2014 full-text search with filters",
      "License Service \u2014 request/approve/reject workflow, agreement generation",
      "Compliance Service \u2014 EU AI Act report generation (PDF/JSON/XML)",
      "Payment Service \u2014 Stripe Connect for marketplace payments",
      "Notification Service \u2014 email notifications for license events",
      "Audit logging \u2014 immutable event trail for all operations",
    ],
    tech: ["Python 3.12+", "Celery", "Redis Pub/Sub", "Meilisearch", "Stripe"],
    successMetrics:
      "Full licensing workflow works via API. Compliance reports generate correctly.",
    icon: Zap,
    color: "purple",
  },
  {
    id: "phase-2",
    number: 2,
    name: "Frontend Integration",
    quarter: "Q2\u2013Q3 2026",
    status: "planned",
    goal: "Connect the live frontend to real backend APIs.",
    deliverables: [
      "Replace all mock data with API calls",
      "Real-time updates via WebSocket",
      "File upload for catalog metadata",
      "Payment integration in AI Company portal",
      "Compliance report download in dashboards",
      "Admin panel with live platform metrics",
    ],
    tech: ["Next.js 16", "WebSocket", "React Query", "Stripe Elements"],
    successMetrics:
      "Complete user journey works \u2014 from catalog upload to licensed content with compliance report.",
    icon: Globe,
    color: "emerald",
  },
  {
    id: "phase-3",
    number: 3,
    name: "Blockchain Audit Trail",
    quarter: "Q3 2026",
    status: "planned",
    goal: "Immutable proof of licensing on Polygon.",
    deliverables: [
      "Solidity smart contracts for license recording",
      "ethers.js v6 integration for on-chain transactions",
      "Agreement hash storage (SHA-256 \u2192 Polygon)",
      "Blockchain explorer integration in dashboards",
      "IPFS backup for agreement documents",
      "Smart contract audit (third-party)",
    ],
    tech: ["Polygon (L2)", "Solidity", "ethers.js v6", "IPFS"],
    successMetrics:
      "Every executed license has a verifiable on-chain record. Gas cost < $0.01/tx.",
    icon: Lock,
    color: "indigo",
  },
  {
    id: "phase-4",
    number: 4,
    name: "Cineflix Pilot",
    quarter: "Q3\u2013Q4 2026",
    status: "planned",
    goal: "First real customer onboarded with production data.",
    deliverables: [
      "Onboard Cineflix catalog (100\u2013500 assets)",
      "Real licensing transactions with actual payments",
      "Compliance reports accepted by AI company legal teams",
      "Performance validation under real load",
      "User feedback incorporation",
      "Security penetration testing",
    ],
    tech: ["Full Stack", "Stripe Live", "Load Testing", "Pen Testing"],
    successMetrics:
      "Cineflix actively licensing content through the platform. At least 10 executed licenses.",
    icon: Users,
    color: "amber",
  },
  {
    id: "phase-5",
    number: 5,
    name: "Production Launch",
    quarter: "Q4 2026",
    status: "planned",
    goal: "Platform ready for general availability.",
    deliverables: [
      "Stripe Live mode (production payments)",
      "Full security audit (SOC 2 aligned)",
      "Multi-tenant onboarding flow",
      "API documentation portal for AI companies",
      "Auto-scaling validated (10K req/s target)",
      "Multi-region disaster recovery (Paris + Amsterdam)",
      "Marketing site and public launch",
    ],
    tech: ["Kubernetes", "Terraform", "Multi-region", "SOC 2"],
    successMetrics:
      "Multiple IP holders and AI companies transacting. Platform handles production load.",
    icon: Rocket,
    color: "orange",
  },
];

/**
 * Returns Tailwind classes for a phase status badge.
 */
function getStatusStyle(status: PhaseStatus) {
  switch (status) {
    case "complete":
      return {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        label: "Complete",
        Icon: CheckCircle,
      };
    case "in-progress":
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
        label: "In Progress",
        Icon: Clock,
      };
    case "planned":
      return {
        bg: "bg-slate-500/20",
        text: "text-slate-400",
        border: "border-slate-500/30",
        label: "Planned",
        Icon: Circle,
      };
  }
}

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase-0");

  const completeCount = phases.filter((p) => p.status === "complete").length;
  const inProgressCount = phases.filter(
    (p) => p.status === "in-progress",
  ).length;
  const plannedCount = phases.filter((p) => p.status === "planned").length;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Product Roadmap</h1>
              <p className="text-slate-400">
                Path to production before the EU AI Act deadline
              </p>
            </div>
          </div>
          <p className="text-slate-400 max-w-3xl mt-4">
            SILOETT Rights is being built in 6 phases, targeting general
            availability before the EU AI Act Article 53 compliance deadline.
            The MVP frontend is already live with full UI flows.
          </p>
        </div>

        {/* EU AI Act Deadline Banner */}
        <div className="mb-12 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent rounded-2xl border border-red-500/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <CalendarClock className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-red-400">
                  EU AI Act Article 53
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-400 animate-pulse">
                  August 2, 2026
                </span>
              </div>
              <p className="text-sm text-slate-400">
                GPAI providers must document and prove licensing of copyrighted
                training data — or face fines up to{" "}
                <span className="text-red-400 font-semibold">
                  {"\u20AC"}15M / 3% global revenue
                </span>
                . SILOETT Rights enables compliance before this deadline.
              </p>
            </div>
          </div>
        </div>

        {/* MVP Status Banner */}
        <div className="mb-12 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl border border-emerald-500/20 p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-emerald-400">
                  Frontend MVP — Live
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400">
                  Complete
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Full UI with role-based dashboards (IP Holder, AI Company,
                Admin), demo authentication, landing page, and technical
                architecture documentation. This isn&apos;t just slides —
                it&apos;s working software.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl p-6 border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {completeCount}
            </div>
            <div className="text-sm text-slate-400">Complete</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {inProgressCount}
            </div>
            <div className="text-sm text-slate-400">In Progress</div>
          </div>
          <div className="bg-gradient-to-br from-slate-500/10 to-transparent rounded-xl p-6 border border-slate-500/20">
            <div className="text-3xl font-bold text-slate-400 mb-1">
              {plannedCount}
            </div>
            <div className="text-sm text-slate-400">Planned</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {phases.map((phase) => {
            const Icon = phase.icon;
            const isExpanded = expandedPhase === phase.id;
            const statusStyle = getStatusStyle(phase.status);
            const StatusIcon = statusStyle.Icon;

            return (
              <div
                key={phase.id}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full px-6 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${phase.color}-500 to-${phase.color}-600 flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        Phase {phase.number}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {phase.quarter}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusStyle.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {phase.name}
                    </h3>
                  </div>

                  <div className="hidden md:flex gap-2">
                    {phase.tech.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            Goal
                          </h4>
                          <p className="text-sm text-white bg-white/5 rounded-lg p-4">
                            {phase.goal}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            Deliverables
                          </h4>
                          <ul className="space-y-1.5">
                            {phase.deliverables.map((item, i) => {
                              const isDone = item.includes("\u2714");
                              return (
                                <li
                                  key={i}
                                  className={`text-sm flex items-start gap-2 ${isDone ? "text-emerald-400" : "text-slate-400"}`}
                                >
                                  {isDone ? (
                                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                                  )}
                                  {item.replace(" \u2714", "")}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            Technology
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.tech.map((t, i) => (
                              <span
                                key={i}
                                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            Success Metrics
                          </h4>
                          <p className="text-sm text-slate-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            {phase.successMetrics}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Architecture Table */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">
                    Layer
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">
                    Technology
                  </th>
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    layer: "Frontend",
                    tech: "Next.js 16, React 19, Tailwind CSS v4",
                    status: "Built",
                    done: true,
                  },
                  {
                    layer: "API Gateway",
                    tech: "FastAPI, Pydantic v2, JWT/OAuth 2.0",
                    status: "Planned",
                    done: false,
                  },
                  {
                    layer: "Services",
                    tech: "Python 3.12+, Celery, Redis Pub/Sub",
                    status: "Planned",
                    done: false,
                  },
                  {
                    layer: "Database",
                    tech: "PostgreSQL 17, Meilisearch, Redis",
                    status: "Planned",
                    done: false,
                  },
                  {
                    layer: "Blockchain",
                    tech: "Polygon (L2), Solidity, ethers.js v6",
                    status: "Planned",
                    done: false,
                  },
                  {
                    layer: "Infrastructure",
                    tech: "Scaleway (France), Kubernetes, Terraform",
                    status: "Planned",
                    done: false,
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-6 py-3 text-white font-medium">
                      {row.layer}
                    </td>
                    <td className="px-6 py-3 text-slate-400">{row.tech}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          row.done
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {row.status}
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
