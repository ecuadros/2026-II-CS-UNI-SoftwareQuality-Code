'use client'

import React, { useState } from 'react'
import {
  History,
  Search,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'

export function HistoryView() {
  const { history, loadHistoryResult, setActiveSection } = useSimulation()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHistory = history.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.failureType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Historial de Simulaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registro de pruebas de continuidad operativa, ejercicios de caída y comparativas.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('simulaciones')}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <span>Nueva simulación</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o tipo de fallo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden shadow-2xs"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="px-6 py-3.5">Nombre de la Simulación</th>
              <th className="px-6 py-3.5">Escenario</th>
              <th className="px-6 py-3.5">Tipo de Fallo</th>
              <th className="px-6 py-3.5">Fecha de Ejecución</th>
              <th className="px-6 py-3.5">Servicios Afectados</th>
              <th className="px-6 py-3.5">RTO Estimado</th>
              <th className="px-6 py-3.5">Estado</th>
              <th className="px-6 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredHistory.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 transition cursor-pointer group"
                onClick={() => loadHistoryResult(item.result)}
              >
                <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[180px]">
                  {item.scenario}
                </td>
                <td className="px-6 py-4 text-slate-700 capitalize">
                  {item.failureType}
                </td>
                <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </td>
                <td className="px-6 py-4 font-medium text-rose-600">
                  {item.affectedServices}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                  {item.estimatedRto}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{item.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    <span>Ver informe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
