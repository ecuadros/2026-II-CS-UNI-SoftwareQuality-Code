import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runDisasterSimulation } from './simulationEngine'
import {
  INITIAL_BACKUPS,
  INITIAL_COMPONENTS,
  INITIAL_CONNECTIONS,
  INITIAL_DATASETS,
} from '../data/mockData'
import { FailureEvent, InfraComponent } from '../types/resilient'

const SCENARIO = 'Escenario de prueba'

const dcLimaFailure: FailureEvent = {
  id: 'ev-dc',
  name: 'Caída del Centro de Datos Lima',
  type: 'datacenter',
  targetId: 'dc-lima',
  description: 'Corte total de energía en la sede principal.',
}

const trunkLinkFailure: FailureEvent = {
  id: 'ev-link',
  name: 'Corte de Fibra Troncal',
  type: 'link',
  targetId: 'conn-inter-fo',
  description: 'Corte físico de la línea troncal de fibra.',
}

const sanLimaFailure: FailureEvent = {
  id: 'ev-stor',
  name: 'Fallo del SAN Lima',
  type: 'storage',
  targetId: 'stor-san-lima',
  description: 'Fallo del arreglo de almacenamiento principal.',
}

function simulate(failureEvents: FailureEvent[]) {
  return runDisasterSimulation(
    INITIAL_COMPONENTS,
    INITIAL_CONNECTIONS,
    INITIAL_DATASETS,
    INITIAL_BACKUPS,
    failureEvents,
    SCENARIO
  )
}

function statusOf(components: InfraComponent[], id: string) {
  return components.find((c) => c.id === id)?.status
}

