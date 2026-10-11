package pe.quebradasegura.riesgo.lugares;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record NuevoLugar(
        @NotBlank @Size(max = 60) String nombre,
        @NotNull TipoLugar tipo,
        @NotNull @Pattern(regexp = "\\d{6}", message = "debe ser un ubigeo INEI de 6 dígitos") String ubigeo,
        @NotNull @DecimalMin("-18.4") @DecimalMax("0.1") Double latitud,
        @NotNull @DecimalMin("-81.4") @DecimalMax("-68.6") Double longitud) {
}