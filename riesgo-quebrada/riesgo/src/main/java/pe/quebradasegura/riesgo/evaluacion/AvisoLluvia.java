package pe.quebradasegura.riesgo.evaluacion;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/** Aviso de lluvia de SENAMHI con los distritos que CENEPRED estima afectados. */
public record AvisoLluvia(String codigo, Instant inicio, Instant fin, List<DistritoAfectado> distritos) {

    public AvisoLluvia {
        Objects.requireNonNull(codigo, "codigo");
        Objects.requireNonNull(inicio, "inicio");
        Objects.requireNonNull(fin, "fin");
        if (fin.isBefore(inicio)) {
            throw new IllegalArgumentException("El aviso " + codigo + " termina antes de empezar");
        }
        distritos = List.copyOf(distritos);
    }

    public record DistritoAfectado(String ubigeo, NivelRiesgo nivel) {

        public DistritoAfectado {
            Objects.requireNonNull(ubigeo, "ubigeo");
            Objects.requireNonNull(nivel, "nivel");
        }
    }

    public boolean terminoAntesDe(Instant momento) {
        return fin.isBefore(momento);
    }

    /** Si el distrito aparece repetido en el aviso, vale el nivel más alto. */
    public Optional<NivelRiesgo> nivelEn(String ubigeo) {
        return distritos.stream()
                .filter(distrito -> distrito.ubigeo().equals(ubigeo))
                .map(DistritoAfectado::nivel)
                .max(NivelRiesgo::compareTo);
    }
}
