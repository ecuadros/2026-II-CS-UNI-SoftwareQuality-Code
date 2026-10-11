package pe.quebradasegura.riesgo.evaluacion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import pe.quebradasegura.riesgo.evaluacion.AvisoLluvia.DistritoAfectado;
import pe.quebradasegura.riesgo.lugares.Lugar;
import pe.quebradasegura.riesgo.lugares.LugarRepository;
import pe.quebradasegura.riesgo.lugares.TipoLugar;

@ExtendWith(MockitoExtension.class)
class RiesgoServiceTest {

    private static final Clock RELOJ = Clock.fixed(Instant.parse("2026-10-09T15:00:00Z"), ZoneOffset.UTC);
    private static final Lugar CASA =
            new Lugar("l1", "u1", "Casa", TipoLugar.CASA, "060101", new GeoJsonPoint(-78.51, -7.16));

    @Mock
    private LugarRepository lugares;

    @Mock
    private AvisosClient avisos;

    private RiesgoService servicio;

    @BeforeEach
    void setUp() {
        servicio = new RiesgoService(lugares, avisos, new EvaluadorRiesgo(), RELOJ);
    }

    @Test
    void evaluaElLugarConLosAvisosDeSuDistrito() {
        when(lugares.findById("l1")).thenReturn(Optional.of(CASA));
        when(avisos.avisosEn("060101")).thenReturn(List.of(new AvisoLluvia("403-2026",
                Instant.parse("2026-10-09T05:00:00Z"), Instant.parse("2026-10-12T04:59:59Z"),
                List.of(new DistritoAfectado("060101", NivelRiesgo.MUY_ALTO)))));

        var evaluacion = servicio.riesgoDe("u1", "l1");

        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.MUY_ALTO);
    }

    @Test
    void noEvaluaElLugarDeOtroUsuario() {
        when(lugares.findById("l1")).thenReturn(Optional.of(CASA));

        assertThatThrownBy(() -> servicio.riesgoDe("otro", "l1")).isInstanceOf(LugarNoEncontrado.class);
        verifyNoInteractions(avisos);
    }
}
