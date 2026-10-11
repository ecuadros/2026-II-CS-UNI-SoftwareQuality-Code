package pe.quebradasegura.riesgo.evaluacion;

import java.time.Clock;
import org.springframework.stereotype.Service;
import pe.quebradasegura.riesgo.lugares.LugarRepository;

@Service
public class RiesgoService {

    private final LugarRepository lugares;
    private final AvisosClient avisos;
    private final EvaluadorRiesgo evaluador;
    private final Clock reloj;

    public RiesgoService(LugarRepository lugares, AvisosClient avisos, EvaluadorRiesgo evaluador, Clock reloj) {
        this.lugares = lugares;
        this.avisos = avisos;
        this.evaluador = evaluador;
        this.reloj = reloj;
    }

    public Evaluacion riesgoDe(String usuarioId, String lugarId) {
        var lugar = lugares.findById(lugarId)
                .filter(encontrado -> encontrado.usuarioId().equals(usuarioId))
                .orElseThrow(() -> new LugarNoEncontrado(lugarId));
        return evaluador.evaluar(lugar.ubigeo(), avisos.avisosEn(lugar.ubigeo()), reloj.instant());
    }
}
