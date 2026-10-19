'use client'

import React from 'react'
import { SimulationProvider, useSimulation } from '../context/SimulationContext'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { DashboardView } from '../components/dashboard/DashboardView'
import { InfrastructureView } from '../components/infrastructure/InfrastructureView'
import { DataBackupsView } from '../components/data/DataBackupsView'
import { SimulationsView } from '../components/simulations/SimulationsView'
import { ResultsView } from '../components/results/ResultsView'
import { HistoryView } from '../components/history/HistoryView'
import { ReportView } from '../components/report/ReportView'

function AppContent() {
  const { activeSection } = useSimulation()

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />
      case 'infraestructura':
        return <InfrastructureView />
      case 'datos':
        return <DataBackupsView />
      case 'simulaciones':
        return <SimulationsView />
      case 'resultados':
        return <ResultsView />
      case 'historial':
        return <HistoryView />
      case 'informe':
        return <ReportView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}

export default function ResilientOpsApp() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  )
}
