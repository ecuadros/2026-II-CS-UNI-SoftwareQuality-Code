'use client'

import React, { useState } from 'react'
import {
  Building2,
  Server,
  HardDrive,
  Globe,
  Radio,
  Plus,
  Trash2,
  Edit2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { InfraComponent, ComponentType, ComponentStatus } from '../../types/resilient'

export function InfrastructureView() {
  const {
    components,
    connections,
    addComponent,
    updateComponent,
    deleteComponent,
    toggleFailureOnComponent,
  } = useSimulation()

  const [selectedNode, setSelectedNode] = useState<InfraComponent | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Formulario de nuevo componente
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<ComponentType>('server')
  const [newLocation, setNewLocation] = useState('Lima - Sede Central')
  const [newDescription, setNewDescription] = useState('')
  const [newSpecs, setNewSpecs] = useState('')
  const [newDcId, setNewDcId] = useState('dc-lima')

  const handleCreateComponent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    addComponent({
      name: newName,
      type: newType,
      location: newLocation,
      status: 'operativo',
      description: newDescription || 'Componente de infraestructura',
      specs: newSpecs || 'Configuración estándar',
      datacenterId: newType !== 'datacenter' ? newDcId : undefined,
      x: 350 + Math.random() * 100,
      y: 200 + Math.random() * 80,
    })

    setIsAddModalOpen(false)
    setNewName('')
    setNewDescription('')
    setNewSpecs('')
  }

  const handleUpdateComponent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNode) return

    updateComponent(selectedNode.id, {
      name: selectedNode.name,
      location: selectedNode.location,
      description: selectedNode.description,
      specs: selectedNode.specs,
      status: selectedNode.status,
    })

    setIsEditModalOpen(false)
  }

  const getNodeIcon = (type: ComponentType) => {
    switch (type) {
      case 'datacenter':
        return Building2
      case 'server':
        return Server
      case 'storage':
        return HardDrive
      case 'service':
        return Globe
      case 'link':
        return Radio
      default:
        return Layers
    }
  }

  const getStatusColor = (status: ComponentStatus) => {
    switch (status) {
      case 'operativo':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800',
          dot: 'bg-emerald-500',
          stroke: '#16A34A',
        }
      case 'degradado':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          badge: 'bg-amber-100 text-amber-800',
          dot: 'bg-amber-500',
          stroke: '#D97706',
        }
      case 'caido':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-500',
          badge: 'bg-rose-100 text-rose-800',
          dot: 'bg-rose-500',
          stroke: '#DC2626',
        }
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-400',
          badge: 'bg-slate-100 text-slate-800',
          dot: 'bg-slate-400',
          stroke: '#64748B',
        }
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      <div className="relative flex-1 overflow-auto p-6">
        <div className="absolute top-8 left-8 z-10 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-xs">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar componente</span>
          </button>

          <span className="h-4 w-px bg-slate-200" />

          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Acercar"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Alejar"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setZoom(1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Ajustar vista"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="absolute bottom-8 left-8 z-10 flex items-center gap-4 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Operativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Degradado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>No disponible (Caído)</span>
          </div>
        </div>

        <div
          className="min-h-[700px] min-w-[1000px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-transform duration-150 origin-top-left"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {connections.map((conn) => {
              const fromComp = components.find((c) => c.id === conn.fromId)
              const toComp = components.find((c) => c.id === conn.toId)
              if (!fromComp || !toComp) return null

              const isDown = conn.status === 'caido'
              const isDegraded = conn.status === 'degradado'

              return (
                <g key={conn.id}>
                  <line
                    x1={fromComp.x + 90}
                    y1={fromComp.y + 40}
                    x2={toComp.x + 90}
                    y2={toComp.y + 40}
                    stroke={
                      isDown
                        ? '#DC2626'
                        : isDegraded
                        ? '#D97706'
                        : conn.isRedundant
                        ? '#2563EB'
                        : '#94A3B8'
                    }
                    strokeWidth={conn.isRedundant ? 2 : 2.5}
                    strokeDasharray={
                      isDown
                        ? '4,4'
                        : isDegraded
                        ? '6,3'
                        : conn.isRedundant
                        ? '5,5'
                        : undefined
                    }
                  />
                </g>
              )
            })}
          </svg>

          <div className="relative h-[650px] w-full">
            {components.map((comp) => {
              const Icon = getNodeIcon(comp.type)
              const style = getStatusColor(comp.status)
              const isSelected = selectedNode?.id === comp.id

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedNode(comp)}
                  style={{ left: `${comp.x}px`, top: `${comp.y}px` }}
                  className={`absolute z-10 w-44 cursor-pointer select-none rounded-xl border-2 bg-white p-3 shadow-xs transition-all hover:scale-102 hover:shadow-md ${
                    style.border
                  } ${isSelected ? 'ring-3 ring-blue-500/40 shadow-lg' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        style.bg
                      }`}
                    >
                      <Icon className="h-4 w-4 text-slate-800" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        style.badge
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className="capitalize">{comp.status}</span>
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 leading-tight">
                    {comp.name}
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-500 truncate">
                    {comp.location}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedNode ? (
        <aside className="w-80 border-l border-slate-200 bg-white p-6 shadow-sm overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Detalle del Componente
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="cursor-pointer text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Nombre</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {selectedNode.name}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Tipo</span>
              <p className="font-medium text-slate-700 capitalize mt-0.5">
                {selectedNode.type}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Ubicación</span>
              <p className="font-medium text-slate-700 mt-0.5">
                {selectedNode.location}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Estado actual</span>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                  getStatusColor(selectedNode.status).badge
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    getStatusColor(selectedNode.status).dot
                  }`}
                />
                <span className="capitalize">{selectedNode.status}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">Descripción</span>
              <p className="mt-0.5 text-slate-600 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.specs && (
              <div>
                <span className="text-slate-400 font-semibold block">
                  Especificaciones Técnicas
                </span>
                <p className="mt-0.5 font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200">
                  {selectedNode.specs}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Simulación Rápida de Fallo
              </span>
              <button
                onClick={() => toggleFailureOnComponent(selectedNode.id)}
                className={`w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 font-semibold text-xs shadow-2xs transition active:scale-95 ${
                  selectedNode.status === 'caido'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>
                  {selectedNode.status === 'caido'
                    ? 'Restaurar componente'
                    : 'Forzar fallo de este nodo'}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`¿Eliminar componente ${selectedNode.name}?`)) {
                    deleteComponent(selectedNode.id)
                    setSelectedNode(null)
                  }
                }}
                className="cursor-pointer flex items-center justify-center p-2 rounded-lg border border-slate-300 text-rose-600 hover:bg-rose-50"
                title="Eliminar componente"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      ) : (
        <aside className="w-80 border-l border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center text-slate-400">
          <Layers className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-xs font-medium">
            Selecciona un componente del diagrama para inspeccionar o simular su fallo.
          </p>
        </aside>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateComponent}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Agregar Nuevo Componente
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Servidor API Secundario"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ComponentType)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="server">Servidor</option>
                  <option value="storage">Almacenamiento</option>
                  <option value="service">Servicio Digital</option>
                  <option value="datacenter">Centro de Datos</option>
                  <option value="link">Enlace de Red</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Centro de Datos
                </label>
                <select
                  value={newDcId}
                  onChange={(e) => setNewDcId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="dc-lima">Lima</option>
                  <option value="dc-arequipa">Arequipa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especificaciones / Capacidad
              </label>
              <input
                type="text"
                value={newSpecs}
                onChange={(e) => setNewSpecs(e.target.value)}
                placeholder="Ej. 32 vCPU, 128 GB RAM"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                placeholder="Función de este componente..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Guardar componente
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditModalOpen && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleUpdateComponent}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Editar Componente
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={selectedNode.name}
                onChange={(e) =>
                  setSelectedNode({ ...selectedNode, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado
              </label>
              <select
                value={selectedNode.status}
                onChange={(e) =>
                  setSelectedNode({
                    ...selectedNode,
                    status: e.target.value as ComponentStatus,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="operativo">Operativo</option>
                <option value="degradado">Degradado</option>
                <option value="caido">No disponible (Caído)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especificaciones
              </label>
              <input
                type="text"
                value={selectedNode.specs || ''}
                onChange={(e) =>
                  setSelectedNode({ ...selectedNode, specs: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                value={selectedNode.description}
                onChange={(e) =>
                  setSelectedNode({ ...selectedNode, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
