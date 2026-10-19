// @vitest-environment jsdom
import { act } from 'react'
import { hydrateRoot, Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SimulationProvider, useSimulation } from './SimulationContext'
import { INITIAL_COMPONENTS, INITIAL_DATASETS } from '../data/mockData'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

function Probe() {
  const { components, datasets } = useSimulation()
  return (
    <p>
      <span id="components">{components.length}</span>
      <span id="datasets">{datasets.length}</span>
    </p>
  )
}

const app = (
  <SimulationProvider>
    <Probe />
  </SimulationProvider>
)

let container: HTMLDivElement
let root: Root | undefined
let recoverableErrors: unknown[]

async function serverRenderThenHydrate() {
  container.innerHTML = renderToString(app)
  const serverHtml = container.innerHTML
  await act(async () => {
    root = hydrateRoot(container, app, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    })
  })
  return serverHtml
}

const text = (id: string) => container.querySelector(`#${id}`)?.textContent

describe('SimulationProvider — restauración desde localStorage', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    localStorage.clear()
    recoverableErrors = []
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => root?.unmount())
    root = undefined
    container.remove()
  })

  it('hidrata sin errores y luego aplica los datos guardados', async () => {
    localStorage.setItem(
      'resilient_components',
      JSON.stringify(INITIAL_COMPONENTS.slice(0, 2))
    )
    localStorage.setItem('resilient_datasets', JSON.stringify([]))

    const serverHtml = await serverRenderThenHydrate()

    // El HTML del servidor no depende de localStorage
    expect(serverHtml).toContain(`<span id="components">${INITIAL_COMPONENTS.length}</span>`)
    expect(recoverableErrors).toEqual([])
    expect(text('components')).toBe('2')
    expect(text('datasets')).toBe('0')
  })

  it('conserva los datos iniciales cuando no hay nada guardado', async () => {
    await serverRenderThenHydrate()

    expect(recoverableErrors).toEqual([])
    expect(text('components')).toBe(String(INITIAL_COMPONENTS.length))
    expect(text('datasets')).toBe(String(INITIAL_DATASETS.length))
  })

  it('ignora datos corruptos y mantiene el estado inicial', async () => {
    localStorage.setItem('resilient_components', '{no es json')

    await serverRenderThenHydrate()

    expect(recoverableErrors).toEqual([])
    expect(text('components')).toBe(String(INITIAL_COMPONENTS.length))
  })
})
