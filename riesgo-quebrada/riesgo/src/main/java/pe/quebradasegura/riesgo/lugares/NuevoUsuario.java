package pe.quebradasegura.riesgo.lugares;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NuevoUsuario(@NotBlank @Size(max = 100) String nombre) {
}
