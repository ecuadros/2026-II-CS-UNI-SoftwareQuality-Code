package pe.quebradasegura.riesgo.evaluacion;

import java.time.Instant;
import java.util.List;

public class EvaluadorRiesgo {

    public Evaluacion evaluar(String ubigeo, List<AvisoLluvia> avisos, Instant ahora) {
        var relevantes = avisos.stream()
                .filter(aviso -> !aviso.terminoAntesDe(ahora))
                .filter(aviso -> aviso.nivelEn(ubigeo).isPresent())
                .toList();
        var nivel = relevantes.stream()
                .map(aviso -> aviso.nivelEn(ubigeo).orElseThrow())
                .max(NivelRiesgo::compareTo)
                .orElse(NivelRiesgo.BAJO);
        return new Evaluacion(nivel, relevantes.stream().map(AvisoLluvia::codigo).toList(), PlanDeAccion.para(nivel));
    }
}
