'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, Layers, Database, GitBranch, Activity,
  FileCode, ChevronDown, Menu, X, Sparkles,
  ExternalLink
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Architecture', icon: Layers, description: 'System overview & layers' },
  { href: '/adrs', label: 'ADRs', icon: FileCode, description: 'Architecture decisions' },
  { href: '/database', label: 'Database', icon: Database, description: 'Schema & models' },
  { href: '/devops', label: 'DevOps', icon: GitBranch, description: 'CI/CD & deployment' },
  { href: '/monitoring', label: 'Monitoring', icon: Activity, description: 'Observability stack' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-white/10 bg-[#0A0F1C]/80 backdrop-blur-xl sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400">
              EU AI Act Ready
            </span>
            <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-medium text-red-400 animate-pulse">
              Aug 2026 Deadline
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-400" />
            ) : (
              <Menu className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
