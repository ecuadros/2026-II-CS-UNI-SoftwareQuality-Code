package pe.quebradasegura.riesgo.evaluacion;

import java.util.List;

/**
 * cada nivel agrega los suyos a los de los niveles menores.
 * TODO: validar contra las guías de INDECI.
 */
final class PlanDeAccion {

    private static final List<List<String>> PASOS_POR_NIVEL = List.of(
            List.of("Prepara tu mochila de emergencia: agua, linterna, botiquín y documentos.",
                    "Identifica la ruta de evacuación y la zona segura más cercana."),
            List.of("Revisa los avisos de SENAMHI antes de salir o viajar."),
            List.of("Aléjate de los cauces de ríos y quebradas mientras llueva."),
            List.of("Evacúa a la zona segura si vives junto a un río o quebrada y la lluvia es intensa."));

    private PlanDeAccion() {
    }

    static List<String> para(NivelRiesgo nivel) {
        return PASOS_POR_NIVEL.subList(0, nivel.ordinal() + 1).stream().flatMap(List::stream).toList();
    }
}
