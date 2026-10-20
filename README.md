# 2026-II-CS-UNI-SoftwareQuality

- [Video de referencia:](https://www.linkedin.com/posts/carlosfloreslopez_excelente-exposici%C3%B3n-que-todo-especialista-activity-7184935465374879744-MAFX?utm_source=share&utm_medium=member_android)

- [Página de material del curso:](https://ecuadros.github.io/SoftwareQuality/)

## Módulo 1 — Fundamentos de Calidad y Costo de la No-Calidad

En este módulo se establecen las primeras prácticas de calidad que se utilizarán durante el desarrollo del curso.

El objetivo de esta configuración inicial es establecer convenciones comunes, mejorar la trazabilidad de los cambios y preparar el repositorio para que los cambios puedan ser revisados antes de ser integrados.

La configuración implementada sigue el laboratorio oficial del curso:

> **Setup del Repo en GitHub — Módulo 1**

Fuente principal:

* [Material del curso — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)

La estructura incorporada es:

```text id="dtzlkq"
.
├── README.md
├── .editorconfig
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── bug_report.md
    └── pull_request_template.md
```

Además, se utilizan **Issues de GitHub** para registrar problemas, tareas y deuda técnica.

---

### 1. Issues de GitHub

Un **Issue** permite registrar y hacer seguimiento de trabajo relacionado con un proyecto.

Dentro del contexto de este módulo puede utilizarse para registrar:

* Bugs.
* Mejoras.
* Tareas pendientes.
* Decisiones técnicas.
* Deuda técnica.

Esto permite que los problemas y decisiones pendientes queden visibles y puedan ser discutidos, asignados y posteriormente resueltos.

#### Issues y deuda técnica

El laboratorio solicita mantener al menos un Issue etiquetado como deuda técnica.

La finalidad es hacer visible una decisión técnica que tendrá un costo o trabajo futuro asociado.

En lugar de dejar una decisión únicamente como un comentario dentro del código o depender de que un integrante la recuerde, puede registrarse mediante un Issue indicando:

* qué decisión se tomó;
* por qué se tomó;
* qué limitación genera;
* cuál podría ser su impacto;
* y cuándo debería revisarse.

Esto permite que la deuda técnica sea **visible y trazable**.

#### Fuente

* [Material del curso — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)
* [GitHub Docs — About Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues)

---

### 2. Plantilla para reportar Bugs

El laboratorio solicita crear:

```text id="7vzmgq"
.github/ISSUE_TEMPLATE/bug_report.md
```

El contenido utilizado es el indicado en el material del curso:

```markdown id="k8ly6v"
---
name: Reporte de bug
about: Algo no funciona como debería
labels: bug
---

**Comportamiento esperado**

**Comportamiento actual**

**Pasos para reproducir**
1.
2.

**Entorno** (SO, versión de Python/C++/Flutter, commit)
```

#### ¿Para qué sirve?

Esta plantilla proporciona una estructura común para reportar errores.

En lugar de crear un Issue poco descriptivo como:

```text id="ekzxdm"
No funciona.
```

se solicita información que ayude a comprender y reproducir el problema.

La plantilla solicita cuatro elementos principales.

**Comportamiento esperado**

Describe qué debería haber ocurrido.

**Comportamiento actual**

Describe qué ocurrió realmente.

**Pasos para reproducir**

Permite indicar la secuencia necesaria para volver a producir el problema.

**Entorno**

Permite registrar información relevante como:

```text id="h6vy1x"
Sistema operativo
Versión de Python / C++ / Flutter
Commit
```

Esta información puede ser importante porque un mismo error puede depender del entorno o de una versión determinada del proyecto.

---

#### ¿Qué significa la parte inicial del archivo?

El archivo comienza con:

```yaml id="q4cniz"
---
name: Reporte de bug
about: Algo no funciona como debería
labels: bug
---
```

Esta sección contiene metadatos utilizados por GitHub para describir la plantilla.

`name` establece el nombre de la plantilla:

```yaml id="r6x0s8"
name: Reporte de bug
```

`about` proporciona una descripción breve:

```yaml id="i4dzkw"
about: Algo no funciona como debería
```

`labels` indica la etiqueta que se asociará al reporte:

```yaml id="rb4vpl"
labels: bug
```

---

#### ¿Por qué se guarda en `.github/ISSUE_TEMPLATE/`?

GitHub utiliza el directorio:

```text id="yt77hd"
.github/ISSUE_TEMPLATE/
```

como una de las ubicaciones destinadas a las plantillas de Issues.

De esta forma, la configuración también queda almacenada y versionada junto con el proyecto.

#### Fuentes

* [Material del curso — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)
* [GitHub Docs — Configuring Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

---

### 3. Plantilla para Pull Requests

El laboratorio también solicita crear:

```text id="a0r3s1"
.github/pull_request_template.md
```

Se utiliza el template proporcionado por el curso:

```markdown id="jowu37"
## Qué cambia y por qué

## Cómo se probó
- [ ] Tests unitarios agregados/actualizados
- [ ] Probado manualmente localmente

## Checklist
- [ ] El código sigue las convenciones del proyecto
- [ ] No quedan `TODO` sin issue asociado
- [ ] La descripción del PR es suficiente para revisar sin contexto adicional
```

---

#### ¿Para qué sirve?

Un **Pull Request (PR)** permite proponer cambios realizados en una rama para que puedan ser revisados antes de integrarlos en otra.

La plantilla establece la información mínima que debe proporcionar quien crea el Pull Request.

##### `Qué cambia y por qué`

```markdown id="3jv49p"
## Qué cambia y por qué
```

Permite explicar:

* qué se modificó;
* por qué fue necesario modificarlo.

Esto proporciona contexto a la persona encargada de revisar los cambios.

##### `Cómo se probó`

```markdown id="ffkq8l"
## Cómo se probó
- [ ] Tests unitarios agregados/actualizados
- [ ] Probado manualmente localmente
```

Permite indicar cómo fueron verificados los cambios.

Los elementos:

```text id="h0r2c6"
[ ]
```

funcionan como casillas de verificación de Markdown.

Cuando una condición se cumple puede marcarse como:

```text id="d1fl1f"
[x]
```

##### Checklist

Finalmente, el template solicita comprobar:

```markdown id="vyujm4"
- [ ] El código sigue las convenciones del proyecto
- [ ] No quedan `TODO` sin issue asociado
- [ ] La descripción del PR es suficiente para revisar sin contexto adicional
```

Esto funciona como una revisión previa antes de solicitar que los cambios sean integrados.

---

### 4. Flujo de trabajo utilizado por el Grupo 1 — Módulo 1

El material del laboratorio explica el uso de Pull Requests y protección de ramas utilizando un repositorio individual.

En el repositorio utilizado durante las clases, el profesor proporcionó la rama correspondiente al trabajo de nuestro grupo para este módulo.

Para el **Módulo 1 del Grupo 1**, la rama de trabajo utilizada es:

```text
G1-M1
```

Debido a que no se cuenta con permisos de escritura directa sobre el repositorio original, se creó un **Fork** del repositorio del profesor.

El repositorio original es:

```text
ecuadros/2026-II-CS-UNI-SoftwareQuality-Code
```

El Fork utilizado para realizar nuestro trabajo es:

```text
KevinPV11/2026-II-CS-UNI-SoftwareQuality-Code
```

Por lo tanto, nuestro flujo comienza con:

```text
Repositorio original
ecuadros/2026-II-CS-UNI-SoftwareQuality-Code
        │
        │ Fork
        ▼
Fork del grupo
KevinPV11/2026-II-CS-UNI-SoftwareQuality-Code
```

Dentro del Fork se utiliza la misma rama asignada para el módulo:

```text
G1-M1
```

En el repositorio local también se trabaja directamente sobre esta rama.

Los cambios realizados se registran mediante commits y posteriormente se envían al Fork:

```text
G1-M1 local
      │
      │ commits
      │ push
      ▼
KevinPV11:G1-M1
```

Una vez que los cambios se encuentran en el Fork, se puede crear un Pull Request hacia la rama `G1-M1` del repositorio original:

```text
KevinPV11:G1-M1
        │
        │ Pull Request
        ▼
ecuadros:G1-M1
```

Por lo tanto, el flujo utilizado por nuestro grupo para este módulo es:

```text
Trabajo del Módulo 1
        │
        ▼
G1-M1 local
        │
        │ commits
        │ push
        ▼
Fork del grupo
KevinPV11:G1-M1
        │
        │ Pull Request
        ▼
Repositorio original
ecuadros:G1-M1
        │
        ▼
Revisión de los cambios
```

Para distinguir el Fork del repositorio original se configuraron dos remotos de Git:

```text
origin   = Fork utilizado por el grupo
upstream = Repositorio original del profesor
```

En nuestra configuración:

```text
origin
  │
  ▼
git@github.com:KevinPV11/2026-II-CS-UNI-SoftwareQuality-Code.git

upstream
  │
  ▼
https://github.com/ecuadros/2026-II-CS-UNI-SoftwareQuality-Code.git
```

`origin` se utiliza para subir los cambios realizados en nuestra rama:

```bash
git push origin G1-M1
```

Mientras que `upstream` permite obtener y consultar los cambios existentes en el repositorio original:

```bash
git fetch upstream
```

Esto permite mantener identificado el repositorio oficial del curso y, al mismo tiempo, trabajar sobre una copia en la que sí es posible realizar `push`.

Por tanto:

```text
G1-M1          = rama utilizada por nuestro grupo en el Módulo 1
origin/G1-M1   = rama G1-M1 de nuestro Fork
upstream/G1-M1 = rama G1-M1 del repositorio original
```

Esta descripción se limita al flujo utilizado por nuestro grupo para desarrollar y proponer los cambios correspondientes al Módulo 1.

---

### 5. ¿Por qué utilizar Pull Requests?

El objetivo es evitar incorporar cambios al repositorio original sin una instancia previa de revisión.

En nuestro caso, debido al uso del Fork, el flujo es:

```text
G1-M1 local
  │
  ├── desarrollo
  ├── documentación
  ├── configuración
  └── commits
        │
        │ push
        ▼
KevinPV11:G1-M1
        │
        │ Pull Request
        ▼
ecuadros:G1-M1
        │
        ▼
     revisión
```

El Fork permite realizar cambios y `push` sobre una copia del repositorio sin necesitar permisos de escritura directa sobre el repositorio original.

El Pull Request crea el punto en el flujo donde los cambios realizados por nuestro grupo pueden ser explicados y revisados antes de incorporarse a `G1-M1` del repositorio original.

#### ¿Por qué `.github/pull_request_template.md`?

GitHub permite utilizar un archivo denominado:

```text
pull_request_template.md
```

para proporcionar automáticamente contenido inicial al crear un Pull Request.

`.github/` es una de las ubicaciones soportadas para esta plantilla.

#### Fuentes

* [Material del curso — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)
* [GitHub Docs — About Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
* [GitHub Docs — Creating a Pull Request Template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)

---

### 6. EditorConfig

En la raíz del repositorio se utiliza:

```text id="9t8ujp"
.editorconfig
```

La configuración corresponde a la proporcionada en el laboratorio del curso:

```ini id="6e92mg"
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 4

[*.{yml,yaml,json}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

EditorConfig permite establecer convenciones de formato que pueden ser interpretadas por diferentes editores e IDEs.

Su objetivo es reducir diferencias de formato entre los integrantes del proyecto.

---

### 7. Explicación de `.editorconfig`

#### `root = true`

```ini id="36r49k"
root = true
```

Indica que este archivo representa la raíz de la configuración EditorConfig.

EditorConfig puede buscar configuraciones `.editorconfig` en directorios superiores. `root = true` indica que la búsqueda debe detenerse en este archivo.

---

#### `[*]`

```ini id="cfq3w6"
[*]
```

El `*` representa de forma general los archivos sobre los cuales se aplicarán las propiedades de esta sección.

Por tanto, las siguientes reglas funcionan como configuración general del proyecto.

---

#### `charset = utf-8`

```ini id="7jizt5"
charset = utf-8
```

Establece **UTF-8** como codificación.

Esto permite establecer una codificación consistente para los archivos independientemente del entorno utilizado por cada integrante.

---

#### `end_of_line = lf`

```ini id="b7kzjz"
end_of_line = lf
```

Establece **LF (Line Feed)** como convención para los finales de línea.

Los sistemas operativos pueden utilizar diferentes convenciones para representar los saltos de línea. Establecer `LF` ayuda a mantener una representación consistente dentro del repositorio.

---

#### `insert_final_newline = true`

```ini id="ue2qmx"
insert_final_newline = true
```

Indica que debe existir una nueva línea al final de los archivos.

Esto mantiene una convención consistente para los archivos de texto.

---

#### `trim_trailing_whitespace = true`

```ini id="b7o86k"
trim_trailing_whitespace = true
```

Indica que deben eliminarse espacios innecesarios existentes al final de las líneas.

Esto ayuda a evitar diferencias de formato que no representan cambios reales en el contenido.

---

#### `indent_style = space`

```ini id="22z8gn"
indent_style = space
```

Establece que la indentación general del proyecto utilizará **espacios**.

La finalidad es evitar que diferentes integrantes mezclen tabulaciones y espacios.

---

#### `indent_size = 4`

```ini id="1mvjsa"
indent_size = 4
```

La configuración general proporcionada por el curso establece una indentación de **4 espacios**.

Por tanto:

```text id="9wcs93"
Archivos generales
       ↓
indent_style = space
indent_size = 4
```

---

### 8. Configuración especial para YAML, YML y JSON

El archivo contiene una regla más específica:

```ini id="ttmvaf"
[*.{yml,yaml,json}]
indent_size = 2
```

Esta regla afecta a:

```text id="u61mbf"
*.yml
*.yaml
*.json
```

Para estos archivos se cambia únicamente el tamaño de indentación a:

```text id="y9ep89"
2 espacios
```

Las demás propiedades generales continúan aplicándose.

Por ejemplo:

```text id="iy3v5e"
Archivo Python, Java, etc.
        ↓
4 espacios

Archivo .yml
        ↓
2 espacios

Archivo .yaml
        ↓
2 espacios

Archivo .json
        ↓
2 espacios
```

Esta excepción forma parte de la configuración proporcionada por el laboratorio.

---

### 9. Configuración especial para Markdown

También se define:

```ini id="ipdy1f"
[*.md]
trim_trailing_whitespace = false
```

La configuración general establece:

```ini id="cawub3"
trim_trailing_whitespace = true
```

pero para los archivos Markdown (`.md`) se cambia a:

```ini id="6dfqz0"
trim_trailing_whitespace = false
```

Esto significa que en Markdown no se eliminarán automáticamente todos los espacios ubicados al final de las líneas.

Markdown puede utilizar espacios finales en determinados casos para representar saltos de línea, por lo que esta excepción evita eliminarlos automáticamente.

---

### 10. ¿De dónde proviene esta configuración?

La configuración concreta utilizada en este repositorio proviene del laboratorio:

**Setup del Repo en GitHub — Módulo 1**

del material oficial del curso.

Por tanto, valores concretos como:

```text id="dnb59m"
indentación general       → 4 espacios
YAML / YML / JSON         → 2 espacios
finales de línea          → LF
codificación              → UTF-8
indentación               → espacios
```

se mantienen de acuerdo con la configuración proporcionada para el laboratorio.

Las propiedades utilizadas (`charset`, `end_of_line`, `indent_style`, `indent_size`, etc.) forman parte del estándar EditorConfig.

#### Fuentes

* [Material del curso — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)
* [EditorConfig — Sitio oficial](https://editorconfig.org/)
* [EditorConfig Specification](https://spec.editorconfig.org/)

---

### 11. EditorConfig y los entornos de desarrollo

La existencia de `.editorconfig` no significa necesariamente que todos los integrantes tengan que instalar una extensión.

Esto depende del editor o IDE utilizado.

Algunos entornos incorporan soporte para EditorConfig directamente o mediante componentes incluidos con el propio IDE. Otros pueden requerir un plugin o extensión.

Por ello, antes de instalar una extensión debe comprobarse el soporte del entorno utilizado.

#### IntelliJ IDEA y otros IDEs de JetBrains

IntelliJ IDEA dispone de soporte para EditorConfig mediante un plugin incluido con el IDE y habilitado por defecto.

Por ello, en una instalación habitual de IntelliJ IDEA no es necesario buscar e instalar manualmente una extensión externa únicamente para interpretar `.editorconfig`.

Fuente:

* [JetBrains — EditorConfig](https://www.jetbrains.com/help/idea/editorconfig.html)

#### Visual Studio Code

El soporte efectivo puede depender del lenguaje y de las extensiones utilizadas.

Por ello, debe comprobarse si las propiedades necesarias del archivo `.editorconfig` están siendo interpretadas en el entorno concreto antes de instalar herramientas adicionales.

#### Otros editores

El proyecto oficial de EditorConfig mantiene información sobre los editores que incorporan soporte y aquellos que disponen de plugins.

Fuentes:

* [EditorConfig — Pre-installed](https://editorconfig.org/#pre-installed)
* [EditorConfig — Download a Plugin](https://editorconfig.org/#download)

---

### 12. Relación con la calidad de software

Ninguno de estos archivos garantiza por sí solo que el software esté libre de errores.

Su función es establecer prácticas y controles desde las primeras etapas del desarrollo.

```text
.editorconfig
      │
      ▼
Consistencia de formato

bug_report.md
      │
      ▼
Reportes de errores estructurados

pull_request_template.md
      │
      ▼
Cambios mejor documentados

Issues de deuda técnica
      │
      ▼
Deuda visible y trazable

G1-M1 local
      │
      │ push
      ▼
KevinPV11:G1-M1
      │
      │ Pull Request
      ▼
ecuadros:G1-M1
      │
      ▼
Revisión antes de integración
```

El uso del Fork permite mantener separado nuestro espacio de trabajo del repositorio original y proponer los cambios mediante un Pull Request.

Estas prácticas proporcionan una base sobre la cual posteriormente pueden incorporarse otros mecanismos de calidad, como pruebas automatizadas, integración continua y análisis estático.

---

### 13. Checklist del laboratorio

De acuerdo con el laboratorio del Módulo 1 y con el flujo utilizado por nuestro grupo, los principales elementos a verificar son:

```text
[ ] Fork del repositorio original creado
[ ] Rama G1-M1 disponible en el Fork
[ ] origin configurado hacia el Fork
[ ] upstream configurado hacia el repositorio original
[ ] Trabajo realizado sobre G1-M1
[ ] Cambios enviados al Fork mediante push
[ ] Flujo mediante Pull Request hacia ecuadros:G1-M1
[ ] Templates de Issue y PR en .github/
[ ] .editorconfig en la raíz
[ ] Al menos un Issue identificado como deuda técnica
```

En el repositorio utilizado para las clases, las configuraciones que requieren permisos administrativos dependen de los permisos proporcionados por el propietario o administrador del repositorio.

Nuestro flujo para este módulo es:

```text
G1-M1 local
    │
    │ push
    ▼
KevinPV11:G1-M1
    │
    │ Pull Request
    ▼
ecuadros:G1-M1
```

Este es el alcance del flujo documentado para el trabajo realizado por nuestro grupo en el Módulo 1.

---

## Referencias

1. [Software Quality — Material del curso](https://ecuadros.github.io/SoftwareQuality/)
2. [Módulo 1 — Setup del Repo en GitHub](https://ecuadros.github.io/SoftwareQuality/modulo-01-fundamentos-calidad/setup-repo-github.html)
3. [GitHub Docs — About Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues)
4. [GitHub Docs — Configuring Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
5. [GitHub Docs — About Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
6. [GitHub Docs — Creating a Pull Request Template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
7. [EditorConfig — Sitio oficial](https://editorconfig.org/)
8. [EditorConfig Specification](https://spec.editorconfig.org/)
9. [JetBrains — EditorConfig](https://www.jetbrains.com/help/idea/editorconfig.html)
