# riesgo-quebrada

En plena Alerta de El Niño 2026–2027, las plataformas existentes informan por región o provincia: nadie sabe a tiempo si **su casa** está en riesgo.
riesgo-quebrada responde a una persona **"¿mi casa está en riesgo y qué hago?"** cruzando su distrito con los avisos oficiales de lluvia.

## Compilar y probar

Requiere JDK 21, Maven 3.9+ y Docker (MongoDB y pruebas de integración).

```bash
mvn verify
```

## API

| Método | Ruta | Qué hace |
|---|---|---|
| `POST` | `/usuarios` | Crea un usuario: `{"nombre": "Ana"}` |
| `POST` | `/usuarios/{id}/lugares` | Registra un lugar: `{"nombre","tipo","ubigeo","latitud","longitud"}` |
| `GET` | `/usuarios/{id}/lugares` | Lista los lugares del usuario |

Validaciones: ubigeo de 6 dígitos y coordenadas dentro del Perú (400 si no se cumplen).
