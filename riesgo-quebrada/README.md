# riesgo-quebrada

En plena Alerta de El Niño 2026–2027, las plataformas existentes informan por región o provincia: nadie sabe a tiempo si **su casa** está en riesgo.
riesgo-quebrada responde a una persona **"¿mi casa está en riesgo y qué hago?"** cruzando su distrito con los avisos oficiales de lluvia.

## Estructura

| Carpeta | Qué es |
|---|---|
| `riesgo/` | Servicio de riesgo (Spring Boot, MongoDB), puerto 8082 |
| `ingesta/` | Avisos de lluvia desde un JSON grabado de CENEPRED (sin red), puerto 8081 |
| `pacts/` | Contrato riesgo → ingesta: riesgo lo escribe, ingesta lo verifica |
| `e2e/` | Prueba E2E del sistema completo: riesgo, ingesta y MongoDB reales en contenedores |
| `pom.xml` | Chasis: versiones, health check, cobertura y Java 21, compartidos por todos los servicios |

## Compilar y probar

Requiere JDK 21, Maven 3.9+ y Docker (MongoDB y pruebas de integración).

```bash
mvn verify    # riesgo (unitarias, integración, BDD, escribe pacts/) → ingesta (verifica el contrato) → e2e
```

## Fecha fija para demos

Se eligió una fecha fija real del CENEPRED (2026-10-08). Para una demo después de esa
fecha, arranca riesgo con `RIESGO_RELOJ`, sin esa variable usa la hora real.

## API

| Método | Ruta | Qué hace |
|---|---|---|
| `POST` | `/usuarios` | Crea un usuario: `{"nombre": "Ana"}` |
| `POST` | `/usuarios/{id}/lugares` | Registra un lugar: `{"nombre","tipo","ubigeo","latitud","longitud"}` |
| `GET` | `/usuarios/{id}/lugares` | Lista los lugares del usuario |
| `GET` | `/usuarios/{id}/lugares/{lugarId}/riesgo` | Nivel de riesgo, avisos que lo causan y plan de acción |
| `GET` | `/avisos?ubigeo=` | (ingesta) Avisos que afectan a un distrito |

Validaciones: ubigeo de 6 dígitos y coordenadas dentro del Perú (400 si no se cumplen).
Niveles: `BAJO`, `MEDIO`, `ALTO`, `MUY_ALTO`. Un aviso que ya terminó no cuenta; uno que aún no empieza sí, para prepararse.
