# ResilientOps

Simulador de continuidad operativa ante desastres.

ResilientOps permite modelar una infraestructura digital, simular fallos sobre ella y ver qué pasa con la disponibilidad de los servicios y con la recuperabilidad de los datos.

Proyecto del curso de Calidad de Software de la Universidad Nacional de Ingeniería (UNI).

![Dashboard de ResilientOps](public/preview.png)

## Funcionalidades

- **Dashboard de continuidad:** servicios disponibles, puntos únicos de fallo (SPOF), RTO, RPO y pérdida potencial de datos.
- **Modelado de infraestructura:** diagrama interactivo para agregar y editar centros de datos, servidores, almacenamiento y servicios.
- **Datos y respaldos:** registro de datasets críticos y de sus copias de respaldo.
- **Simulaciones:** asistente para elegir un escenario, configurar los fallos y ejecutarlo.
- **Resultados:** comparación antes/después, tabla de recuperación, hallazgos y SPOF detectados.
- **Historial:** registro de las simulaciones ejecutadas, que se pueden volver a abrir.
- **Informe técnico:** plan de recuperación ante desastres (DRP) listo para imprimir.

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Framework (App Router) |
| [React](https://react.dev) | 19 | Interfaz |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Estilos |
| [Lucide React](https://lucide.dev) | 1 | Íconos |
| TypeScript | 5 | Tipado estático |

No hay backend: toda la lógica corre en el navegador y los datos se guardan en `localStorage`.

## Correr en local

Requisitos:

- [Node.js](https://nodejs.org) 22.12 o superior (lo pide Vitest; Next.js funciona desde 20.9).
- [pnpm](https://pnpm.io) 12.14.0, porque el proyecto usa `pnpm-lock.yaml`. Si no lo tienes, instálalo con `npm install -g pnpm@12.14.0` o antepón `npx pnpm@12.14.0` a cada comando.

```bash
git clone -b G2-M5 https://github.com/ecuadros/2026-II-CS-UNI-SoftwareQuality-Code.git
cd 2026-II-CS-UNI-SoftwareQuality-Code
pnpm install --frozen-lockfile
pnpm dev
```

La aplicación queda en [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build de producción (antes hay que correr `pnpm build`) |
| `pnpm test` | Pruebas con Vitest |
| `pnpm test:coverage` | Pruebas con reporte de cobertura; falla si no se alcanza el umbral |
| `pnpm lint` | ESLint; falla con cualquier error o con más de 35 warnings |
| `pnpm exec tsc --noEmit` | Revisión de tipos |

`pnpm-workspace.yaml` bloquea el script de instalación de `unrs-resolver`, una dependencia de `eslint-config-next`. Ese script solo comprueba que el binario nativo esté presente, y pnpm ya instala el que corresponde a cada plataforma.

## Integración continua

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) corre en cada `push` y en cada `pull_request`, sobre Ubuntu con Node.js 22 y pnpm 12.14.0. Si un paso falla, el job se detiene y queda en rojo. El tiempo máximo es de 15 minutos.

| # | Paso | Comando | Qué detecta |
|---|---|---|---|
| 1 | Instalación | `pnpm install --frozen-lockfile` | `package.json` desincronizado de `pnpm-lock.yaml` |
| 2 | Tipos | `pnpm exec tsc --noEmit` | Errores de TypeScript (modo `strict`) |
| 3 | Análisis estático | `pnpm lint` | Errores de ESLint y warnings por encima del límite |
| 4 | Pruebas y cobertura | `pnpm test:coverage` | Regresiones en el motor y en el contexto, y cobertura por debajo del umbral |
| 5 | Compilación | `pnpm run build` | Errores de compilación de Next.js |
| 6 | Artefactos | `test -s .next/BUILD_ID …` | Build sin `BUILD_ID` o sin la página `/` prerenderizada |
| 7 | Prueba de humo | `pnpm start` + `curl` | El servidor de producción no responde o no sirve ResilientOps |

Para reproducir el pipeline en local basta con correr esos comandos en el mismo orden.

### Pruebas

- `src/lib/simulationEngine.test.ts` prueba el motor en Node: escenario sin fallos, caída del DC Lima, corte del enlace troncal, fallo del SAN de Lima, que las entradas no se modifiquen y algunos casos límite.
- `src/context/SimulationContext.test.tsx` corre en jsdom: renderiza en el servidor, hidrata y comprueba que no haya errores de hidratación y que los datos de `localStorage` se restauren, o se ignoren si están corruptos.

### Cobertura

La cobertura se mide sobre la lógica de la aplicación (`src/lib` y `src/context`). Las vistas quedan fuera porque las cubre la prueba de humo. Los umbrales están en [`vitest.config.ts`](vitest.config.ts):

- `src/lib`, el motor de simulación: 80% en sentencias, ramas, funciones y líneas.
- `src/lib` y `src/context` en conjunto: un piso apenas por debajo de la cobertura actual, para que no baje sin que el pipeline lo note.

## Despliegue

Es una aplicación Next.js estándar sin variables de entorno, así que se despliega en [Vercel](https://vercel.com) importando el repositorio, sin configuración extra. En un servidor propio basta con `pnpm install --frozen-lockfile`, `pnpm build` y `pnpm start` (puerto 3000), detrás de un proxy inverso si hace falta.

## Estructura

```
src/
├── app/                 # layout, página principal y 404
├── components/
│   ├── dashboard/
│   ├── data/            # datasets y respaldos
│   ├── history/
│   ├── infrastructure/  # diagrama de topología
│   ├── layout/          # sidebar, header y modal de ayuda
│   ├── report/          # informe DRP
│   ├── results/
│   └── simulations/     # asistente de simulación
├── context/             # estado global y su prueba de hidratación
├── data/mockData.ts     # infraestructura inicial (Lima / Arequipa)
├── lib/                 # motor de simulación y sus pruebas
└── types/resilient.ts
.github/workflows/ci.yml
```

## Escenario de demostración

La aplicación arranca con la infraestructura de una entidad con dos centros de datos:

- **DC Lima (principal):** Servidor App 01, Servidor DB 01 (PostgreSQL) y SAN Storage Lima.
- **DC Arequipa (DR):** Servidor DR 01 en standby y NAS Backup Arequipa.

Están unidos por un enlace troncal de fibra óptica y uno satelital de respaldo. Sobre ellos corren tres servicios: el portal de consulta, el sistema de gestión de registros y el API Gateway regional.

Escenarios predefinidos:

1. Caída total del DC Lima (corte de energía e inundación).
2. Fallo de hardware del Servidor App 01.
3. Corte del enlace troncal de fibra Lima - Arequipa.
4. Fallo de la SAN de Lima.

## Autora

Ariana López (ariana.lopez.j@uni.pe)<br>
Facultad de Ingeniería Industrial y de Sistemas, UNI. Curso de Calidad de Software.

## Licencia

MIT

## Curso

- [Video de referencia](https://www.linkedin.com/posts/carlosfloreslopez_excelente-exposici%C3%B3n-que-todo-especialista-activity-7184935465374879744-MAFX?utm_source=share&utm_medium=member_android)
- [Material del curso](https://ecuadros.github.io/SoftwareQuality/)
