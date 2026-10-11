package pe.quebradasegura.riesgo.lugares;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("usuarios")
public record Usuario(@Id String id, String nombre) {
}
