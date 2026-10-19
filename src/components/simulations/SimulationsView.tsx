'use client'

import React, { useState } from 'react'
import {
  Flame,
  CheckCircle2,
  Building2,
  Server,
  Radio,
  HardDrive,
  Database,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Play,
  RotateCw,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { FailureEvent } from '../../types/resilient'

interface FailureOption {
  id: string
  name: string
  type: 'datacenter' | 'server' | 'link' | 'storage' | 'backup'
  targetId: string
  title: string
  description: string
  estimatedSeverity: 'Crítica' | 'Alta' | 'Media'
  icon: React.ComponentType<{ className?: string }>
}

const PREDEFINED_FAILURES: FailureOption[] = [
  {
    id: 'f-dc-lima',
    name: 'Indisponibilidad Total de Centro de Datos Lima',
    type: 'datacenter',
    targetId: 'dc-lima',
    title: 'Corte de Energía e Inundación en DC Lima (Principal)',
    description:
      'Pérdida catastrófica del centro de datos principal. Compromete todos los servidores de aplicaciones, base de datos primaria y almacenamiento SAN local.',
    estimatedSeverity: 'Crítica',
    icon: Building2,
  },
  {
    id: 'f-srv-app',
    name: 'Caída de Servidor App 01 (Frontend & API)',
    type: 'server',
    targetId: 'srv-app-lima',
    title: 'Fallo de Hardware en Clúster de Aplicaciones Lima',
    description:
      'Caída del servidor de aplicaciones. Afecta directamente al Portal Ciudadano y API Gateway al no contar con balanceador activo en Arequipa.',
    estimatedSeverity: 'Alta',
    icon: Server,
  },
  {
    id: 'f-link-fo',
    name: 'Interrupción de Enlace Troncal Fibra Óptica',
    type: 'link',
    targetId: 'conn-inter-fo',
    title: 'Corte de Fibra Óptica Troncal Lima - Arequipa',
    description:
      'Corte físico en la autopista central. Obliga a conmutar la replicación de datos al enlace satelital secundario (ancho de banda reducido a 100 Mbps).',
    estimatedSeverity: 'Media',
    icon: Radio,
  },
  {
    id: 'f-stor-san',
    name: 'Fallo de Sistema de Almacenamiento SAN Lima',
    type: 'storage',
    targetId: 'stor-san-lima',
    title: 'Corrupción en Controladora de Discos SAN Storage',
    description:
      'Indisponibilidad del volumen primario de datos. Requiere restauración inmediata desde las copias de respaldo en Arequipa.',
    estimatedSeverity: 'Alta',
    icon: HardDrive,
  },
]

export function SimulationsView() {
  const {
    scenarioName,
    components,
    datasets,
    backups,
    runSimulation,
    isSimulating,
  } = useSimulation()

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [simName, setSimName] = useState('Simulación de Desastre Regional')
  const [simDescription, setSimDescription] = useState(
    'Evaluación de continuidad operativa ante pérdida de infraestructura crítica.'
  )
  const [analysisType, setAnalysisType] = useState('Desastre en Centro de Datos')
  const [selectedFailures, setSelectedFailures] = useState<string[]>([
    'f-dc-lima',
  ])

  const toggleFailureSelection = (id: string) => {
    if (selectedFailures.includes(id)) {
      setSelectedFailures(selectedFailures.filter((f) => f !== id))
    } else {
      setSelectedFailures([...selectedFailures, id])
    }
  }

  const handleExecute = async () => {
    if (selectedFailures.length === 0) return

    const eventsToRun: FailureEvent[] = selectedFailures.map((fid) => {
      const option = PREDEFINED_FAILURES.find((f) => f.id === fid)!
      return {
        id: `event-${Date.now()}-${option.id}`,
        name: option.name,
        type: option.type,
        targetId: option.targetId,
        description: option.description,
      }
    })

    await runSimulation(eventsToRun, simName)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Configurador de Simulaciones de Desastre
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Define escenarios de fallo, evalúa cascadas de indisponibilidad y mide la efectividad de los respaldos.
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        {[
          { num: 1, label: 'Seleccionar escenario' },
          { num: 2, label: 'Configurar eventos de fallo' },
          { num: 3, label: 'Revisar impacto' },
          { num: 4, label: 'Ejecutar simulación' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (s.num < currentStep) setCurrentStep(s.num)
            }}
            className={`flex items-center gap-3 cursor-pointer ${
              currentStep === s.num
                ? 'text-blue-600 font-bold'
                : currentStep > s.num
                ? 'text-emerald-600 font-medium'
                : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {currentStep > s.num ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                s.num
              )}
            </div>
            <span className="text-xs hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">
            Paso 1: Parámetros Generales de la Simulación
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Simulación
              </label>
              <input
                type="text"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Escenario de Infraestructura Activo
              </label>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-slate-900">
                    {scenarioName}
                  </span>
                </div>
                <span className="text-slate-500">
                  {components.length} componentes • Lima & Arequipa
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Análisis
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Desastre en Centro de Datos">
                    Desastre en Centro de Datos
                  </option>
                  <option value="Corte de Conectividad Inter-regional">
                    Corte de Conectividad Inter-regional
                  </option>
                  <option value="Fallo de Servidor de Aplicación">
                    Fallo de Servidor de Aplicación
                  </option>
                  <option value="Corrupción de Almacenamiento Primario">
                    Corrupción de Almacenamiento Primario
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objetivo de Simulación
                </label>
                <input
                  type="text"
                  disabled
                  value="Medir RTO, RPO y disponibilidad de respaldo"
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción y Supuestos
              </label>
              <textarea
                value={simDescription}
                onChange={(e) => setSimDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <span>Continuar al Paso 2</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Paso 2: Seleccionar Eventos de Fallo
              </h2>
              <p className="text-xs text-slate-500">
                Elige uno o múltiples componentes cuya caída deseas simular.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600">
              {selectedFailures.length} seleccionados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREDEFINED_FAILURES.map((item) => {
              const Icon = item.icon
              const isSelected = selectedFailures.includes(item.id)

              return (
                <div
                  key={item.id}
                  onClick={() => toggleFailureSelection(item.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.estimatedSeverity === 'Crítica'
                          ? 'bg-rose-100 text-rose-700'
                          : item.estimatedSeverity === 'Alta'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.estimatedSeverity}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver</span>
            </button>

            <button
              disabled={selectedFailures.length === 0}
              onClick={() => setCurrentStep(3)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <span>Revisar Configuración</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Paso 3: Revisión de Impacto Estimado
            </h2>
            <p className="text-xs text-slate-500">
              Verifica los elementos comprometidos antes de disparar el motor de simulación.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Eventos de fallo activos:</span>
              <span className="text-rose-600 font-bold">
                {selectedFailures.length} evento(s)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Servicios potencialmente afectados:</span>
              <span className="text-slate-800">
                Portal de Consulta, Sistema de Registros
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Respaldos involucrados:</span>
              <span className="text-emerald-600 font-bold">
                NAS Backup Arequipa (Geodistribuido disponible)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block">Aviso del Motor de Simulación</span>
              <p className="mt-0.5 leading-relaxed">
                El cálculo evaluará rutas alternativas y la accesibilidad de copias en Arequipa.
                No se ejecutará ninguna acción en servidores reales.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Ajustar fallos</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <span>Ir a Ejecución</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xs space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
            <Flame className="h-8 w-8" />
          </div>

          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-900">
              ¿Listo para iniciar la simulación?
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              El motor calculará el estado de la topología, la cascada de dependencias,
              el tiempo de recuperación (RTO) y la posible pérdida de datos (RPO).
            </p>
          </div>

          <div className="pt-2">
            <button
              disabled={isSimulating}
              onClick={handleExecute}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition"
            >
              {isSimulating ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Procesando análisis de impacto...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Ejecutar simulación</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
