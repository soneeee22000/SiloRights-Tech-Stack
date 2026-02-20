"use client";

import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  Database,
  Table,
  Key,
  Link2,
  Search,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle,
  Code,
  Layers,
  ArrowRight,
} from "lucide-react";

interface Column {
  name: string;
  type: string;
  constraints?: string[];
  description?: string;
}

interface TableSchema {
  name: string;
  description: string;
  category: string;
  columns: Column[];
  indexes?: string[];
}

const tables: TableSchema[] = [
  {
    name: "companies",
    description: "Both IP Holders and AI Companies",
    category: "Core",
    columns: [
      {
        name: "id",
        type: "UUID",
        constraints: ["PRIMARY KEY", "DEFAULT gen_random_uuid()"],
      },
      { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
      {
        name: "type",
        type: "VARCHAR(50)",
        constraints: [
          "NOT NULL",
          "CHECK (type IN ('ip_holder', 'ai_company'))",
        ],
      },
      { name: "verified", type: "BOOLEAN", constraints: ["DEFAULT FALSE"] },
      { name: "verified_at", type: "TIMESTAMP WITH TIME ZONE" },
      {
        name: "contact_email",
        type: "VARCHAR(255)",
        constraints: ["NOT NULL"],
      },
      { name: "billing_address", type: "JSONB" },
      {
        name: "tax_id",
        type: "VARCHAR(100)",
        description: "VAT number for EU",
      },
      { name: "stripe_customer_id", type: "VARCHAR(255)" },
      {
        name: "stripe_account_id",
        type: "VARCHAR(255)",
        description: "For payouts (IP holders)",
      },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
      {
        name: "updated_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: ["idx_companies_type", "idx_companies_verified"],
  },
  {
    name: "users",
    description: "Platform users with company associations",
    category: "Core",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "email",
        type: "VARCHAR(255)",
        constraints: ["UNIQUE", "NOT NULL"],
      },
      {
        name: "password_hash",
        type: "VARCHAR(255)",
        constraints: ["NOT NULL"],
      },
      { name: "first_name", type: "VARCHAR(100)" },
      { name: "last_name", type: "VARCHAR(100)" },
      {
        name: "company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)"],
      },
      {
        name: "role",
        type: "VARCHAR(50)",
        constraints: [
          "NOT NULL",
          "CHECK (role IN ('admin', 'member', 'viewer'))",
        ],
      },
      { name: "is_active", type: "BOOLEAN", constraints: ["DEFAULT TRUE"] },
      { name: "mfa_enabled", type: "BOOLEAN", constraints: ["DEFAULT FALSE"] },
      { name: "last_login_at", type: "TIMESTAMP WITH TIME ZONE" },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: ["idx_users_company", "idx_users_email"],
  },
  {
    name: "assets",
    description: "IP catalog items with metadata",
    category: "Catalog",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
      },
      { name: "title", type: "VARCHAR(500)", constraints: ["NOT NULL"] },
      { name: "description", type: "TEXT" },
      {
        name: "content_type",
        type: "VARCHAR(50)",
        constraints: [
          "NOT NULL",
          "CHECK (content_type IN ('video', 'audio', 'image', 'text'))",
        ],
      },
      {
        name: "duration_seconds",
        type: "INTEGER",
        description: "For video/audio",
      },
      {
        name: "resolution",
        type: "VARCHAR(50)",
        description: "e.g., 1920x1080, 4K",
      },
      {
        name: "format",
        type: "VARCHAR(50)",
        description: "e.g., mp4, wav, png",
      },
      { name: "file_size_bytes", type: "BIGINT" },
      { name: "language", type: "VARCHAR(10)", description: "ISO 639-1" },
      { name: "production_year", type: "INTEGER" },
      { name: "genres", type: "TEXT[]", description: "Array of genre tags" },
      { name: "tags", type: "TEXT[]", description: "General tags" },
      {
        name: "external_id",
        type: "VARCHAR(255)",
        description: "IP holder's internal ID",
      },
      { name: "metadata", type: "JSONB", constraints: ["DEFAULT '{}'"] },
      {
        name: "status",
        type: "VARCHAR(50)",
        constraints: ["DEFAULT 'active'"],
      },
      {
        name: "search_vector",
        type: "TSVECTOR",
        description: "Full-text search",
      },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: [
      "idx_assets_company",
      "idx_assets_content_type",
      "idx_assets_status",
      "idx_assets_search (GIN)",
    ],
  },
  {
    name: "asset_terms",
    description: "Pricing and licensing terms for assets",
    category: "Catalog",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "asset_id",
        type: "UUID",
        constraints: ["REFERENCES assets(id)", "NOT NULL"],
      },
      {
        name: "price_per_unit",
        type: "DECIMAL(10, 2)",
        constraints: ["NOT NULL"],
      },
      { name: "currency", type: "VARCHAR(3)", constraints: ["DEFAULT 'EUR'"] },
      {
        name: "unit",
        type: "VARCHAR(50)",
        constraints: [
          "NOT NULL",
          "CHECK (unit IN ('hour', 'asset', 'gb', 'minute'))",
        ],
      },
      { name: "min_quantity", type: "INTEGER", constraints: ["DEFAULT 1"] },
      { name: "bulk_discount_threshold", type: "INTEGER" },
      { name: "bulk_discount_percent", type: "DECIMAL(5, 2)" },
      {
        name: "exclusivity_available",
        type: "BOOLEAN",
        constraints: ["DEFAULT FALSE"],
      },
      {
        name: "restrictions",
        type: "TEXT[]",
        description: "Array of restriction strings",
      },
      {
        name: "valid_from",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
      { name: "valid_until", type: "TIMESTAMP WITH TIME ZONE" },
    ],
  },
  {
    name: "asset_territories",
    description: "Territorial rights for assets",
    category: "Catalog",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "asset_id",
        type: "UUID",
        constraints: ["REFERENCES assets(id)", "NOT NULL"],
      },
      {
        name: "country_code",
        type: "VARCHAR(2)",
        constraints: ["NOT NULL"],
        description: "ISO 3166-1 alpha-2",
      },
      { name: "is_allowed", type: "BOOLEAN", constraints: ["DEFAULT TRUE"] },
      {
        name: "price_override",
        type: "DECIMAL(10, 2)",
        description: "NULL = use default",
      },
    ],
    indexes: ["UNIQUE(asset_id, country_code)"],
  },
  {
    name: "license_requests",
    description: "License request workflow",
    category: "Licensing",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "requester_company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
        description: "AI company",
      },
      {
        name: "holder_company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
        description: "IP holder",
      },
      { name: "intended_use", type: "TEXT", constraints: ["NOT NULL"] },
      { name: "model_name", type: "VARCHAR(255)" },
      {
        name: "territory",
        type: "VARCHAR(2)",
        description: "Primary territory",
      },
      {
        name: "status",
        type: "VARCHAR(50)",
        constraints: [
          "DEFAULT 'pending'",
          "CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled'))",
        ],
      },
      { name: "total_cost", type: "DECIMAL(12, 2)" },
      {
        name: "platform_fee",
        type: "DECIMAL(12, 2)",
        description: "SILOETT's cut",
      },
      { name: "currency", type: "VARCHAR(3)", constraints: ["DEFAULT 'EUR'"] },
      { name: "rejection_reason", type: "TEXT" },
      { name: "approved_at", type: "TIMESTAMP WITH TIME ZONE" },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: [
      "idx_license_requests_requester",
      "idx_license_requests_holder",
      "idx_license_requests_status",
    ],
  },
  {
    name: "licenses",
    description: "Active licenses with blockchain records",
    category: "Licensing",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "request_id",
        type: "UUID",
        constraints: ["REFERENCES license_requests(id)", "NOT NULL"],
      },
      {
        name: "status",
        type: "VARCHAR(50)",
        constraints: [
          "DEFAULT 'active'",
          "CHECK (status IN ('active', 'expired', 'revoked'))",
        ],
      },
      {
        name: "blockchain_tx_hash",
        type: "VARCHAR(255)",
        description: "Polygon transaction hash",
      },
      {
        name: "blockchain_network",
        type: "VARCHAR(50)",
        constraints: ["DEFAULT 'polygon'"],
      },
      {
        name: "agreement_hash",
        type: "VARCHAR(255)",
        description: "SHA-256 of full agreement",
      },
      { name: "agreement_url", type: "TEXT", description: "Signed PDF URL" },
      {
        name: "valid_from",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
      { name: "expires_at", type: "TIMESTAMP WITH TIME ZONE" },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: ["idx_licenses_status", "idx_licenses_blockchain_tx"],
  },
  {
    name: "transactions",
    description: "Payment transactions",
    category: "Payments",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "license_id",
        type: "UUID",
        constraints: ["REFERENCES licenses(id)"],
      },
      {
        name: "payer_company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
      },
      {
        name: "payee_company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
      },
      {
        name: "gross_amount",
        type: "DECIMAL(12, 2)",
        constraints: ["NOT NULL"],
      },
      {
        name: "platform_fee",
        type: "DECIMAL(12, 2)",
        constraints: ["NOT NULL"],
      },
      {
        name: "net_amount",
        type: "DECIMAL(12, 2)",
        constraints: ["NOT NULL"],
        description: "Amount to payee",
      },
      { name: "currency", type: "VARCHAR(3)", constraints: ["DEFAULT 'EUR'"] },
      {
        name: "status",
        type: "VARCHAR(50)",
        constraints: ["DEFAULT 'pending'"],
      },
      { name: "stripe_payment_intent_id", type: "VARCHAR(255)" },
      { name: "stripe_transfer_id", type: "VARCHAR(255)" },
      { name: "completed_at", type: "TIMESTAMP WITH TIME ZONE" },
    ],
    indexes: [
      "idx_transactions_payer",
      "idx_transactions_payee",
      "idx_transactions_status",
    ],
  },
  {
    name: "compliance_reports",
    description: "EU AI Act compliance reports",
    category: "Compliance",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "company_id",
        type: "UUID",
        constraints: ["REFERENCES companies(id)", "NOT NULL"],
      },
      {
        name: "format",
        type: "VARCHAR(10)",
        constraints: ["NOT NULL", "CHECK (format IN ('pdf', 'json', 'xml'))"],
      },
      { name: "file_url", type: "TEXT" },
      {
        name: "period_start",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["NOT NULL"],
      },
      {
        name: "period_end",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["NOT NULL"],
      },
      { name: "total_licenses", type: "INTEGER" },
      { name: "total_assets", type: "INTEGER" },
      { name: "total_spend", type: "DECIMAL(12, 2)" },
      {
        name: "eu_ai_act_version",
        type: "VARCHAR(50)",
        constraints: ["DEFAULT '2024/1689'"],
      },
      {
        name: "generated_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
  },
  {
    name: "audit_log",
    description: "Immutable audit trail",
    category: "Audit",
    columns: [
      { name: "id", type: "UUID", constraints: ["PRIMARY KEY"] },
      {
        name: "event_type",
        type: "VARCHAR(100)",
        constraints: ["NOT NULL"],
        description: "e.g., 'license.approved'",
      },
      {
        name: "entity_type",
        type: "VARCHAR(50)",
        constraints: ["NOT NULL"],
        description: "e.g., 'license'",
      },
      { name: "entity_id", type: "UUID", constraints: ["NOT NULL"] },
      { name: "actor_id", type: "UUID", constraints: ["REFERENCES users(id)"] },
      {
        name: "actor_type",
        type: "VARCHAR(50)",
        constraints: ["DEFAULT 'user'"],
        description: "'user', 'system', 'api'",
      },
      { name: "old_values", type: "JSONB" },
      { name: "new_values", type: "JSONB" },
      { name: "ip_address", type: "INET" },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        constraints: ["DEFAULT NOW()"],
      },
    ],
    indexes: [
      "idx_audit_log_entity",
      "idx_audit_log_actor",
      "idx_audit_log_created",
    ],
  },
];

