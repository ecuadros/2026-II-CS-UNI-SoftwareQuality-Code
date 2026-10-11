package pe.quebradasegura.riesgo.evaluacion;

import java.util.List;

/** Avisos vigentes o próximos que afectan a un distrito. Los provee ingesta-service. */
public interface AvisosClient {

    List<AvisoLluvia> avisosEn(String ubigeo);
}
