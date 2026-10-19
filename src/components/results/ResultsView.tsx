'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Layers,
  Printer,
  RotateCcw,
  Building2,
  Server,
  HardDrive,
  FileText,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'

export function ResultsView() {
  const { lastResult, resetScenario, setActiveSection } = useSimulation()
  const [viewTab, setViewTab] = useState<'comparativa' | 'tabla' | 'riesgos'>('comparativa')

  if (!lastResult) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <BarChart3 className="h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          Aún no se ha ejecutado ninguna simulación
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Ve a la sección de simulaciones para seleccionar un desastre y evaluar la resiliencia.
        </p>
        <button
          onClick={() => setActiveSection('simulaciones')}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
        >
          Iniciar simulación
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
              Simulación Ejecutada
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{lastResult.timestamp}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Resultados: {lastResult.eventDescription}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Escenario: <span className="font-semibold text-slate-800">{lastResult.scenarioName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetScenario}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Restablecer estado</span>
          </button>

          <button
            onClick={() => setActiveSection('informe')}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generar informe imprimible</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Servicios Operativos</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {lastResult.servicesAvailable}
            </span>
            <span className="text-xs text-slate-400">/ {lastResult.servicesTotal}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Servicios Afectados</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">
              {lastResult.servicesDown + lastResult.servicesDegraded}
            </span>
            <span className="text-xs text-slate-400">
              ({lastResult.servicesDown} caídos)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Nodos Comprometidos</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {lastResult.componentsAffected}
            </span>
            <span className="text-xs text-slate-400">/ {lastResult.componentsTotal}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Datos Recuperables</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600">
              {lastResult.dataRecoverablePct}%
            </span>
            <span className="text-xs text-slate-400">
              ({lastResult.dataRecoverableGb} GB)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">RTO Estimado</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {lastResult.rtoEstimatedMinutes} min
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pérdida de Datos (RPO)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {lastResult.dataLostGb} GB
            </span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setViewTab('comparativa')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            viewTab === 'comparativa'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Comparativa Antes vs Después
        </button>

        <button
          onClick={() => setViewTab('tabla')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            viewTab === 'tabla'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Análisis de Recuperación ({lastResult.recoveryDetails.length})
        </button>

        <button
          onClick={() => setViewTab('riesgos')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            viewTab === 'riesgos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Riesgos y Hallazgos Accionables ({lastResult.findings.length})
        </button>
      </div>

      {viewTab === 'comparativa' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Estado Inicial (Línea Base)
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                100% Operativo
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lastResult.componentsBefore
                .filter((c) => c.type === 'service' || c.type === 'datacenter')
                .map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{comp.name}</span>
                      <span className="text-[11px] text-slate-500">{comp.location}</span>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Operativo
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-600" />
                Estado Tras el Desastre Simulado
              </span>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                {lastResult.componentsAffected} Nodos Afectados
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lastResult.componentsAfter
                .filter((c) => c.type === 'service' || c.type === 'datacenter')
                .map((comp) => {
                  const isDown = comp.status === 'caido'
                  const isDegraded = comp.status === 'degradado'

                  return (
                    <div
                      key={comp.id}
                      className={`flex items-center justify-between rounded-lg border p-3 text-xs ${
                        isDown
                          ? 'border-rose-200 bg-rose-50/70'
                          : isDegraded
                          ? 'border-amber-200 bg-amber-50/70'
                          : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{comp.name}</span>
                        <span className="text-[11px] text-slate-500">{comp.location}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isDown
                            ? 'bg-rose-100 text-rose-800'
                            : isDegraded
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isDown ? 'No disponible' : isDegraded ? 'Degradado' : 'Operativo'}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {viewTab === 'tabla' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-3.5">Elemento / Servicio / Dataset</th>
                <th className="px-6 py-3.5">Tipo</th>
                <th className="px-6 py-3.5">Estado Tras Fallo</th>
                <th className="px-6 py-3.5">Copia Accesible</th>
                <th className="px-6 py-3.5">RTO Estimado</th>
                <th className="px-6 py-3.5">Pérdida Estimada</th>
                <th className="px-6 py-3.5">Observaciones Técnicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {lastResult.recoveryDetails.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-500">
                    {item.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.statusAfter === 'operativo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.statusAfter === 'degradado'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span className="capitalize">{item.statusAfter}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.backupAvailable ? (
                      <span className="text-emerald-700 font-semibold">Sí (Arequipa)</span>
                    ) : (
                      <span className="text-rose-700 font-semibold">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                    {item.rtoMinutes > 0 ? `${item.rtoMinutes} min` : '0 min'}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {item.dataLossGb > 0 ? `${item.dataLossGb} GB` : '0 GB'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs leading-relaxed">
                    {item.observations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewTab === 'riesgos' && (
        <div className="space-y-4">
          {lastResult.findings.map((f) => (
            <div
              key={f.id}
              className={`rounded-xl border p-5 ${
                f.severity === 'alta'
                  ? 'border-rose-200 bg-rose-50/50'
                  : 'border-amber-200 bg-amber-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      f.severity === 'alta' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  />
                  {f.title}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    f.severity === 'alta'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Severidad {f.severity}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {f.message}
              </p>
            </div>
          ))}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Puntos Únicos de Fallo (SPOF) Detectados en la Topología:
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {lastResult.spofIdentified.map((spof, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-800">{spof}</span>
                  <span className="text-slate-400">
                    — Si este componente falla, se interrumpe el servicio sin alternativa.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
