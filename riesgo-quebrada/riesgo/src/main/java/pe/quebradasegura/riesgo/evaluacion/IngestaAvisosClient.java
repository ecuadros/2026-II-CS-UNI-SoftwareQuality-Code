package pe.quebradasegura.riesgo.evaluacion;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
class IngestaAvisosClient implements AvisosClient {

    private final RestClient http;

    IngestaAvisosClient(RestClient.Builder builder, @Value("${ingesta.url}") String ingestaUrl) {
        this.http = builder.baseUrl(ingestaUrl).build();
    }

    @Override
    public List<AvisoLluvia> avisosEn(String ubigeo) {
        return http.get()
                .uri(uri -> uri.path("/avisos").queryParam("ubigeo", ubigeo).build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() { });
    }
}