const categories = [
  "Core",
  "Catalog",
  "Licensing",
  "Payments",
  "Compliance",
  "Audit",
];

export default function DatabasePage() {
  const [selectedTable, setSelectedTable] = useState<string>("companies");
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Core");

  const currentTable = tables.find((t) => t.name === selectedTable);

  const generateSQL = (table: TableSchema) => {
    let sql = `CREATE TABLE ${table.name} (\n`;
    sql += table.columns
      .map((col) => {
        let line = `    ${col.name} ${col.type}`;
        if (col.constraints) {
          line += " " + col.constraints.join(" ");
        }
        return line;
      })
      .join(",\n");
    sql += "\n);";
    return sql;
  };

  const copySQL = () => {
    if (currentTable) {
      navigator.clipboard?.writeText(generateSQL(currentTable));
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Database Schema</h1>
              <p className="text-slate-400">
                PostgreSQL 17 — ACID compliant, EU-hostable
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {tables.length}
            </div>
            <div className="text-sm text-slate-400">Tables</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl p-6 border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {tables.reduce((acc, t) => acc + t.columns.length, 0)}
            </div>
            <div className="text-sm text-slate-400">Columns</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {tables.reduce((acc, t) => acc + (t.indexes?.length || 0), 0)}
            </div>
            <div className="text-sm text-slate-400">Indexes</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl p-6 border border-amber-500/20">
            <div className="text-3xl font-bold text-amber-400 mb-1">6</div>
            <div className="text-sm text-slate-400">Categories</div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Table List */}
          <div className="w-72 shrink-0">
            <div className="sticky top-24 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 px-2">
                Tables
              </h3>

              {categories.map((category) => {
                const categoryTables = tables.filter(
                  (t) => t.category === category,
                );
                if (categoryTables.length === 0) return null;

                return (
                  <div key={category} className="mb-4">
                    <button
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === category ? "" : category,
                        )
                      }
                      className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300"
                    >
                      {category}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${activeCategory === category ? "rotate-180" : ""}`}
                      />
                    </button>

                    {activeCategory === category && (
                      <div className="mt-2 space-y-1">
                        {categoryTables.map((table) => (
                          <button
                            key={table.name}
                            onClick={() => setSelectedTable(table.name)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                              selectedTable === table.name
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <Table className="w-4 h-4" />
                            <span className="text-sm font-mono">
                              {table.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content - Table Details */}
          <div className="flex-1">
            {currentTable && (
              <div className="space-y-6">
                {/* Table Header */}
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold font-mono text-white">
                          {currentTable.name}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-400">
                          {currentTable.category}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        {currentTable.description}
                      </p>
                    </div>
                    <button
                      onClick={copySQL}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      {copiedSQL ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">Copy SQL</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Columns Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">
                            Column
                          </th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">
                            Type
                          </th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">
                            Constraints
                          </th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTable.columns.map((col, i) => (
                          <tr
                            key={col.name}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {col.constraints?.includes("PRIMARY KEY") && (
                                  <Key className="w-4 h-4 text-amber-400" />
                                )}
                                {col.constraints?.some((c) =>
                                  c.includes("REFERENCES"),
                                ) && (
                                  <Link2 className="w-4 h-4 text-blue-400" />
                                )}
                                <span className="font-mono text-white">
                                  {col.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-emerald-400">
                                {col.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {col.constraints?.map((c, j) => (
                                  <span
                                    key={j}
                                    className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300"
                                  >
                                    {c.length > 30
                                      ? c.substring(0, 30) + "..."
                                      : c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {col.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Indexes */}
                  {currentTable.indexes && currentTable.indexes.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">
                        Indexes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentTable.indexes.map((idx, i) => (
                          <span
                            key={i}
                            className="text-xs font-mono px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          >
                            {idx}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SQL Preview */}
                <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-400">
                        CREATE TABLE Statement
                      </span>
                    </div>
                  </div>
                  <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto">
                    {generateSQL(currentTable)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ERD Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Entity Relationships</h2>
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl border border-white/10 p-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  from: "users",
                  to: "companies",
                  type: "N:1",
                  label: "belongs to",
                },
                {
                  from: "assets",
                  to: "companies",
                  type: "N:1",
                  label: "owned by",
                },
                {
                  from: "asset_terms",
                  to: "assets",
                  type: "N:1",
                  label: "pricing for",
                },
                {
                  from: "license_requests",
                  to: "companies",
                  type: "N:1",
                  label: "from AI company",
                },
                {
                  from: "licenses",
                  to: "license_requests",
                  type: "1:1",
                  label: "fulfills",
                },
                {
                  from: "transactions",
                  to: "licenses",
                  type: "N:1",
                  label: "payment for",
                },
              ].map((rel, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5"
                >
                  <span className="font-mono text-sm text-blue-400">
                    {rel.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="font-mono text-sm text-emerald-400">
                    {rel.to}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-400 ml-auto">
                    {rel.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meilisearch Config */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Meilisearch Index Configuration
          </h2>
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">
                assets index
              </span>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto">
              {`{
  "primaryKey": "id",
  "searchableAttributes": [
    "title",
    "description",
    "tags",
    "genres",
    "rights_holder_name"
  ],
  "filterableAttributes": [
    "content_type",
    "status",
    "company_id",
    "territories",
    "price_range",
    "production_year",
    "language"
  ],
  "sortableAttributes": [
    "created_at",
    "price_per_unit",
    "duration_seconds",
    "production_year"
  ],
  "rankingRules": [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness"
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
