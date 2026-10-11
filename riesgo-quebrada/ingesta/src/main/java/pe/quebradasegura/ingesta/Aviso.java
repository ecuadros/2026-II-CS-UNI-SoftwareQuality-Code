package pe.quebradasegura.ingesta;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/** Verifica que se cumpla el Pact declarado */
public record Aviso(String codigo, Instant inicio, Instant fin, List<DistritoAfectado> distritos) {

    public Aviso {
        Objects.requireNonNull(codigo, "codigo");
        Objects.requireNonNull(inicio, "inicio");
        Objects.requireNonNull(fin, "fin");
        distritos = List.copyOf(distritos);
    }

    public record DistritoAfectado(String ubigeo, String nivel) {

        public DistritoAfectado {
            Objects.requireNonNull(ubigeo, "ubigeo");
            Objects.requireNonNull(nivel, "nivel");
        }
    }

    public boolean afectaA(String ubigeo) {
        return distritos.stream().anyMatch(distrito -> distrito.ubigeo().equals(ubigeo));
    }
}