package pe.quebradasegura.riesgo.evaluacion;

import java.util.List;

public record Evaluacion(NivelRiesgo nivel, List<String> avisos, List<String> plan) {
}
