"use client";

import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  FileCode,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Server,
  Cloud,
  Lock,
  Zap,
  Database,
  Globe,
} from "lucide-react";

interface ADR {
  id: string;
  title: string;
  status: "Accepted" | "Proposed" | "Deprecated";
  context: string;
  decision: string;
  consequences: {
    positive: string[];
    negative: string[];
  };
  mitigation?: string;
  icon: React.ElementType;
  color: string;
}

const adrs: ADR[] = [
  {
    id: "ADR-001",
    title: "Microservices vs Monolith",
    status: "Accepted",
    context:
      "Building a platform with distinct domains (Catalog, Licensing, Compliance, Payments) that need to scale independently.",
    decision:
      "Adopt microservices architecture with domain-driven design boundaries.",
    consequences: {
      positive: [
        "Independent deployment and scaling",
        "Technology flexibility per service",
        "Fault isolation between domains",
      ],
      negative: [
        "Added complexity for MVP",
        "Requires service mesh for production",
      ],
    },
    mitigation:
      'Start with "modular monolith" that can be split later. Services share database initially, separate post-MVP.',
    icon: Server,
    color: "blue",
  },
  {
    id: "ADR-002",
    title: "Event-Driven Communication",
    status: "Accepted",
    context:
      "Services need to communicate without tight coupling. License events must trigger blockchain recording and notifications.",
    decision:
      "Use Redis Pub/Sub for internal events, Celery for async job processing.",
    consequences: {
      positive: [
        "Loose coupling between services",
        "Async processing for heavy operations",
        "Event replay for debugging",
      ],
      negative: ["Eventual consistency challenges", "More complex debugging"],
    },
    mitigation:
      "Implement saga pattern for multi-step transactions. Use correlation IDs for tracing.",
    icon: Zap,
    color: "purple",
  },
  {
    id: "ADR-003",
    title: "EU-Sovereign Infrastructure",
    status: "Accepted",
    context:
      "EU AI Act compliance requires demonstrable EU data residency. Customer data must not leave EU jurisdiction.",
    decision:
      "Use Scaleway (France) for all infrastructure. Avoid AWS/GCP/Azure.",
    consequences: {
      positive: [
        "GDPR-native, EU-sovereign",
        "Differentiator vs US competitors",
        "Data residency guaranteed",
      ],
      negative: [
        "Fewer managed services",
        "Smaller community",
        "Limited global regions",
      ],
    },
    mitigation:
      "Use standard tools (Kubernetes, PostgreSQL) that work on any cloud. Plan for multi-cloud if needed.",
    icon: Cloud,
    color: "amber",
  },
  {
    id: "ADR-004",
    title: "Blockchain for Audit Trail",
    status: "Accepted",
    context:
      "EU AI Act requires auditable proof of licensing. Immutability is crucial for legal disputes.",
    decision: "Record license hashes on Polygon (Ethereum L2).",
    consequences: {
      positive: [
        "Immutable, verifiable records",
        "Decentralized trust",
        "Low cost (~$0.01/tx)",
      ],
      negative: [
        "Additional complexity",
        "Blockchain learning curve",
        "Gas price volatility (minimal on L2)",
      ],
    },
    mitigation:
      "Store only hashes on-chain. Full data off-chain in PostgreSQL. Use gas price alerts.",
    icon: Lock,
    color: "indigo",
  },
  {
    id: "ADR-005",
    title: "PostgreSQL as Primary Database",
    status: "Accepted",
    context:
      "Need ACID compliance, complex queries, JSONB for flexible metadata, and EU-hostable solution.",
    decision:
      "Use PostgreSQL 17 as the primary database with read replicas for scaling.",
    consequences: {
      positive: [
        "ACID compliance for transactions",
        "Rich query capabilities",
        "JSONB for flexible metadata",
        "Mature ecosystem",
      ],
      negative: ["Vertical scaling limits", "Complex sharding if needed"],
    },
    mitigation:
      "Use read replicas for read-heavy workloads. Consider Citus for horizontal scaling if needed.",
    icon: Database,
    color: "orange",
  },
  {
    id: "ADR-006",
    title: "Meilisearch for Full-Text Search",
    status: "Accepted",
    context:
      "Need fast, typo-tolerant search for catalog discovery. Must be EU-hostable.",
    decision: "Use Meilisearch instead of Elasticsearch/Algolia.",
    consequences: {
      positive: [
        "EU-created (French company)",
        "Simple to deploy and operate",
        "Fast out-of-the-box",
        "Open source",
      ],
      negative: ["Less mature than Elasticsearch", "Fewer advanced features"],
    },
    mitigation:
      "Sufficient for our use case. Can migrate to Elasticsearch later if needed.",
    icon: Globe,
    color: "emerald",
  },
];

