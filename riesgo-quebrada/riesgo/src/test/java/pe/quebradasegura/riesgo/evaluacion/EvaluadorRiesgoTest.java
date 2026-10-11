package pe.quebradasegura.riesgo.evaluacion;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import pe.quebradasegura.riesgo.evaluacion.AvisoLluvia.DistritoAfectado;

class EvaluadorRiesgoTest {

    private static final Instant AHORA = Instant.parse("2026-10-09T15:00:00Z");

    private final EvaluadorRiesgo evaluador = new EvaluadorRiesgo();

    @Test
    void sinAvisosElRiesgoEsBajo() {
        var evaluacion = evaluador.evaluar("060101", List.of(), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.BAJO);
        assertThat(evaluacion.avisos()).isEmpty();
    }

    @Test
    void unAvisoQueIncluyeElDistritoDefineElNivel() {
        var aviso = aviso("403-2026", "2026-10-09T05:00:00Z", "2026-10-12T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.MUY_ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(aviso), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.MUY_ALTO);
        assertThat(evaluacion.avisos()).containsExactly("403-2026");
    }

    @Test
    void unAvisoDeOtroDistritoNoCuenta() {
        var aviso = aviso("403-2026", "2026-10-09T05:00:00Z", "2026-10-12T04:59:59Z",
                new DistritoAfectado("140101", NivelRiesgo.ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(aviso), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.BAJO);
    }

    @Test
    void unAvisoQueYaTerminoNoCuenta() {
        var aviso = aviso("399-2026", "2026-10-05T05:00:00Z", "2026-10-08T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(aviso), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.BAJO);
    }

    @Test
    void unAvisoQueTodaviaNoEmpiezaSiCuentaParaPrepararse() {
        var aviso = aviso("404-2026", "2026-10-10T05:00:00Z", "2026-10-13T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(aviso), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.ALTO);
    }

    @Test
    void conVariosAvisosGanaElNivelMasAltoYSeListanTodos() {
        var medio = aviso("401-2026", "2026-10-08T05:00:00Z", "2026-10-10T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.MEDIO));
        var muyAlto = aviso("403-2026", "2026-10-09T05:00:00Z", "2026-10-12T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.MUY_ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(medio, muyAlto), AHORA);

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.MUY_ALTO);
        assertThat(evaluacion.avisos()).containsExactly("401-2026", "403-2026");
    }

    @Test
    void conRiesgoBajoElPlanEsPrepararse() {
        var evaluacion = evaluador.evaluar("060101", List.of(), AHORA);

        assertThat(evaluacion.plan())
                .anyMatch(paso -> paso.contains("mochila de emergencia"))
                .noneMatch(paso -> paso.contains("Evacúa"));
    }

    @Test
    void conRiesgoMuyAltoElPlanIncluyeEvacuar() {
        var aviso = aviso("403-2026", "2026-10-09T05:00:00Z", "2026-10-12T04:59:59Z",
                new DistritoAfectado("060101", NivelRiesgo.MUY_ALTO));

        var evaluacion = evaluador.evaluar("060101", List.of(aviso), AHORA);

        assertThat(evaluacion.plan()).anyMatch(paso -> paso.contains("Evacúa"));
    }

    private static AvisoLluvia aviso(String codigo, String inicio, String fin, DistritoAfectado... distritos) {
        return new AvisoLluvia(codigo, Instant.parse(inicio), Instant.parse(fin), List.of(distritos));
    }
}
