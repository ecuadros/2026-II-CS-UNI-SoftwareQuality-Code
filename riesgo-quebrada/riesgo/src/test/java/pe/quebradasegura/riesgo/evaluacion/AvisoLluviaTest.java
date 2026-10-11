package pe.quebradasegura.riesgo.evaluacion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import pe.quebradasegura.riesgo.evaluacion.AvisoLluvia.DistritoAfectado;

class AvisoLluviaTest {

    private static final Instant INICIO = Instant.parse("2026-10-09T05:00:00Z");
    private static final Instant FIN = Instant.parse("2026-10-12T04:59:59Z");

    @Test
    void unDistritoRepetidoTomaElNivelMasAlto() {
        var aviso = new AvisoLluvia("403-2026", INICIO, FIN, List.of(
                new DistritoAfectado("060101", NivelRiesgo.MEDIO),
                new DistritoAfectado("060101", NivelRiesgo.MUY_ALTO)));

        assertThat(aviso.nivelEn("060101")).contains(NivelRiesgo.MUY_ALTO);
    }

    @Test
    void unAvisoQueTerminaAntesDeEmpezarSeRechaza() {
        assertThatThrownBy(() -> new AvisoLluvia("403-2026", FIN, INICIO, List.of()))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void unCampoNuloSeRechazaAlCrearElAviso() {
        assertThatThrownBy(() -> new AvisoLluvia("403-2026", INICIO, null, List.of()))
                .isInstanceOf(NullPointerException.class);
        assertThatThrownBy(() -> new DistritoAfectado("060101", null))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void modificarLaListaOriginalNoCambiaElAviso() {
        var distritos = new ArrayList<DistritoAfectado>();
        distritos.add(new DistritoAfectado("060101", NivelRiesgo.ALTO));
        var aviso = new AvisoLluvia("403-2026", INICIO, FIN, distritos);

        distritos.clear();

        assertThat(aviso.nivelEn("060101")).contains(NivelRiesgo.ALTO);
    }
}
