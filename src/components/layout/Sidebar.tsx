'use client'

import React from 'react'
import {
  LayoutDashboard,
  Network,
  Database,
  Flame,
  BarChart3,
  History,
  Shield,
  FileText,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { ActiveSection } from '../../types/resilient'

interface NavItem {
  id: ActiveSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export function Sidebar() {
  const { activeSection, setActiveSection, isSimulationActive } = useSimulation()

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'infraestructura', label: 'Infraestructura', icon: Network },
    { id: 'datos', label: 'Datos y respaldos', icon: Database },
    {
      id: 'simulaciones',
      label: 'Simulaciones',
      icon: Flame,
      badge: isSimulationActive ? 'Activo' : undefined,
    },
    { id: 'resultados', label: 'Resultados', icon: BarChart3 },
    { id: 'historial', label: 'Historial', icon: History },
    { id: 'informe', label: 'Informe Técnico', icon: FileText },
  ]

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-[#172B4D] text-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white">
            ResilientOps
          </span>
          <p className="text-[11px] font-medium text-slate-400">
            Disaster Recovery Simulator
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Operaciones y Análisis
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group flex w-full cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4.5 w-4.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/40">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-700/60 p-4">
        <div className="rounded-lg bg-slate-800/80 p-3 ring-1 ring-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">
              ResilientOps
            </span>
            <span className="rounded bg-blue-900/60 px-1.5 py-0.5 text-[10px] font-mono font-medium text-blue-300">
              v0.1.0
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Entorno de simulación</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
