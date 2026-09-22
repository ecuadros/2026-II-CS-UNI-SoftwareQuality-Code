# Módulo 02: Git/GitHub avanzado y flujo colaborativo

**CS395 Calidad de Software · UNI · 2026-II · Grupo G2 · Equipo B**

Idiomas / Languages: **Español** · [English](README.en.md)

| Integrante | Código |
| --- | --- |
| Huamán García, Brian Alberto | 20172734G |
| Limache López, Ebert Antonio | 20151380A |
| Quispe Amao, Diego Sebastián | 20202222I |

Este documento es la guía escrita de la exposición de 30 minutos. Cubre el tema completo (control de versiones, ramas, historial, integración, revisión, automatización y lanzamientos) y agrega tres piezas prácticas propias: un [laboratorio reproducible](lab/crear-laboratorio.sh), un [hook `commit-msg`](lab/hooks/commit-msg) y una demostración con `git bisect`.

Contenido de esta carpeta:

| Archivo | Contenido |
| --- | --- |
| [`README.md`](README.md) | Esta guía, en español |
| [`README.en.md`](README.en.md) | La misma guía, en inglés |
| [`lab/crear-laboratorio.sh`](lab/crear-laboratorio.sh) | Crea el repositorio de práctica (12 commits, 1 regresión escondida), en español o en inglés con `--lang en` |
| [`lab/hooks/commit-msg`](lab/hooks/commit-msg) | Hook que exige Conventional Commits |

## Contenido

