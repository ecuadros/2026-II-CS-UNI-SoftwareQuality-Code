'use client'

import React from 'react'
import {
  Printer,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Database,
  Download,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'

export function ReportView() {
  const { lastResult, scenarioName, components } = useSimulation()

  const handlePrint = () => {
    window.print()
  }

  if (!lastResult) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No hay datos de simulación disponibles para generar el informe.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8 print:p-0 print:max-w-none">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Informe Técnico de Resiliencia y Continuidad Operativa
          </h1>
          <p className="text-xs text-slate-500">
            Documento formal para auditorías de calidad y planes de recuperación ante desastres (DRP).
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir / Exportar a PDF</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-xs print:border-none print:shadow-none print:p-0 space-y-8">
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#172B4D] text-white shadow-md">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                ResilientOps
              </span>
              <p className="text-xs font-medium text-slate-500">
                Disaster Recovery & Business Continuity Simulator
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <span className="font-mono font-bold text-slate-800">
              REF: DRP-SIM-{lastResult.id.slice(-6)}
            </span>
            <p className="mt-0.5">Fecha: {lastResult.timestamp}</p>
            <p className="font-medium text-blue-600">Entorno de Simulación</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            1. Resumen Ejecutivo
          </h2>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Disponibilidad
              </span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                {Math.round(
                  (lastResult.servicesAvailable /
                    Math.max(lastResult.servicesTotal, 1)) *
                    100
                )}
                %
              </span>
              <span className="text-[10px] text-slate-500">
                {lastResult.servicesAvailable} de {lastResult.servicesTotal} operativos
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">
                RTO Estimado
              </span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">
                {lastResult.rtoEstimatedMinutes} min
              </span>
              <span className="text-[10px] text-slate-500">
                Tiempo de restauración
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Pérdida de Datos (RPO)
              </span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">
                {lastResult.dataLostGb} GB
              </span>
              <span className="text-[10px] text-slate-500">
                Brecha transaccional
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Datos Recuperables
              </span>
              <span className="text-xl font-bold text-indigo-700 mt-1 block">
                {lastResult.dataRecoverablePct}%
              </span>
              <span className="text-[10px] text-slate-500">
                {lastResult.dataRecoverableGb} / {lastResult.dataTotalGb} GB
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            2. Alcance del Escenario y Fallos Probados
          </h2>
          <div className="mt-3 text-xs text-slate-700 space-y-2">
            <p>
              <strong>Escenario:</strong> {lastResult.scenarioName}
            </p>
            <p>
              <strong>Eventos de fallo evaluados:</strong> {lastResult.eventDescription}
            </p>
            <p>
              <strong>Componentes comprometidos directamente:</strong>{' '}
              {lastResult.failureEvents.map((f) => f.targetId).join(', ')}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            3. Matriz de Impacto en Servicios y Conjuntos de Datos
          </h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-2.5">Elemento</th>
                  <th className="px-4 py-2.5">Tipo</th>
                  <th className="px-4 py-2.5">Estado Tras Fallo</th>
                  <th className="px-4 py-2.5">RTO</th>
                  <th className="px-4 py-2.5">Pérdida (RPO)</th>
                  <th className="px-4 py-2.5">Diagnóstico Técnico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {lastResult.recoveryDetails.map((rec, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 font-bold">{rec.name}</td>
                    <td className="px-4 py-2.5 capitalize text-slate-500">{rec.type}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`font-bold capitalize ${
                          rec.statusAfter === 'operativo'
                            ? 'text-emerald-700'
                            : rec.statusAfter === 'degradado'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {rec.statusAfter}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono">{rec.rtoMinutes} min</td>
                    <td className="px-4 py-2.5 font-mono">{rec.dataLossGb} GB</td>
                    <td className="px-4 py-2.5 text-slate-600">{rec.observations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            4. Puntos Únicos de Fallo (SPOF)
          </h2>
          <div className="mt-3 space-y-2 text-xs">
            {lastResult.spofIdentified.map((spof, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md bg-rose-50 border border-rose-200 p-2.5 text-rose-900"
              >
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  <strong>{spof}:</strong> No posee réplica activa en sitio secundario. Su interrupción detiene los servicios en cascada.
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            5. Recomendaciones Técnicas de Mejora
          </h2>
          <ol className="mt-3 list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>
              <strong>Habilitar arquitectura Activo-Activo:</strong> Configurar un clúster de servidores de aplicación en el Centro de Datos Arequipa con balanceo global de carga (GSLB) para mitigar caídas en Lima sin intervención manual.
            </li>
            <li>
              <strong>Geodistribución obligatoria de respaldos:</strong> Trasladar la copia del conjunto de logs y auditoría fuera del centro de datos primario hacia almacenamiento inmutable en la nube o en Arequipa.
            </li>
            <li>
              <strong>Ampliación de ancho de banda del enlace de contingencia:</strong> Aumentar la capacidad del enlace satelital o contratar un segundo operador de fibra oscura para evitar saturación durante la conmutación.
            </li>
            <li>
              <strong>Reducción de ventana RPO:</strong> Automatizar snapshots incrementales cada 30 minutos para disminuir la pérdida potencial de datos a menos de 5 GB.
            </li>
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-[11px] text-slate-400">
          <span>ResilientOps v0.1.0 • Generado automáticamente</span>
          <span>Página 1 de 1</span>
        </div>
      </div>
    </div>
  )
}
