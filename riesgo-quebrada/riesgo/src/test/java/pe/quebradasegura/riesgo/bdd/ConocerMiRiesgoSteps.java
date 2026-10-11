package pe.quebradasegura.riesgo.bdd;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import io.cucumber.java.Before;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import pe.quebradasegura.riesgo.evaluacion.AvisoLluvia;
import pe.quebradasegura.riesgo.evaluacion.AvisoLluvia.DistritoAfectado;
import pe.quebradasegura.riesgo.evaluacion.AvisosClient;
import pe.quebradasegura.riesgo.evaluacion.Evaluacion;
import pe.quebradasegura.riesgo.evaluacion.NivelRiesgo;
import pe.quebradasegura.riesgo.evaluacion.RiesgoService;
import pe.quebradasegura.riesgo.lugares.Lugar;
import pe.quebradasegura.riesgo.lugares.LugarRepository;
import pe.quebradasegura.riesgo.lugares.TipoLugar;

public class ConocerMiRiesgoSteps {

    @Autowired
    private AvisosClient avisosDeIngesta;

    @Autowired
    private LugarRepository lugares;

    @Autowired
    private RiesgoService riesgo;

    private final List<AvisoLluvia> avisos = new ArrayList<>();
    private Evaluacion evaluacion;

    @Before
    public void limpiar() {
        lugares.deleteAll();
    }

    @Dado("que {string} registró su casa en el distrito {string}")
    public void registroSuCasa(String persona, String ubigeo) {
        lugares.save(new Lugar("casa-" + persona, persona, "Casa", TipoLugar.CASA, ubigeo,
                new GeoJsonPoint(-78.51, -7.16)));
    }

    @Dado("SENAMHI emitió el aviso {string} vigente con riesgo {string} para el distrito {string}")
    public void avisoVigente(String codigo, String nivel, String ubigeo) {
        var ahora = Instant.now();
        avisos.add(aviso(codigo, ahora.minus(Duration.ofHours(1)), ahora.plus(Duration.ofDays(2)), nivel, ubigeo));
    }

    @Dado("SENAMHI emitió el aviso {string} que ya terminó con riesgo {string} para el distrito {string}")
    public void avisoTerminado(String codigo, String nivel, String ubigeo) {
        var ahora = Instant.now();
        avisos.add(aviso(codigo, ahora.minus(Duration.ofDays(3)), ahora.minus(Duration.ofDays(1)), nivel, ubigeo));
    }

    @Cuando("{string} consulta el riesgo de su casa")
    public void consultaElRiesgo(String persona) {
        when(avisosDeIngesta.avisosEn(anyString())).thenReturn(avisos);
        evaluacion = riesgo.riesgoDe(persona, "casa-" + persona);
    }

    @Entonces("el riesgo es {string} por el aviso {string}")
    public void elRiesgoEsPorElAviso(String nivel, String codigo) {
        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.valueOf(nivel));
        assertThat(evaluacion.avisos()).containsExactly(codigo);
    }

    @Entonces("el riesgo es {string} sin avisos")
    public void elRiesgoEsSinAvisos(String nivel) {
        assertThat(evaluacion.nivel()).isEqualTo(NivelRiesgo.valueOf(nivel));
        assertThat(evaluacion.avisos()).isEmpty();
    }

    @Entonces("el plan de acción incluye {string}")
    public void elPlanIncluye(String paso) {
        assertThat(evaluacion.plan()).anyMatch(p -> p.contains(paso));
    }

    private static AvisoLluvia aviso(String codigo, Instant inicio, Instant fin, String nivel, String ubigeo) {
        return new AvisoLluvia(codigo, inicio, fin, List.of(new DistritoAfectado(ubigeo, NivelRiesgo.valueOf(nivel))));
    }
}
