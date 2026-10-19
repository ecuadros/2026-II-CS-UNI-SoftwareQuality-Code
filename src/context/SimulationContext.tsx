'use client'

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react'
import {
  ActiveSection,
  InfraComponent,
  Connection,
  Dataset,
  BackupCopy,
  SimulationResult,
  SimulationHistoryItem,
  FailureEvent,
} from '../types/resilient'
import {
  DEMO_SCENARIO_NAME,
  INITIAL_COMPONENTS,
  INITIAL_CONNECTIONS,
  INITIAL_DATASETS,
  INITIAL_BACKUPS,
  INITIAL_HISTORY,
} from '../data/mockData'
import { runDisasterSimulation } from '../lib/simulationEngine'

interface SimulationContextType {
  activeSection: ActiveSection
  setActiveSection: (sec: ActiveSection) => void
  scenarioName: string
  components: InfraComponent[]
  connections: Connection[]
  datasets: Dataset[]
  backups: BackupCopy[]
  history: SimulationHistoryItem[]
  lastResult: SimulationResult | null
  isSimulating: boolean
  isSimulationActive: boolean
  activeFailures: FailureEvent[]

  runSimulation: (events: FailureEvent[], customName?: string) => Promise<SimulationResult>
  resetScenario: () => void
  addComponent: (comp: Omit<InfraComponent, 'id'>) => void
  updateComponent: (id: string, comp: Partial<InfraComponent>) => void
  deleteComponent: (id: string) => void
  addDataset: (ds: Omit<Dataset, 'id'>) => void
  addBackup: (bk: Omit<BackupCopy, 'id'>) => void
  deleteBackup: (id: string) => void
  toggleFailureOnComponent: (id: string) => void
  loadHistoryResult: (result: SimulationResult) => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

interface StoredState {
  components?: InfraComponent[]
  datasets?: Dataset[]
  backups?: BackupCopy[]
  history?: SimulationHistoryItem[]
}

function readStoredState(): StoredState {
  const stored: StoredState = {}
  try {
    const savedComponents = localStorage.getItem('resilient_components')
    if (savedComponents) stored.components = JSON.parse(savedComponents)

    const savedDatasets = localStorage.getItem('resilient_datasets')
    if (savedDatasets) stored.datasets = JSON.parse(savedDatasets)

    const savedBackups = localStorage.getItem('resilient_backups')
    if (savedBackups) stored.backups = JSON.parse(savedBackups)

    const savedHistory = localStorage.getItem('resilient_history')
    if (savedHistory) stored.history = JSON.parse(savedHistory)
  } catch {
  }
  return stored
}

const subscribeNoop = () => () => {}

// false durante el SSR y la hidratación; true ya en el cliente
function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard')
  const [scenarioName] = useState<string>(DEMO_SCENARIO_NAME)
  const [components, setComponents] = useState<InfraComponent[]>(INITIAL_COMPONENTS)
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS)
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS)
  const [backups, setBackups] = useState<BackupCopy[]>(INITIAL_BACKUPS)
  const [history, setHistory] = useState<SimulationHistoryItem[]>(INITIAL_HISTORY)
  const [lastResult, setLastResult] = useState<SimulationResult | null>(
    INITIAL_HISTORY[0]?.result || null
  )
  const [isSimulating, setIsSimulating] = useState(false)
  const [isSimulationActive, setIsSimulationActive] = useState(false)
  const [activeFailures, setActiveFailures] = useState<FailureEvent[]>([])

  // Se lee localStorage recién en el cliente, después de hidratar con los datos iniciales
  const isClient = useIsClient()
  const [restoredFromStorage, setRestoredFromStorage] = useState(false)
  if (isClient && !restoredFromStorage) {
    setRestoredFromStorage(true)
    const stored = readStoredState()
    if (stored.components) setComponents(stored.components)
    if (stored.datasets) setDatasets(stored.datasets)
    if (stored.backups) setBackups(stored.backups)
    if (stored.history) setHistory(stored.history)
  }

  const runSimulation = async (
    events: FailureEvent[],
    customName?: string
  ): Promise<SimulationResult> => {
    setIsSimulating(true)

    // Pequeña pausa para que se vea el estado de "analizando"
    await new Promise((resolve) => setTimeout(resolve, 750))

    const result = runDisasterSimulation(
      INITIAL_COMPONENTS,
      INITIAL_CONNECTIONS,
      datasets,
      backups,
      events,
      scenarioName
    )

    setComponents(result.componentsAfter)
    setConnections(result.connectionsAfter)
    setLastResult(result)
    setIsSimulationActive(true)
    setActiveFailures(events)
    setIsSimulating(false)

    const historyItem: SimulationHistoryItem = {
      id: `hist-${Date.now()}`,
      name:
        customName ||
        `Simulación: ${events.map((e) => e.name).join(' + ')}`,
      scenario: scenarioName,
      failureType: events.map((e) => e.type).join(', '),
      date: result.timestamp,
      affectedServices: `${result.servicesDown} caídos, ${result.servicesDegraded} degradados`,
      estimatedRto: `${result.rtoEstimatedMinutes} min`,
      status: 'Completada',
      result,
    }

    const updatedHistory = [historyItem, ...history]
    setHistory(updatedHistory)
    localStorage.setItem('resilient_history', JSON.stringify(updatedHistory))

    setActiveSection('resultados')
    return result
  }

  const resetScenario = () => {
    setComponents(INITIAL_COMPONENTS)
    setConnections(INITIAL_CONNECTIONS)
    setIsSimulationActive(false)
    setActiveFailures([])
    localStorage.setItem('resilient_components', JSON.stringify(INITIAL_COMPONENTS))
  }

  // Componentes
  const addComponent = (comp: Omit<InfraComponent, 'id'>) => {
    const newComp: InfraComponent = {
      ...comp,
      id: `comp-${Date.now()}`,
    }
    const updated = [...components, newComp]
    setComponents(updated)
    localStorage.setItem('resilient_components', JSON.stringify(updated))
  }

  const updateComponent = (id: string, partial: Partial<InfraComponent>) => {
    const updated = components.map((c) => (c.id === id ? { ...c, ...partial } : c))
    setComponents(updated)
    localStorage.setItem('resilient_components', JSON.stringify(updated))
  }

  const deleteComponent = (id: string) => {
    const updated = components.filter((c) => c.id !== id)
    setComponents(updated)
    localStorage.setItem('resilient_components', JSON.stringify(updated))
  }

  // Datasets y respaldos
  const addDataset = (ds: Omit<Dataset, 'id'>) => {
    const newDs: Dataset = { ...ds, id: `ds-${Date.now()}` }
    const updated = [...datasets, newDs]
    setDatasets(updated)
    localStorage.setItem('resilient_datasets', JSON.stringify(updated))
  }

  const addBackup = (bk: Omit<BackupCopy, 'id'>) => {
    const newBk: BackupCopy = { ...bk, id: `bk-${Date.now()}` }
    const updated = [...backups, newBk]
    setBackups(updated)
    localStorage.setItem('resilient_backups', JSON.stringify(updated))
  }

  const deleteBackup = (id: string) => {
    const updated = backups.filter((b) => b.id !== id)
    setBackups(updated)
    localStorage.setItem('resilient_backups', JSON.stringify(updated))
  }

  // Activar o desactivar un fallo desde el diagrama de topología
  const toggleFailureOnComponent = (id: string) => {
    const targetComp = components.find((c) => c.id === id)
    if (!targetComp) return

    const isCurrentlyFailed = targetComp.status === 'caido'
    const newEvent: FailureEvent = {
      id: `evt-${Date.now()}`,
      name: `Fallo manual en ${targetComp.name}`,
      type: targetComp.type === 'datacenter' ? 'datacenter' : 'server',
      targetId: id,
      description: `Disparo manual desde el lienzo de infraestructura`,
    }

    if (isCurrentlyFailed) {
      resetScenario()
    } else {
      runSimulation([newEvent])
    }
  }

  const loadHistoryResult = (result: SimulationResult) => {
    setLastResult(result)
    setComponents(result.componentsAfter)
    setConnections(result.connectionsAfter)
    setIsSimulationActive(true)
    setActiveFailures(result.failureEvents)
    setActiveSection('resultados')
  }

  return (
    <SimulationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        scenarioName,
        components,
        connections,
        datasets,
        backups,
        history,
        lastResult,
        isSimulating,
        isSimulationActive,
        activeFailures,
        runSimulation,
        resetScenario,
        addComponent,
        updateComponent,
        deleteComponent,
        addDataset,
        addBackup,
        deleteBackup,
        toggleFailureOnComponent,
        loadHistoryResult,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
