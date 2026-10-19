'use client'

import React, { useState } from 'react'
import {
  Database,
  HardDrive,
  Search,
  Filter,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  X,
  Building2,
} from 'lucide-react'
import { useSimulation } from '../../context/SimulationContext'
import { Dataset, BackupCopy } from '../../types/resilient'

export function DataBackupsView() {
  const { datasets, backups, addDataset, addBackup, deleteBackup, components } =
    useSimulation()

  const [activeTab, setActiveTab] = useState<'datasets' | 'backups'>('datasets')
  const [searchQuery, setSearchQuery] = useState('')
  const [criticalityFilter, setCriticalityFilter] = useState<string>('todos')

  const [isAddDatasetModalOpen, setIsAddDatasetModalOpen] = useState(false)
  const [isAddBackupModalOpen, setIsAddBackupModalOpen] = useState(false)

  // Formulario de nuevo dataset
  const [dsName, setDsName] = useState('')
  const [dsServiceId, setDsServiceId] = useState('svc-portal')
  const [dsSize, setDsSize] = useState(350)
  const [dsCriticality, setDsCriticality] = useState<'Alta' | 'Media' | 'Baja'>('Alta')
  const [dsLocation, setDsLocation] = useState('Lima - Sede Central')

  // Formulario de nuevo respaldo
  const [bkDatasetId, setBkDatasetId] = useState('ds-1')
  const [bkLocation, setBkLocation] = useState('Arequipa - Sede Regional')
  const [bkStorageId, setBkStorageId] = useState('stor-nas-aqp')
  const [bkSize, setBkSize] = useState(500)
  const [bkRto, setBkRto] = useState(45)
  const [bkRpo, setBkRpo] = useState(2)

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.primaryLocation.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCriticality =
      criticalityFilter === 'todos' || ds.criticality === criticalityFilter
    return matchesSearch && matchesCriticality
  })

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dsName.trim()) return

    addDataset({
      name: dsName,
      serviceId: dsServiceId,
      sizeGb: Number(dsSize),
      criticality: dsCriticality,
      primaryLocation: dsLocation,
      backupStatus: 'Disponible',
      lastBackupDate: 'Hoy, recién creado',
      storageComponentId: 'stor-san-lima',
    })

    setIsAddDatasetModalOpen(false)
    setDsName('')
  }

  const handleCreateBackup = (e: React.FormEvent) => {
    e.preventDefault()

    addBackup({
      datasetId: bkDatasetId,
      location: bkLocation,
      storageComponentId: bkStorageId,
      sizeGb: Number(bkSize),
      lastBackupTime: 'Hoy (Programado)',
      status: 'Disponible',
      rtoMinutes: Number(bkRto),
      rpoHours: Number(bkRpo),
    })

    setIsAddBackupModalOpen(false)
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Datos y Copias de Respaldo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra conjuntos de datos críticos, almacenamiento y políticas de restauración (RTO / RPO).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'datasets' ? (
            <button
              onClick={() => setIsAddDatasetModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo conjunto de datos</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddBackupModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar copia de respaldo</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold cursor-pointer transition ${
            activeTab === 'datasets'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Conjuntos de Datos ({datasets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold cursor-pointer transition ${
            activeTab === 'backups'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HardDrive className="h-4 w-4" />
          <span>Copias de Respaldo ({backups.length})</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden shadow-2xs"
          />
        </div>

        {activeTab === 'datasets' && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Criticidad:</span>
            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-hidden"
            >
              <option value="todos">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'datasets' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-3.5">Nombre del Conjunto</th>
                <th className="px-6 py-3.5">Servicio Asociado</th>
                <th className="px-6 py-3.5">Tamaño</th>
                <th className="px-6 py-3.5">Criticidad</th>
                <th className="px-6 py-3.5">Ubicación Primaria</th>
                <th className="px-6 py-3.5">Última Copia</th>
                <th className="px-6 py-3.5">Estado Respaldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-800">
              {filteredDatasets.map((ds) => {
                const service = components.find((c) => c.id === ds.serviceId)
                return (
                  <tr key={ds.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span>{ds.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {service?.name || ds.serviceId}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      {ds.sizeGb} GB
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          ds.criticality === 'Alta'
                            ? 'bg-rose-100 text-rose-800'
                            : ds.criticality === 'Media'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ds.criticality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {ds.primaryLocation}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {ds.lastBackupDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          ds.backupStatus === 'Disponible'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            ds.backupStatus === 'Disponible'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{ds.backupStatus}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-3.5">Dataset Respaldado</th>
                <th className="px-6 py-3.5">Ubicación / Centro de Datos</th>
                <th className="px-6 py-3.5">Dispositivo Almacenamiento</th>
                <th className="px-6 py-3.5">Tamaño Copia</th>
                <th className="px-6 py-3.5">Última Copia</th>
                <th className="px-6 py-3.5">RTO Estimado</th>
                <th className="px-6 py-3.5">RPO (Antigüedad)</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-800">
              {backups.map((bk) => {
                const dataset = datasets.find((d) => d.id === bk.datasetId)
                const storage = components.find(
                  (c) => c.id === bk.storageComponentId
                )
                const isLimaLocal = bk.location.includes('Lima')

                return (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {dataset?.name || bk.datasetId}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{bk.location}</span>
                      {isLimaLocal && (
                        <span
                          className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800"
                          title="Riesgo: misma sede que el primario"
                        >
                          Misma Sede
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {storage?.name || bk.storageComponentId}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      {bk.sizeGb} GB
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {bk.lastBackupTime}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">
                      {bk.rtoMinutes} min
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {bk.rpoHours} h
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{bk.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteBackup(bk.id)}
                        className="cursor-pointer text-slate-400 hover:text-rose-600 transition"
                        title="Eliminar registro de respaldo"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {isAddDatasetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateDataset}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Registrar Nuevo Conjunto de Datos
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDatasetModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Dataset
              </label>
              <input
                type="text"
                required
                value={dsName}
                onChange={(e) => setDsName(e.target.value)}
                placeholder="Ej. Datos Catastrales y Prediales"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tamaño (GB)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={dsSize}
                  onChange={(e) => setDsSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criticidad
                </label>
                <select
                  value={dsCriticality}
                  onChange={(e) =>
                    setDsCriticality(e.target.value as 'Alta' | 'Media' | 'Baja')
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ubicación Principal
              </label>
              <input
                type="text"
                value={dsLocation}
                onChange={(e) => setDsLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddDatasetModalOpen(false)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Guardar dataset
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateBackup}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Registrar Copia de Respaldo
              </h3>
              <button
                type="button"
                onClick={() => setIsAddBackupModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Conjunto de Datos Asociado
              </label>
              <select
                value={bkDatasetId}
                onChange={(e) => setBkDatasetId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.sizeGb} GB)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubicación de Copia
                </label>
                <select
                  value={bkLocation}
                  onChange={(e) => setBkLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Arequipa - Sede Regional">
                    Arequipa (Geodistribuido)
                  </option>
                  <option value="Lima - Sede Central">
                    Lima (Local - Riesgo SPOF)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Almacenamiento
                </label>
                <select
                  value={bkStorageId}
                  onChange={(e) => setBkStorageId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="stor-nas-aqp">NAS Backup Arequipa</option>
                  <option value="stor-san-lima">SAN Storage Lima</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RTO Estimado (Minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bkRto}
                  onChange={(e) => setBkRto(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RPO / Frecuencia (Horas)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={bkRpo}
                  onChange={(e) => setBkRpo(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddBackupModalOpen(false)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Guardar copia de respaldo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
