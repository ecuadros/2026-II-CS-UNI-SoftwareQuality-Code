package pe.quebradasegura.ingesta;

import au.com.dius.pact.provider.junit5.HttpTestTarget;
import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junitsupport.Provider;
import au.com.dius.pact.provider.junitsupport.State;
import au.com.dius.pact.provider.junitsupport.loader.PactFolder;
import au.com.dius.pact.provider.spring.junit5.PactVerificationSpringProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

/*Verifica, contra la API real de ingesta, el contrato que escribió riesgo */
@Provider("ingesta-service")
@PactFolder("../pacts")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IngestaPactIT {

    @LocalServerPort
    private int puerto;

    @BeforeEach
    void apuntarAlServicio(PactVerificationContext contexto) {
        contexto.setTarget(new HttpTestTarget("localhost", puerto));
    }

    @TestTemplate
    @ExtendWith(PactVerificationSpringProvider.class)
    void verificarContrato(PactVerificationContext contexto) {
        contexto.verifyInteraction();
    }

    @State("hay un aviso vigente para el distrito 060101")
    void avisoVigente() {
        // avisos.json ya trae un aviso para 060101. El contrato compara formato, no fechas.
    }
}
