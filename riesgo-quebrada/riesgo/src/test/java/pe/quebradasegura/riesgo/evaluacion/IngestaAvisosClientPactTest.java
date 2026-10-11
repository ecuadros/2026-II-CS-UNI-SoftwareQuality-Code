package pe.quebradasegura.riesgo.evaluacion;

import static au.com.dius.pact.consumer.dsl.LambdaDsl.newJsonArrayMinLike;
import static org.assertj.core.api.Assertions.assertThat;

import au.com.dius.pact.consumer.MockServer;
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import au.com.dius.pact.core.model.PactSpecVersion;
import au.com.dius.pact.core.model.RequestResponsePact;
import au.com.dius.pact.core.model.annotations.Pact;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.web.client.RestClient;

/** Lo que riesgo-service necesita de ingesta-service*/
@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "ingesta-service", pactVersion = PactSpecVersion.V3)
class IngestaAvisosClientPactTest {

    static final String INSTANTE = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z";

    @Pact(consumer = "riesgo-service")
    public RequestResponsePact avisosDeUnDistrito(PactDslWithProvider builder) {
        return builder
                .given("hay un aviso vigente para el distrito 060101")
                .uponReceiving("una consulta de los avisos del distrito 060101")
                .path("/avisos").query("ubigeo=060101").method("GET")
                .willRespondWith()
                .status(200)
                .body(newJsonArrayMinLike(1, arreglo -> arreglo.object(aviso -> aviso
                        .stringType("codigo", "403-2026")
                        .stringMatcher("inicio", INSTANTE, "2026-10-09T05:00:38Z")
                        .stringMatcher("fin", INSTANTE, "2026-10-12T04:59:38Z")
                        .minArrayLike("distritos", 1, distrito -> distrito
                                .stringMatcher("ubigeo", "\\d{6}", "060101")
                                .stringMatcher("nivel", "BAJO|MEDIO|ALTO|MUY_ALTO", "ALTO")))).build())
                .toPact();
    }

    @Test
    @PactTestFor(pactMethod = "avisosDeUnDistrito")
    void leeLosAvisosDeUnDistrito(MockServer servidor) {
        var avisos = new IngestaAvisosClient(RestClient.builder(), servidor.getUrl()).avisosEn("060101");

        assertThat(avisos).singleElement().satisfies(aviso -> {
            assertThat(aviso.codigo()).isEqualTo("403-2026");
            assertThat(aviso.nivelEn("060101")).contains(NivelRiesgo.ALTO);
        });
    }
}
