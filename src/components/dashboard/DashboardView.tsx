'use client'

import React from 'react'
import {
  Activity,
  AlertTriangle,
  Flame,
  Network,
  Clock,
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Server,
  Building2,
  HardDrive,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'

export function DashboardView() {
  const {
    components,
    lastResult,
    history,
    setActiveSection,
    isSimulationActive,
    loadHistoryResult,
  } = useSimulation()

  const services = components.filter((c) => c.type === 'service')
  const servicesAvailable = services.filter((s) => s.status === 'operativo').length
  const servicesDegraded = services.filter((s) => s.status === 'degradado').length
  const servicesDown = services.filter((s) => s.status === 'caido').length

  const spofCount = lastResult?.spofIdentified.length ?? 2
  const affectedCount = components.filter((c) => c.status === 'caido' || c.status === 'degradado').length

  const dataRecoverablePct = lastResult?.dataRecoverablePct ?? 100
  const rtoEstimated = lastResult ? `${lastResult.rtoEstimatedMinutes} min` : '0 min'
  const dataLossGb = lastResult ? `${lastResult.dataLostGb} GB` : '0 GB'

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard de continuidad operativa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Evalúa la resiliencia de tu infraestructura digital frente a fallos y desastres.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('infraestructura')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <Network className="h-4 w-4 text-slate-500" />
            <span>Ver infraestructura</span>
          </button>

          <button
            onClick={() => setActiveSection('simulaciones')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
          >
            <Flame className="h-4 w-4" />
            <span>Nueva simulación</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Servicios disponibles
            </span>
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {servicesAvailable} / {services.length}
            </span>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  servicesDown > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{
                  width: `${(servicesAvailable / Math.max(services.length, 1)) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            {servicesDegraded > 0 ? `${servicesDegraded} degradado` : 'Operatividad estable'}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Puntos únicos (SPOF)
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {spofCount}
            </span>
            <span className="ml-1 text-xs text-amber-600 font-medium">críticos</span>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            Sin redundancia activa
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Afectados en prueba
            </span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {affectedCount}
            </span>
            <span className="ml-1 text-xs text-slate-500">/ {components.length}</span>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            {isSimulationActive ? 'Bajo simulación activa' : 'Última simulación'}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Datos recuperables
            </span>
            <Database className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {dataRecoverablePct}%
            </span>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${dataRecoverablePct}%` }}
              />
            </div>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            Copias accesibles en DR
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              RTO Estimado
            </span>
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {rtoEstimated}
            </span>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            Tiempo de restauración
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pérdida potencial
            </span>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              {dataLossGb}
            </span>
          </div>
          <span className="mt-2 text-[11px] text-slate-500">
            Ventana transaccional (RPO)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Topología de Infraestructura en Tiempo Real
              </h2>
              <p className="text-xs text-slate-500">
                Estado operativo de nodos entre Centros de Datos Lima y Arequipa.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('infraestructura')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir editor completo</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">DC Lima (Principal)</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    components.find((c) => c.id === 'dc-lima')?.status === 'caido'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {components.find((c) => c.id === 'dc-lima')?.status === 'caido'
                    ? 'No disponible'
                    : 'Operativo'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {components
                  .filter((c) => c.datacenterId === 'dc-lima')
                  .map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {comp.type === 'server' ? (
                          <Server className="h-3.5 w-3.5 text-slate-500" />
                        ) : (
                          <HardDrive className="h-3.5 w-3.5 text-slate-500" />
                        )}
                        <span className="font-medium text-slate-800 truncate max-w-[170px]">
                          {comp.name}
                        </span>
                      </div>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          comp.status === 'caido' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">DC Arequipa (DR/Secundario)</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    components.find((c) => c.id === 'dc-arequipa')?.status === 'caido'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {components.find((c) => c.id === 'dc-arequipa')?.status === 'caido'
                    ? 'No disponible'
                    : 'Operativo'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {components
                  .filter((c) => c.datacenterId === 'dc-arequipa')
                  .map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {comp.type === 'server' ? (
                          <Server className="h-3.5 w-3.5 text-slate-500" />
                        ) : (
                          <HardDrive className="h-3.5 w-3.5 text-slate-500" />
                        )}
                        <span className="font-medium text-slate-800 truncate max-w-[170px]">
                          {comp.name}
                        </span>
                      </div>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          comp.status === 'caido' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Disponibilidad Comparativa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Impacto en disponibilidad de servicios antes vs después.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Línea Base (Sin fallos)</span>
                  <span className="text-emerald-600 font-bold">100%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Tras Última Simulación</span>
                  <span
                    className={`font-bold ${
                      servicesDown > 0 ? 'text-rose-600' : 'text-blue-600'
                    }`}
                  >
                    {Math.round((servicesAvailable / Math.max(services.length, 1)) * 100)}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      servicesDown > 0 ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{
                      width: `${(servicesAvailable / Math.max(services.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <span className="text-slate-600 font-medium truncate max-w-[190px]">
                    {svc.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      svc.status === 'operativo'
                        ? 'text-emerald-600'
                        : svc.status === 'degradado'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {svc.status === 'operativo' ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    <span className="capitalize">{svc.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveSection('resultados')}
              className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver análisis detallado de recuperación →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Últimas Simulaciones Ejecutadas
            </h2>
            <button
              onClick={() => setActiveSection('historial')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver todo el historial
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => loadHistoryResult(item.result)}
                className="flex items-center justify-between py-3 cursor-pointer group hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {item.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-medium">
                      {item.affectedServices}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    RTO {item.estimatedRto}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Riesgos de Continuidad Identificados
              </h2>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              {(lastResult?.findings.length || 2)} detectados
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 p-3 text-xs">
              <span className="font-bold text-amber-900 block">
                Punto Único de Fallo: Servidor App 01 en Lima
              </span>
              <p className="mt-1 text-slate-600">
                Los 3 servicios principales dependen de un único clúster de aplicación sin
                failover activo en Arequipa.
              </p>
            </div>

            <div className="rounded-lg border border-rose-200/80 bg-rose-50/50 p-3 text-xs">
              <span className="font-bold text-rose-900 block">
                Copia de respaldo no geodistribuida (Logs)
              </span>
              <p className="mt-1 text-slate-600">
                El respaldo de auditoría está ubicado en el mismo SAN de Lima. Un fallo en dicho
                centro de datos resulta en pérdida irrecuperable.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
              <span className="font-bold text-slate-800 block">
                Cuello de botella en enlace satelital de contingencia
              </span>
              <p className="mt-1 text-slate-600">
                El enlace de 100 Mbps no garantiza el throughput necesario para la sincronización
                continua de bases de datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