- [Idea central](#idea-central)
- [Mapa contra el sílabo](#mapa-contra-el-sílabo)
- [Plan de la exposición (30 min)](#plan-de-la-exposición-30-min)
- [1. Control de versiones: centralizado vs distribuido](#1-control-de-versiones-centralizado-vs-distribuido)
- [2. Estrategias de ramificación](#2-estrategias-de-ramificación)
- [3. Historial legible: Conventional Commits y SemVer](#3-historial-legible-conventional-commits-y-semver)
- [4. Integrar cambios y resolver conflictos](#4-integrar-cambios-y-resolver-conflictos)
- [5. Git avanzado: investigar y recuperar](#5-git-avanzado-investigar-y-recuperar)
- [6. Pull requests, revisión y reglas del repositorio](#6-pull-requests-revisión-y-reglas-del-repositorio)
- [7. Automatización: hooks, CI y merge queue](#7-automatización-hooks-ci-y-merge-queue)
- [8. Gestión de lanzamientos](#8-gestión-de-lanzamientos)
- [9. Cadena de suministro y seguridad del repositorio](#9-cadena-de-suministro-y-seguridad-del-repositorio)
- [10. Laboratorio](#10-laboratorio)
- [11. Lista de verificación para un repositorio de equipo](#11-lista-de-verificación-para-un-repositorio-de-equipo)
- [Referencias](#referencias)

---

## Idea central

La calidad no se agrega al final con pruebas: se construye en la forma en que **cada cambio entra al código**. Un repositorio bien gobernado consigue cuatro cosas:

1. **Cambios pequeños**, fáciles de entender y de revisar.
2. **Doble control** sobre cada cambio: una persona lo revisa y una máquina lo verifica.
3. **Historial legible**, que sirve como documentación y como trazabilidad.
4. **Integración frecuente**, para que los conflictos sean pequeños y baratos.

Todo el módulo gira alrededor de un ejemplo pequeño y propio: la fórmula de la nota final del sílabo, `NF = (EP + EF + P) / 3`, implementada en `notas.py`. Esa función es la que se rompe y se recupera en el laboratorio.

**Por qué importa medirlo.** El libro *Accelerate* [4] asocia las ramas de vida corta, la integración frecuente y la entrega automatizada con mejor desempeño de los equipos, medido con cuatro métricas: frecuencia de despliegue, tiempo de entrega de un cambio, tasa de fallos de cambios y tiempo de recuperación. Un buen flujo de Git mueve estas cuatro métricas.

## Mapa contra el sílabo

Los temas de la Unidad 2 del sílabo (Control de Versiones y CI/CD) y la sección donde se trata cada uno:

| Tema o resultado esperado del sílabo | Sección |
| --- | --- |
| Diferencia entre gestión de configuración centralizada y distribuida | [1](#1-control-de-versiones-centralizado-vs-distribuido) |
| Estrategias de ramificación: ramas de desarrollo vs de lanzamiento, trunk-based | [2](#2-estrategias-de-ramificación) |
| Convenciones de commit (Conventional Commits) y versionado semántico | [3](#3-historial-legible-conventional-commits-y-semver) |
| Estrategias de fusión y rebase | [4](#4-integrar-cambios-y-resolver-conflictos) |
| Herramientas y práctica de Git para un equipo | [5](#5-git-avanzado-investigar-y-recuperar) |
| Revisión obligatoria de PR, propiedad del código (CODEOWNERS), reglas de protección de rama | [6](#6-pull-requests-revisión-y-reglas-del-repositorio) |
| CI como fuente de verdad del estado del código | [7](#7-automatización-hooks-ci-y-merge-queue) |
| Uso del control de versiones en la gestión de lanzamientos | [8](#8-gestión-de-lanzamientos) |
| Escaneo de vulnerabilidades de dependencias y de la cadena de suministro | [9](#9-cadena-de-suministro-y-seguridad-del-repositorio) |

## Plan de la exposición (30 min)

| Bloque | Secciones | Tiempo |
| --- | --- | --- |
| **A. Fundamentos y rescate** | Apertura, 1 (modelo de Git), 5 (avanzado + demostración con `bisect`), cierre | 10 min |
| **B. Flujo de equipo** | 2 (ramas), 3 (commits y SemVer), 4 (integración y conflictos) | 8 min |
| **C. Calidad y entrega** | 6 (PR y reglas), 7 (automatización), 8 y 9 (lanzamientos y seguridad) | 10 min |
| Margen y preguntas | | 2 min |

---

## 1. Control de versiones: centralizado vs distribuido

### 1.1 Dos modelos

| | Centralizado (Subversion, CVS, Perforce) | Distribuido (Git, Mercurial) |
| --- | --- | --- |
| Dónde vive el historial | En un servidor único | En **cada clon**, completo |
| Para hacer commit | Se necesita conexión al servidor | Se hace **local**, sin red |
| Ramas | Más costosas de manejar y, sobre todo, de fusionar | Punteros baratos |
| Punto único de falla | El servidor | Ninguno: cada clon es una copia de respaldo |
| Publicar | El commit ya es público | Se separa `commit` (local) de `push` (compartir) |

Esa separación entre **registrar** y **compartir** es lo que hace posibles el rebase local, los commits pequeños y el trabajo sin conexión. También tiene un costo: hace falta un acuerdo de equipo sobre qué se publica y cuándo, que es el tema del resto del módulo.

### 1.2 Git por dentro: cuatro tipos de objeto

Git guarda instantáneas (*snapshots*) del proyecto, identificadas por el hash de su contenido (SHA-1, 40 caracteres hexadecimales):

| Objeto | Qué representa |
| --- | --- |
| **blob** | El contenido de un archivo |
| **tree** | Un directorio: lista de nombres que apuntan a blobs u otros trees |
| **commit** | Un tree, sus padres, autor, fecha y mensaje |
| **tag** | Una etiqueta anotada que apunta a un objeto |

Una **rama** no es una carpeta ni una copia: es un archivo de 41 bytes (`.git/refs/heads/<nombre>`) que contiene el hash de un commit. `HEAD` es un puntero a la rama actual. Puedes comprobarlo tú mismo:

```bash
cat .git/HEAD                   # ref: refs/heads/main
cat .git/refs/heads/main        # a1b2c3... (el hash del último commit)
git cat-file -p HEAD            # muestra el commit: tree, parent, author, mensaje
git cat-file -p HEAD^{tree}     # muestra el árbol de archivos de ese commit
```

Dos consecuencias que se usan todo el tiempo:

- **Ramificar es casi gratis**: crear una rama solo escribe un archivo pequeño. Por eso conviene ramificar por cada cambio.
- **Un commit es inmutable**: el hash depende del contenido *y de sus padres*. Cambiar un commit (con `--amend` o `rebase`) produce un commit **nuevo** con otro hash. Eso explica por qué reescribir historia ya publicada causa problemas.

**En calidad de software:** el hash hace que el historial sea auditable. Si el hash coincide, el contenido es idéntico, y eso es la base de la trazabilidad.

---

## 2. Estrategias de ramificación

Una estrategia de ramas es un **acuerdo de equipo**: qué ramas existen, cuánto viven, cómo llega el trabajo a `main` y cómo se publican versiones. El factor que más pesa es **cuánto tiempo vive una rama**: mientras más tiempo, más se aleja del resto y más duelen la integración y la revisión.

### 2.1 Las tres estrategias

**GitHub Flow.** Solo existe `main` (siempre desplegable) y ramas cortas que se abren, revisan y borran. Seis pasos: crear rama, cambiar, abrir PR, atender la revisión, fusionar, borrar la rama. Sirve para equipos pequeños con despliegue continuo.

**Trunk-based development.** Todos integran en el tronco (`main`) al menos una vez al día; las ramas duran horas. El trabajo incompleto se fusiona **apagado** con un *feature flag*:

```python
def calcular_nota(alumno):
    if flags.activo("nota_ponderada_v2", alumno):
        return nota_ponderada_v2(alumno)
    return nota_final(alumno)          # camino antiguo, sigue funcionando
```

Exige CI rápido, pruebas confiables y disciplina con los flags (dueño, fecha de retiro, limpieza). Sin pruebas, integrar a diario es romper `main` a diario.

**GitFlow.** Ramas de larga vida pensadas para versiones empaquetadas:

| Rama | Sale de | Se fusiona en | Propósito |
| --- | --- | --- | --- |
| `main` | | | Código liberado, etiquetado (`v1.2.0`) |
| `develop` | `main` | | Integración de la próxima versión |
| `feature/*` | `develop` | `develop` | Una funcionalidad |
| `release/*` | `develop` | `main` y `develop` | Estabilizar y etiquetar |
| `hotfix/*` | `main` | `main` y `develop` | Corrección urgente de producción |

Conviene para software con varias versiones mantenidas en paralelo (librerías, aplicaciones móviles, firmware). Para un servicio que se despliega continuamente añade ceremonia innecesaria; su propio autor lo aclaró así en 2020 [1].

### 2.2 Ramas de desarrollo vs ramas de lanzamiento

El sílabo pide distinguirlas. Una **rama de desarrollo** vive poco y termina fusionada. Una **rama de lanzamiento** (`release/1.4`) vive tanto como se mantenga esa versión, y recibe solo correcciones (*backports*) mediante `cherry-pick -x`. Trunk-based y GitHub Flow casi no necesitan ramas de lanzamiento; GitFlow y los productos multiversión sí.

### 2.3 Cómo elegir

| Pregunta | Si la respuesta es... | Tiende a... |
| --- | --- | --- |
| ¿Desplegamos continuamente o entregamos versiones? | Continuamente | GitHub Flow / trunk-based |
| ¿Mantenemos varias versiones a la vez? | Sí | Ramas de lanzamiento |
| ¿Qué tan buenas son nuestras pruebas y CI? | Malas | No trunk-based todavía |
| ¿Cuántas personas tocan los mismos archivos? | Muchas | Ramas más cortas |

### 2.4 Higiene, sea cual sea la estrategia

- Nombres `feature/<tema>`, `fix/<tema>`, `hotfix/<tema>`: minúsculas y guiones.
- Borrar ramas fusionadas (GitHub puede hacerlo solo) y limpiar referencias remotas viejas: `git fetch --prune`.
- Traer `main` a tu rama con frecuencia.
- Proteger `main` con reglas ([sección 6](#6-pull-requests-revisión-y-reglas-del-repositorio)).

---

## 3. Historial legible: Conventional Commits y SemVer

### 3.1 Formato

```text
<tipo>[alcance opcional][!]: <descripción>

[cuerpo opcional]

[pie(s) opcional(es)]
```

Ejemplos con el proyecto de notas:

```text
feat(notas): agregar promedio de practicas
fix(notas): corregir division entera en nota_final
test(notas): cubrir el caso de nota exactamente 10.5
docs: explicar como ejecutar el laboratorio
feat(api)!: eliminar el endpoint v1
```

Reglas de estilo habituales (convenciones de la comunidad sobre la especificación [2]): descripción en imperativo ("agregar", no "agregado"), unos 50 caracteres y no más de 72, sin punto final; el cuerpo explica el *por qué*.

### 3.2 Tipos y efecto en la versión

| Tipo | Uso | Efecto SemVer |
| --- | --- | --- |
| `feat` | Funcionalidad nueva para el usuario | minor |
| `fix` | Corrección de un error | patch |
| `perf`, `refactor`, `test`, `docs`, `style`, `build`, `ci`, `chore` | Cambios que no alteran el comportamiento observable | ninguno |
| Cualquiera con `!` o pie `BREAKING CHANGE:` | Rompe compatibilidad | **major** |

La especificación solo exige `feat` y `fix`; el resto viene de la convención de Angular y es de uso común.

### 3.3 Versionado semántico (SemVer)

`MAJOR.MINOR.PATCH` [3]: se incrementa **MAJOR** al romper compatibilidad, **MINOR** al añadir funcionalidad compatible y **PATCH** al corregir errores compatibles. Las versiones `0.y.z` son de desarrollo inicial: nada es estable. Las prerrelease se marcan con sufijo (`1.0.0-rc.1`).

La conexión con lo anterior es lo importante: **si los commits siguen el formato, la versión se puede calcular** en lugar de decidirla a mano (ver [sección 8](#8-gestión-de-lanzamientos)).

### 3.4 La regla del "y"

Si el mensaje necesita una "y", son dos commits. Cada commit debe poder revertirse solo (`git revert`) sin arrastrar cambios ajenos. Para separar cambios mezclados:

```bash
git add -p                           # elegir por partes qué entra en el commit
git commit -m "feat(notas): agregar aprobado"
git add -p
git commit -m "fix(notas): usar 10.5 como nota minima"
```

### 3.5 Errores comunes

| Mal | Por qué | Mejor |
| --- | --- | --- |
| `arreglos varios` | No dice nada, no se puede automatizar | `fix(notas): redondear a dos decimales` |
| `feat: login, header y docs` | Tres cambios en uno | Tres commits |
| `wip` en `main` | Trabajo inconcluso en el historial compartido | Limpiar antes de fusionar |

### 3.6 Cómo hacerlo cumplir

Confiar en la memoria falla. Se refuerza por capas: un **hook `commit-msg`** local ([lab/hooks/commit-msg](lab/hooks/commit-msg)), una verificación del **título del PR** en CI (importante si se usa *squash*, porque el título pasa a ser el commit), y herramientas como commitlint. Para corregir un mensaje: `git commit --amend` si es el último y no se publicó; `git rebase -i` con `reword` si es anterior y no se publicó; si ya es público, no se reescribe.

---

## 4. Integrar cambios y resolver conflictos

### 4.1 Tres formas de integrar

Con el mismo punto de partida (`main` avanzó y tu rama `feature/aprobado` tiene 2 commits):

| | `merge` | `rebase` | `squash and merge` |
| --- | --- | --- | --- |
| Resultado | Commit de fusión con dos padres | Tus commits repetidos sobre la punta de `main` | Un solo commit nuevo en `main` |
| Historial | Fiel a lo ocurrido, más ramificado | Lineal | Lineal, un commit por PR |
| IDs de commit | No cambian | **Cambian** | El PR se colapsa en uno |
| Riesgo | Historial ruidoso | Reescribe: no usar en ramas compartidas | Se pierde el detalle de los commits intermedios |

GitHub ofrece las tres al fusionar un PR (*Create a merge commit*, *Squash and merge*, *Rebase and merge*), y el repositorio decide cuáles permitir. Si `main` no avanzó, `merge` puede resolverse por **avance rápido** (*fast-forward*), sin commit de fusión; `--no-ff` fuerza uno y `--ff-only` prohíbe cualquier otro caso.

### 4.2 Cuándo aparece un conflicto

Git compara cada región contra el ancestro común (*merge-base*). Si solo un lado la cambió, toma ese cambio; si **ambos** cambiaron las mismas líneas de forma distinta, no puede decidir y marca un **conflicto**. Un conflicto no es un error: es Git pidiendo que una persona decida.

```text
def aprobado(nota):
<<<<<<< HEAD
    return nota >= 10.5
=======
    return nota >= 11
>>>>>>> feature/nota-minima
```

`<<<<<<<` abre tu versión, `=======` la separa de la otra y `>>>>>>>` cierra. Estos marcadores **no son código** y hay que borrarlos. Con `git config merge.conflictStyle zdiff3` se muestra también el ancestro, lo que suele aclarar quién cambió qué.

### 4.3 Cinco pasos

1. **Decidir** cuál versión es correcta (una, otra o una combinación; preguntar al autor si hace falta).
2. **Editar** el archivo dejando solo el código final.
3. `git add <archivo>` para declarar que ya está resuelto.
4. **Terminar**: `git commit` (merge), `git rebase --continue` o `git cherry-pick --continue`.
5. **Probar** antes de publicar.

Utilidades: `git status`, `git diff --name-only --diff-filter=U` (archivos sin resolver), `git diff --check` (marcadores olvidados), `git mergetool`. Para abortar: `git merge --abort`, `git rebase --abort` o `git cherry-pick --abort`.

**El paso 5 no es opcional.** Git solo entiende texto: puede haber un conflicto resuelto con lógica equivocada, o **ningún conflicto y código roto** (una rama renombra una función y otra la llama con el nombre viejo desde otro archivo). Es un *conflicto semántico* y solo lo detectan las pruebas sobre el resultado de la fusión. Volveremos a esto con la *merge queue* en la [sección 7](#7-automatización-hooks-ci-y-merge-queue).

### 4.4 Prevención

Ramas cortas, PR pequeños, propiedad clara del código (CODEOWNERS), un solo formateador para todo el equipo, regenerar (no editar a mano) los archivos generados, y `git config rerere.enabled true` para que Git recuerde y repita una resolución ya hecha.

---

## 5. Git avanzado: investigar y recuperar

Esta es la caja de herramientas para cuando algo salió mal, y es donde el modelo de la [sección 1](#1-control-de-versiones-centralizado-vs-distribuido) se vuelve útil.

### 5.1 `reset`: tres modos

`reset` mueve la rama actual a otro commit. Lo que cambia es cuánto más se toca:

| Comando | Mueve la rama | Índice (staging) | Archivos de trabajo |
| --- | --- | --- | --- |
| `git reset --soft HEAD~1` | Sí | Se conserva | Se conservan |
| `git reset --mixed HEAD~1` (por defecto) | Sí | Se limpia | Se conservan |
| `git reset --hard HEAD~1` | Sí | Se limpia | **Se pierden los cambios sin commit** |

`git restore <archivo>` descarta cambios de un archivo y `git restore --staged <archivo>` lo saca del índice. `git switch` y `git restore` reemplazan a los usos antiguos de `git checkout`.

### 5.2 `reflog`: la red de seguridad

`git reflog` registra cada movimiento de `HEAD`, incluso los que dejaron commits "huérfanos". Tras un `reset --hard` equivocado:

```bash
git reflog                       # buscar el estado anterior: HEAD@{1}
git reset --hard 'HEAD@{1}'      # volver ahí
```

El reflog es **local** y caduca (por defecto, 90 días para lo alcanzable y 30 para lo huérfano), así que sirve para rescatar trabajo reciente, no como respaldo.

### 5.3 `bisect`: hallar la regresión con una búsqueda binaria

Cuando algo dejó de funcionar y no se sabe en qué commit, `git bisect` hace una búsqueda binaria sobre el historial. Con una prueba automatizada, la búsqueda es **automática**:

```bash
git bisect start HEAD v0.1.0        # malo = HEAD, bueno = el tag v0.1.0
git bisect run python test_notas.py # Git prueba, marca y avanza solo
git bisect reset                    # volver a la rama original
```

El comando que se le pasa debe terminar con código **0** si el commit es bueno, **125** para omitirlo y cualquier otro valor entre 1 y 127 si es malo. En 11 commits basta con 3 o 4 pruebas; en 1000 commits, unas 10. Es un ejemplo muy directo de **por qué las pruebas automatizadas valen más que solo detectar fallos**: convierten un misterio de horas en una búsqueda de minutos.

Otras herramientas de investigación:

```bash
git log -S "division entera" --oneline    # commits que añadieron o quitaron ese texto
git log --follow -p notas.py              # historial de un archivo, siguiendo renombres
git blame -L 10,20 notas.py               # quién tocó por última vez esas líneas
```

### 5.4 Mover y ordenar trabajo

| Necesidad | Herramienta |
| --- | --- |
| Copiar **un** commit a otra rama (hotfix, backport) | `git cherry-pick -x <hash>` (`-x` deja constancia del origen) |
| Guardar cambios a medias para cambiar de tarea | `git stash push -u -m "wip: aprobado"` y luego `git stash pop` |
| Trabajar en dos ramas a la vez sin clonar de nuevo | `git worktree add ../hotfix-nota -b hotfix/nota main` |
| Ordenar mis commits antes del PR | `git rebase -i main` (`reword`, `squash`, `fixup`, `edit`, `drop`) |
| Corregir un commit anterior sin reescribirlo a mano | `git commit --fixup <hash>` y luego `git rebase -i --autosquash main` |
| Deshacer algo **ya publicado** | `git revert <hash>` (crea un commit inverso, no reescribe) |
| Actualizar mi rama ya publicada tras un rebase | `git push --force-with-lease` (nunca `--force` a secas) |

**Regla que resume la sección:** lo que ya está compartido se **corrige con commits nuevos** (`revert`); lo que solo tú tienes se puede **reescribir** (`amend`, `rebase`, `reset`).

Para deshacer la fusión de un merge ya publicado hace falta indicar qué padre conservar: `git revert -m 1 <hash-del-merge>`.

---

## 6. Pull requests, revisión y reglas del repositorio

### 6.1 El PR como puerta de calidad

Un PR es el paso entre tu rama y `main`. Ahí se cumplen dos controles y ambos hacen falta:

| Revisión humana | Verificación automática (CI) |
| --- | --- |
| Entiende el cambio y sus riesgos | Compila, prueba y analiza en cada push |
| Ve decisiones de diseño y código correcto que resuelve el problema equivocado | Ve regresiones y comportamiento real, siempre y sin cansarse |

Un PR queda registrado con qué cambió, quién lo revisó y qué comprobaciones pasaron: eso es **trazabilidad**. Y como el costo de un defecto crece con el tiempo que pasa sin detectarse, conviene atraparlo aquí, antes de fusionar.

### 6.2 Un buen PR

Pequeño (la evidencia sugiere revisar del orden de 200 a 400 líneas por vez [5]), con un solo propósito, con contexto (qué, por qué, cómo se probó) y autorrevisado. Plantilla sugerida (`.github/pull_request_template.md`):

```markdown
## Resumen
¿Qué cambia y qué problema evita?

## Cómo se probó
- [ ] Prueba automatizada añadida o actualizada
- [ ] Verificación manual: ...

## Relacionado
Closes #
```

Abrir el PR como borrador (*draft*) desde temprano; usar `Closes #12` para cerrar el issue al fusionar; y titularlo como Conventional Commit.

### 6.3 Revisar bien

**Bloquean** un merge: comportamiento distinto de lo prometido, casos límite sin cubrir, riesgos de seguridad o de datos, y contratos de API rotos. **No** deberían bloquearlo: formato que ya cubre el linter, refactors ajenos al PR y optimizaciones sin evidencia.

Comentarios útiles: específicos, con el *por qué*, y marcados según su peso (`nit:`, `pregunta:`, `bloqueante:`). Usar las *sugerencias* de GitHub para correcciones pequeñas. Aprobar sin leer convierte la protección de ramas en un ritual vacío.

### 6.4 Reglas del repositorio (*rulesets*)

Una regla declarada en el repositorio que GitHub aplica a cada PR: se define una vez y se cumple siempre. En *Settings → Rules → Rulesets* se configuran:

- **Estado**: activa, o desactivada.
- **Ramas objetivo**: todas, o solo la predeterminada.
- **Lista de excepciones** (*bypass*): quién puede saltarse la regla; vacía significa que nadie.

Base razonable para un repositorio de curso:

- Exigir PR antes de fusionar, con **1 aprobación** como mínimo.
- Descartar aprobaciones antiguas cuando llegan commits nuevos.
- Exigir **revisión de los dueños** (CODEOWNERS).
- Exigir resolver todas las conversaciones.
- Exigir **checks de estado** obligatorios (solo se pueden elegir los que ya se ejecutaron recientemente en el repositorio).
- Bloquear los *force push* y, si se quiere, exigir historial lineal y commits firmados.

GitHub tiene además las *branch protection rules*, más antiguas y con opciones parecidas; los rulesets son el mecanismo más nuevo y flexible.

### 6.5 CODEOWNERS

Quién debe revisar qué. Un archivo versionado (`.github/CODEOWNERS`) con líneas `patrón  @dueño`:

```text
# .github/CODEOWNERS
*                        @mi-org/equipo
/docs/                   @mi-org/documentacion
/src/notas/              @usuario-a @mi-org/calidad
*.sql                    @mi-org/datos
```

La **última coincidencia gana**, así que las reglas generales van primero y las específicas después. Los dueños necesitan permiso de escritura, y GitHub lee el archivo de la rama base del PR. Junto con la regla *Requerir revisión de los dueños*, esa aprobación se vuelve obligatoria. Evitar un dueño global demasiado grande: inunda de solicitudes y anula el sentido.

### 6.6 PR apilados (*stacked PRs*)

Cuando un cambio grande tiene partes que dependen unas de otras, se dividen en PR encadenados que se revisan por separado y se fusionan de abajo hacia arriba (por ejemplo: esquema de datos, luego lógica, luego interfaz). Con Git a mano:

```bash
git switch -c feature/esquema main
git switch -c feature/logica feature/esquema     # capa 2 parte de la capa 1
# tras fusionar la capa 1, mover la capa 2 sobre main:
git rebase --onto main feature/esquema feature/logica
git push --force-with-lease
```

Usarlo solo cuando la dependencia es real; si los cambios son independientes, PR separados contra `main` son más simples.

---

## 7. Automatización: hooks, CI y merge queue

Las reglas que dependen de que todos las recuerden, se rompen. Hay que automatizarlas en tres niveles, cada uno más lejos del teclado y más difícil de saltar:

| Nivel | Herramienta | Se puede saltar |
| --- | --- | --- |
| 1. Local | Hooks de Git (`pre-commit`, `commit-msg`) | Sí: `git commit --no-verify` |
| 2. Remoto | CI en cada PR (GitHub Actions) | No, si el check es **obligatorio** |
| 3. Fusión | *Merge queue* y *auto-merge* | No |

### 7.1 Hooks locales

Son scripts en `.git/hooks/`, que **no se versionan**. Para compartirlos con el equipo se guardan en una carpeta del repositorio y se activan con:

```bash
git config core.hooksPath Module02/lab/hooks
```

`pre-commit` corre antes de crear el commit (pruebas rápidas, formateo, buscar secretos) y `commit-msg` valida el mensaje. En este módulo se incluye un [hook `commit-msg`](lab/hooks/commit-msg) que rechaza mensajes fuera de Conventional Commits. Como los hooks son saltables, funcionan como **ayuda inmediata** y no como garantía: **la garantía es el CI**.

### 7.2 CI como fuente de verdad

Un flujo mínimo que ejecuta las pruebas en cada PR (`.github/workflows/ci.yml`):

```yaml
name: ci
on:
  pull_request:
  merge_group:          # necesario para que la merge queue lo ejecute
jobs:
  pruebas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: python test_notas.py
```

Para que esto sea una **puerta**, el check `pruebas` debe marcarse como *obligatorio* en el ruleset: uno que no lo es informa pero no impide fusionar. Y hay que arreglar las pruebas inestables (*flaky*): si el rojo no significa "roto", el equipo aprende a ignorarlo. El detalle de pipelines y despliegue continuo se profundiza en el módulo 05; aquí interesa el punto de contacto con Git.

### 7.3 Merge queue y auto-merge

El problema de los conflictos semánticos ([sección 4.3](#43-cinco-pasos)): dos PR pueden pasar el CI **por separado** y romper `main` **juntos**. La **merge queue** lo evita: en lugar de fusionar directamente, GitHub encola el PR, construye una rama temporal con el PR **más todo lo que estaba antes en la cola**, ejecuta el CI sobre ese resultado y solo entonces fusiona. Por eso el flujo necesita el evento `merge_group`.

**Auto-merge** hace que un PR con checks obligatorios se fusione solo cuando todo esté en verde, sin quedarse esperando el botón.

> Disponibilidad: la merge queue no existe en repositorios de cuentas personales y depende del plan de la organización. Verificar en la documentación vigente antes de prometerla en una demostración.

---

## 8. Gestión de lanzamientos

El sílabo pide describir cómo el control de versiones ayuda a gestionar lanzamientos. Ingredientes:

### 8.1 Etiquetas (*tags*)

Una etiqueta **anotada** marca un commit como versión, con autor, fecha y mensaje:

```bash
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin v1.2.0               # git push a secas NO envía los tags
git show v1.2.0
```

Las etiquetas *ligeras* (`git tag v1.2.0`) son solo un puntero; para versiones se prefieren las anotadas.

### 8.2 Releases de GitHub

Una *release* pone notas y archivos descargables sobre un tag:

```bash
gh release create v1.2.0 --generate-notes
```

`--generate-notes` arma las notas con los PR fusionados desde la versión anterior.

### 8.3 Del historial a la versión: automatizar

Si los commits siguen Conventional Commits ([sección 3](#3-historial-legible-conventional-commits-y-semver)), una herramienta puede leer el historial desde el último tag y decidir la versión:

| Desde el último tag hay... | Sube |
| --- | --- |
| Algún commit con `!` o `BREAKING CHANGE` | MAJOR |
| Algún `feat` (y nada roto) | MINOR |
| Solo `fix` | PATCH |

**release-please** (y alternativas como `semantic-release` o `git-cliff`) abre un PR de "release" con el siguiente número de versión y el `CHANGELOG`; fusionar ese PR crea el tag y la release. Es el mismo flujo revisado de siempre, aplicado a la publicación.

### 8.4 Correcciones sobre versiones ya publicadas

Cuando se mantiene `release/1.4` y aparece un error en `main`: se corrige primero en `main`, luego `git cherry-pick -x <hash>` a la rama de lanzamiento y se etiqueta `v1.4.1`. Corregir primero en `main` evita que el error reaparezca en la siguiente versión.

---

## 9. Cadena de suministro y seguridad del repositorio

Un repositorio no solo contiene tu código: también depende del de otros y guarda secretos por accidente. Tres controles, todos configurables desde GitHub:

| Riesgo | Control | Cómo |
| --- | --- | --- |
| Dependencia con vulnerabilidad conocida | **Dependabot** (alertas y PR de actualización) y la acción `dependency-review` para bloquear PR que la introduzcan | `.github/dependabot.yml` |
| Credenciales subidas por error | **Secret scanning** y *push protection*, que rechaza el push antes de publicarse | Ajustes de seguridad del repositorio |
| Commits falsificados a nombre de otra persona | **Commits firmados** (GPG o SSH), con la insignia *Verified* y regla opcional para exigirlos | `git config commit.gpgsign true` |

Ejemplo mínimo de Dependabot:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

Un secreto publicado se considera **comprometido aunque se borre**: queda en el historial y en los clones. La respuesta correcta es *revocar y rotar* la credencial, no solo eliminar el commit. Este tema se profundiza en el módulo 07 (calidad en producción y seguridad).

---

## 10. Laboratorio

El script [`lab/crear-laboratorio.sh`](lab/crear-laboratorio.sh) crea un repositorio de práctica con **12 commits** que siguen Conventional Commits. Uno de ellos (`perf(notas): usar division entera en nota_final`) introduce una regresión silenciosa: `nota_final(13, 14, 16)` devuelve `14` en lugar de `14.33`. Existe un tag `v0.1.0` como último punto bueno conocido.

Requiere Git y Python 3. En Windows se ejecuta desde Git Bash.

```bash
bash Module02/lab/crear-laboratorio.sh laboratorio-notas
cd laboratorio-notas
```

Para la versión en inglés (código, commits y mensajes en inglés; el directorio por defecto pasa a ser `grades-lab` y la prueba a `test_grades.py`):

```bash
bash Module02/lab/crear-laboratorio.sh --lang en
```

**Parte 1: encontrar la regresión con `bisect`.**

```bash
python test_notas.py                     # falla
git bisect start HEAD v0.1.0
git bisect run python test_notas.py      # imprime: "first bad commit"
git bisect reset
```

**Parte 2: un accidente y su rescate con `reflog`.**

```bash
git reset --hard HEAD~5                  # "accidente": se pierden 5 commits
git reflog                               # ahí siguen, con su HEAD@{n}
git reset --hard 'HEAD@{1}'              # recuperados
```

**Parte 3: corregir sin reescribir historia con `revert`.**

```bash
git revert --no-edit <hash-del-commit-malo>
python test_notas.py                     # ahora pasa
```

**Parte 4 (opcional): imponer el formato de commit con el hook.**

```bash
mkdir .githooks
cp ../Module02/lab/hooks/commit-msg .githooks/          # ajusta la ruta según dónde creaste el laboratorio
chmod +x .githooks/commit-msg
git config core.hooksPath .githooks
git commit --allow-empty -m "arreglos varios"          # rechazado
git commit --allow-empty -m "docs: probar el hook"     # aceptado
git commit --allow-empty --no-verify -m "wip"          # se salta el hook: por eso existe el CI
```

El laboratorio se verificó de punta a punta, en español y en inglés, con Git 2.46: `bisect` halla el commit malo en 3 pasos, `reflog` recupera los 5 commits y `revert` restaura la prueba en verde. El hook muestra sus mensajes en inglés con `LAB_LANG=en`.

---

## 11. Lista de verificación para un repositorio de equipo

- [ ] `main` protegido con un ruleset: PR obligatorio, al menos 1 aprobación, sin *force push*.
- [ ] Lista de excepciones (*bypass*) vacía.
- [ ] Archivo `CODEOWNERS` y regla de revisión de dueños activada.
- [ ] Checks de CI **obligatorios**, no solo informativos.
- [ ] Plantilla de PR y nombres de rama acordados.
- [ ] Conventional Commits, verificado por hook local **y** por CI.
- [ ] Ramas borradas automáticamente al fusionar.
- [ ] Método de fusión acordado (merge, squash o rebase).
- [ ] Releases con tags anotados y `CHANGELOG` generado.
- [ ] Dependabot, secret scanning y push protection activados.
- [ ] Todos saben recuperar: `reflog`, `revert`, `bisect`.

---

## Referencias

1. Driessen, V. (2010, actualizado 2020). *A successful Git branching model*. https://nvie.com/posts/a-successful-git-branching-model/
2. Conventional Commits. *Conventional Commits 1.0.0*. https://www.conventionalcommits.org/es/v1.0.0/
3. Preston-Werner, T. *Semantic Versioning 2.0.0*. https://semver.org/lang/es/
4. Forsgren, N., Humble, J. y Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps*. IT Revolution Press.
5. Cohen, J. (2006). *Best Kept Secrets of Peer Code Review*. SmartBear Software.
6. Kim, G. et al. (2021). *The DevOps Handbook* (2.ª ed.). IT Revolution Press. (Lectura del sílabo, Unidad 2.)
7. Chacon, S. y Straub, B. (2014). *Pro Git* (2.ª ed.). Apress. https://git-scm.com/book/es/v2
8. Git. *Documentación de referencia*: [git-bisect](https://git-scm.com/docs/git-bisect), [git-reflog](https://git-scm.com/docs/git-reflog), [git-reset](https://git-scm.com/docs/git-reset), [git-rebase](https://git-scm.com/docs/git-rebase), [git-worktree](https://git-scm.com/docs/git-worktree), [githooks](https://git-scm.com/docs/githooks).
9. GitHub. *GitHub Docs*: [GitHub flow](https://docs.github.com/es/get-started/using-github/github-flow), [Rulesets](https://docs.github.com/es/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [CODEOWNERS](https://docs.github.com/es/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [Merge queue](https://docs.github.com/es/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue), [Dependabot](https://docs.github.com/es/code-security/dependabot), [Releases](https://docs.github.com/es/repositories/releasing-projects-on-github/about-releases).
10. Cuadros-Vargas, E. *Software Quality* (material del curso). https://ecuadros.github.io/SoftwareQuality/
