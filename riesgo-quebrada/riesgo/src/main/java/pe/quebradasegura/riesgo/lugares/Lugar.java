package pe.quebradasegura.riesgo.lugares;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

// clase que representa una ubicación geográfica
@Document("lugares")
public record Lugar(
        @Id String id,
        String usuarioId,
        String nombre,
        TipoLugar tipo,
        String ubigeo,
        GeoJsonPoint ubicacion) {
}