package pe.quebradasegura.ingesta;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class AvisoTest {

    private static final Instant INICIO = Instant.parse("2026-10-09T05:00:00Z");
    private static final Instant FIN = Instant.parse("2026-10-12T04:59:59Z");

    @Test
    void rechazaCamposObligatoriosNulos() {
        assertThatThrownBy(() -> new Aviso(null, INICIO, FIN, List.of()))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("codigo");
        assertThatThrownBy(() -> new Aviso("403-2026", null, FIN, List.of()))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("inicio");
        assertThatThrownBy(() -> new Aviso("403-2026", INICIO, null, List.of()))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("fin");
        assertThatThrownBy(() -> new Aviso("403-2026", INICIO, FIN, null))
                .isInstanceOf(NullPointerException.class);
        assertThatThrownBy(() -> new Aviso.DistritoAfectado(null, "ALTO"))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("ubigeo");
        assertThatThrownBy(() -> new Aviso.DistritoAfectado("060101", null))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("nivel");
    }
}