export default function ADRsPage() {
  const [expandedADR, setExpandedADR] = useState<string | null>("ADR-001");

  const getStatusColor = (status: ADR["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Proposed":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Deprecated":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Architecture Decision Records
              </h1>
              <p className="text-slate-400">
                Key technical decisions and their rationale
              </p>
            </div>
          </div>
          <p className="text-slate-400 max-w-3xl mt-4">
            ADRs document significant architectural decisions made during the
            design of SILOETT Rights. Each record captures the context,
            decision, and consequences to help future developers understand why
            certain choices were made.
          </p>
        </div>

        {/* ADR Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl p-6 border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {adrs.filter((a) => a.status === "Accepted").length}
            </div>
            <div className="text-sm text-slate-400">Accepted</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl p-6 border border-amber-500/20">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {adrs.filter((a) => a.status === "Proposed").length}
            </div>
            <div className="text-sm text-slate-400">Proposed</div>
          </div>
          <div className="bg-gradient-to-br from-slate-500/10 to-transparent rounded-xl p-6 border border-slate-500/20">
            <div className="text-3xl font-bold text-slate-400 mb-1">
              {adrs.filter((a) => a.status === "Deprecated").length}
            </div>
            <div className="text-sm text-slate-400">Deprecated</div>
          </div>
        </div>

        {/* ADR List */}
        <div className="space-y-4">
          {adrs.map((adr) => {
            const Icon = adr.icon;
            const isExpanded = expandedADR === adr.id;

            return (
              <div
                key={adr.id}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedADR(isExpanded ? null : adr.id)}
                  className="w-full px-6 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${adr.color}-500 to-${adr.color}-600 flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {adr.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(adr.status)}`}
                      >
                        {adr.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {adr.title}
                    </h3>
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
                      {/* Context */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-400" />
                            Context
                          </h4>
                          <p className="text-sm text-slate-400 bg-white/5 rounded-lg p-4">
                            {adr.context}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Decision
                          </h4>
                          <p className="text-sm text-white bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            {adr.decision}
                          </p>
                        </div>
                      </div>

                      {/* Consequences */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">
                            Consequences
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                              <div className="text-xs font-semibold text-emerald-400 mb-2">
                                Positive
                              </div>
                              <ul className="space-y-1">
                                {adr.consequences.positive.map((item, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-slate-300 flex items-start gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                              <div className="text-xs font-semibold text-amber-400 mb-2">
                                Trade-offs
                              </div>
                              <ul className="space-y-1">
                                {adr.consequences.negative.map((item, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-slate-300 flex items-start gap-2"
                                  >
                                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {adr.mitigation && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">
                              Mitigation Strategy
                            </h4>
                            <p className="text-sm text-slate-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                              {adr.mitigation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Patterns Used Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Architecture Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Saga Pattern",
                desc: "Multi-step distributed transactions for licensing flow",
                usage:
                  "License request → approval → payment → blockchain recording",
              },
              {
                name: "Event Sourcing",
                desc: "Immutable audit trail for all license operations",
                usage:
                  "Every state change stored as event for replay and audit",
              },
              {
                name: "CQRS",
                desc: "Separate read/write models for catalog operations",
                usage:
                  "Optimized search queries independent of write operations",
              },
            ].map((pattern, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-white/10 p-6"
              >
                <h3 className="font-semibold text-white mb-2">
                  {pattern.name}
                </h3>
                <p className="text-sm text-slate-400 mb-3">{pattern.desc}</p>
                <div className="text-xs text-slate-500 bg-white/5 rounded-lg p-3 font-mono">
                  {pattern.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
