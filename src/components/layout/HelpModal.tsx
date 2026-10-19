'use client'

import React from 'react'
import { X, HelpCircle, Shield, AlertTriangle, Database, Zap } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Guía del Simulador ResilientOps
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5 text-sm text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              ¿Qué es ResilientOps?
            </h3>
            <p className="mt-1 leading-relaxed">
              Es un simulador de continuidad operativa ante desastres (Disaster Recovery).
              Permite modelar topologías de servidores, centros de datos y almacenamiento,
              y evaluar cómo resisten ante cortes de energía, fallos de conectividad o desastres
              regionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                RTO (Recovery Time Objective)
              </span>
              <p className="mt-1.5 text-xs text-slate-600">
                Tiempo máximo tolerable en el que un servicio o conjunto de datos debe ser
                restaurado tras un fallo.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-500" />
                RPO (Recovery Point Objective)
              </span>
              <p className="mt-1.5 text-xs text-slate-600">
                Límite de pérdida de datos aceptable, determinado por la antigüedad de la
                última copia de respaldo disponible.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              ¿Cómo ejecutar una simulación?
            </h3>
            <ol className="mt-2 list-decimal list-inside space-y-1.5 text-xs text-slate-600">
              <li>
                Ve a la sección <strong>Simulaciones</strong> o haz clic en <strong>Nueva simulación</strong>.
              </li>
              <li>
                Selecciona los eventos de fallo (ej. Caída de DC Lima o Servidor App 01).
              </li>
              <li>
                Revisa los componentes comprometidos y pulsa <strong>Ejecutar simulación</strong>.
              </li>
              <li>
                Analiza el informe de impacto, dependencias rotas y recomendaciones de resiliencia.
              </li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-3.5 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