describe('runDisasterSimulation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-18T15:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('metadatos del resultado', () => {
    it('genera el id a partir de la hora actual y conserva el escenario y los eventos', () => {
      const result = simulate([dcLimaFailure, trunkLinkFailure])

      expect(result.id).toBe(`sim-${new Date('2026-10-18T15:00:00Z').getTime()}`)
      expect(result.scenarioName).toBe(SCENARIO)
      expect(result.eventDescription).toBe(
        'Caída del Centro de Datos Lima, Corte de Fibra Troncal'
      )
      expect(result.failureEvents).toEqual([dcLimaFailure, trunkLinkFailure])
      expect(typeof result.timestamp).toBe('string')
      expect(result.timestamp.length).toBeGreaterThan(0)
    })
  })

  describe('sin eventos de fallo', () => {
    it('mantiene todos los servicios y componentes operativos', () => {
      const result = simulate([])

      expect(result.servicesTotal).toBe(3)
      expect(result.servicesAvailable).toBe(3)
      expect(result.servicesDegraded).toBe(0)
      expect(result.servicesDown).toBe(0)
      expect(result.componentsTotal).toBe(10)
      expect(result.componentsAffected).toBe(0)
      expect(result.findings).toEqual([])
    })

    it('calcula datos recuperables, RTO, RPO y pérdida estimada con los respaldos accesibles', () => {
      const result = simulate([])

      expect(result.dataTotalGb).toBe(1640)
      expect(result.dataRecoverableGb).toBe(1640)
      expect(result.dataRecoverablePct).toBe(100)
      // Máximo entre bk-1 (35/2), bk-2 (65/4) y bk-3 (20/19)
      expect(result.rtoEstimatedMinutes).toBe(65)
      expect(result.rpoEstimatedHours).toBe(19)
      // round(2*2.5) + round(4*2.5) + round(19*2.5) = 5 + 10 + 48
      expect(result.dataLostGb).toBe(63)
    })

    it('incluye un detalle de recuperación por dataset y por servicio', () => {
      const result = simulate([])

      expect(result.recoveryDetails).toHaveLength(6)
      expect(result.recoveryDetails.filter((d) => d.type === 'dataset')).toHaveLength(3)
      expect(result.recoveryDetails.filter((d) => d.type === 'servicio')).toHaveLength(3)
      result.recoveryDetails
        .filter((d) => d.type === 'servicio')
        .forEach((svc) => {
          expect(svc.statusAfter).toBe('operativo')
          expect(svc.rtoMinutes).toBe(0)
        })
    })

    it('identifica como SPOF los servidores y almacenamientos de Lima con servicios dependientes', () => {
      const result = simulate([])

      expect(result.spofIdentified).toEqual([
        'Servidor App 01 (Frontend & API) (Lima - Sede Central)',
        'Servidor DB 01 (PostgreSQL Master) (Lima - Sede Central)',
        'SAN Storage Lima (Lima - Sede Central)',
      ])
    })
  })

  describe('caída del centro de datos Lima', () => {
    it('propaga el fallo a los componentes alojados en el centro de datos', () => {
      const { componentsAfter } = simulate([dcLimaFailure])

      for (const id of ['dc-lima', 'srv-app-lima', 'srv-db-lima', 'stor-san-lima']) {
        expect(statusOf(componentsAfter, id)).toBe('caido')
      }
      for (const id of ['dc-arequipa', 'srv-dr-aqp', 'stor-nas-aqp']) {
        expect(statusOf(componentsAfter, id)).toBe('operativo')
      }
    })

    it('deja caídos todos los servicios que dependen de servidores de Lima', () => {
      const result = simulate([dcLimaFailure])

      expect(result.servicesDown).toBe(3)
      expect(result.servicesAvailable).toBe(0)
      expect(result.servicesDegraded).toBe(0)
      expect(result.componentsAffected).toBe(7)
    })

    it('marca caídas las conexiones con extremos fallidos aunque exista enlace redundante', () => {
      const { connectionsAfter } = simulate([dcLimaFailure])
      const status = (id: string) => connectionsAfter.find((c) => c.id === id)?.status

      for (const id of ['conn-1', 'conn-2', 'conn-3', 'conn-4', 'conn-inter-fo', 'conn-inter-sat']) {
        expect(status(id)).toBe('caido')
      }
      for (const id of ['conn-5', 'conn-6', 'conn-7']) {
        expect(status(id)).toBe('operativo')
      }
    })

    it('recupera solo los datasets con respaldo fuera de la zona afectada', () => {
      const result = simulate([dcLimaFailure])

      expect(result.dataTotalGb).toBe(1640)
      expect(result.dataRecoverableGb).toBe(1360)
      expect(result.dataRecoverablePct).toBe(83)
      // 5 + 10 de pérdida estimada por RPO, más los 280 GB de ds-3 sin respaldo accesible
      expect(result.dataLostGb).toBe(295)
      expect(result.rtoEstimatedMinutes).toBe(65)
      expect(result.rpoEstimatedHours).toBe(4)

      const audit = result.recoveryDetails.find(
        (d) => d.name === 'Logs de Auditoría y Transacciones de Seguridad'
      )
      expect(audit).toMatchObject({
        type: 'dataset',
        statusAfter: 'caido',
        backupAvailable: false,
        rtoMinutes: 0,
        dataLossGb: 280,
      })
    })

    it('asigna a los servicios caídos el RTO máximo de los respaldos accesibles', () => {
      const result = simulate([dcLimaFailure])

      result.recoveryDetails
        .filter((d) => d.type === 'servicio')
        .forEach((svc) => {
          expect(svc.statusAfter).toBe('caido')
          expect(svc.backupAvailable).toBe(false)
          expect(svc.rtoMinutes).toBe(65)
        })
    })

    it('genera hallazgos de alta disponibilidad y de respaldo en la misma zona', () => {
      const result = simulate([dcLimaFailure])

      expect(result.findings.map((f) => f.id)).toEqual(['f-1', 'f-bk-bk-3'])
      expect(result.findings.every((f) => f.severity === 'alta')).toBe(true)
    })
  })

  describe('corte del enlace troncal de fibra', () => {
    it('degrada el enlace caído al existir un enlace redundante disponible', () => {
      const { connectionsAfter } = simulate([trunkLinkFailure])

      expect(connectionsAfter.find((c) => c.id === 'conn-inter-fo')?.status).toBe('degradado')
      expect(connectionsAfter.find((c) => c.id === 'conn-inter-sat')?.status).toBe('operativo')
    })

    it('degrada los servicios sin caídas y sin pérdida de recuperabilidad', () => {
      const result = simulate([trunkLinkFailure])

      expect(result.servicesDegraded).toBe(3)
      expect(result.servicesDown).toBe(0)
      expect(result.servicesAvailable).toBe(0)
      expect(result.componentsAffected).toBe(3)
      expect(result.dataRecoverablePct).toBe(100)
      expect(result.dataLostGb).toBe(63)
    })

    it('genera el hallazgo de ruta alternativa con severidad media', () => {
      const result = simulate([trunkLinkFailure])

      expect(result.findings).toHaveLength(1)
      expect(result.findings[0]).toMatchObject({ id: 'f-link-1', severity: 'media' })
    })
  })

  describe('fallo del almacenamiento SAN de Lima', () => {
    it('deja caído el servicio que depende directamente del almacenamiento', () => {
      const result = simulate([sanLimaFailure])

      expect(statusOf(result.componentsAfter, 'stor-san-lima')).toBe('caido')
      expect(statusOf(result.componentsAfter, 'svc-registros')).toBe('caido')
      expect(statusOf(result.componentsAfter, 'dc-lima')).toBe('operativo')
      expect(result.servicesDown).toBe(1)
    })

    it('pierde el dataset cuyo único respaldo estaba en el almacenamiento fallido', () => {
      const result = simulate([sanLimaFailure])

      expect(result.dataRecoverableGb).toBe(1360)
      expect(result.dataRecoverablePct).toBe(83)
      expect(result.dataLostGb).toBe(295)
    })
  })

  describe('integridad de las entradas', () => {
    it('no modifica los componentes ni las conexiones recibidos', () => {
      const componentsSnapshot = JSON.parse(JSON.stringify(INITIAL_COMPONENTS))
      const connectionsSnapshot = JSON.parse(JSON.stringify(INITIAL_CONNECTIONS))

      const result = simulate([dcLimaFailure, trunkLinkFailure])

      expect(INITIAL_COMPONENTS).toEqual(componentsSnapshot)
      expect(INITIAL_CONNECTIONS).toEqual(connectionsSnapshot)
      expect(result.componentsBefore).toBe(INITIAL_COMPONENTS)
      expect(result.connectionsBefore).toBe(INITIAL_CONNECTIONS)
      expect(result.componentsAfter).not.toBe(INITIAL_COMPONENTS)
    })
  })

  describe('casos límite', () => {
    it('reporta 100% recuperable cuando no hay datasets registrados', () => {
      const result = runDisasterSimulation(
        INITIAL_COMPONENTS,
        INITIAL_CONNECTIONS,
        [],
        [],
        [dcLimaFailure],
        SCENARIO
      )

      expect(result.dataTotalGb).toBe(0)
      expect(result.dataRecoverableGb).toBe(0)
      expect(result.dataRecoverablePct).toBe(100)
      expect(result.dataLostGb).toBe(0)
      expect(result.rtoEstimatedMinutes).toBe(0)
      expect(result.recoveryDetails.filter((d) => d.type === 'dataset')).toHaveLength(0)
    })

    it('pierde todo el dataset cuando no tiene ninguna copia de respaldo', () => {
      const result = runDisasterSimulation(
        INITIAL_COMPONENTS,
        INITIAL_CONNECTIONS,
        INITIAL_DATASETS,
        [],
        [],
        SCENARIO
      )

      expect(result.dataRecoverableGb).toBe(0)
      expect(result.dataRecoverablePct).toBe(0)
      expect(result.dataLostGb).toBe(1640)
      expect(result.recoveryDetails.every((d) => d.type !== 'dataset' || !d.backupAvailable)).toBe(true)
    })
  })
})
