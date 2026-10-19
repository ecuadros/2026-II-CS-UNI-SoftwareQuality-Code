'use client'

import React, { useState } from 'react'
import {
  HelpCircle,
  Radio,
  RotateCcw,
  ChevronRight,
  Server,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { HelpModal } from './HelpModal'

export function Header() {
  const {
    activeSection,
    scenarioName,
    isSimulationActive,
    resetScenario,
    activeFailures,
  } = useSimulation()

  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const sectionTitles: Record<string, string> = {
    dashboard: 'Dashboard de continuidad operativa',
    infraestructura: 'Modelado de Infraestructura Digital',
    datos: 'Gestión de Datos y Copias de Respaldo',
    simulaciones: 'Configuración y Ejecución de Simulaciones',
    resultados: 'Resultados y Análisis de Recuperación',
    historial: 'Historial de Simulaciones',
    informe: 'Informe Técnico Consolidado',
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>ResilientOps</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 capitalize">
              {activeSection}
            </span>
          </div>
          <span className="h-4 w-px bg-slate-200" />
          <h2 className="text-sm font-bold text-slate-800">
            {sectionTitles[activeSection] || 'ResilientOps'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700">
            <Server className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-semibold text-slate-900 truncate max-w-[220px]">
              {scenarioName}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
              isSimulationActive
                ? 'bg-rose-50 text-rose-700 ring-rose-200'
                : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            }`}
          >
            <Radio
              className={`h-3 w-3 ${
                isSimulationActive ? 'animate-pulse text-rose-600' : 'text-emerald-600'
              }`}
            />
            <span>
              {isSimulationActive
                ? `Simulación Activa (${activeFailures.length} fallos)`
                : 'Modo Normal'}
            </span>
          </div>

          {isSimulationActive && (
            <button
              onClick={resetScenario}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
              title="Restablecer infraestructura a estado operativo"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Restablecer</span>
            </button>
          )}

          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
            title="Ayuda del simulador"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
              AL
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <span className="block text-xs font-semibold text-slate-800">
                Ariana López
              </span>
              <span className="block text-[10px] text-slate-500">
                Operador SecOps
              </span>
            </div>
          </div>
        </div>
      </header>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  )
}
