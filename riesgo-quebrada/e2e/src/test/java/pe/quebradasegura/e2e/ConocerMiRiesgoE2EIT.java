package pe.quebradasegura.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.MountableFile;

/**
 * Flujo crítico elegido para E2E: una persona registra su casa y conoce su riesgo.
 * los .jar de riesgo e ingesta están cada uno en su contenedor, y MongoDB, conectados por una red
 * La prueba solo habla con riesgo por HTTP tal como lo haría un usuario. ingesta sirve los avisos reales
 * grabados; RIESGO_RELOJ fija la fecha dentro de su vigencia para que el resultado no dependa del día.
 */
@Testcontainers
class ConocerMiRiesgoE2EIT {

    private static final String VERSION = "0.1.0-SNAPSHOT";
    private static final Network RED = Network.newNetwork();

    @Container
    static final MongoDBContainer MONGO = new MongoDBContainer("mongo:7.0")
            .withNetwork(RED)
            .withNetworkAliases("mongo");

    @Container
    static final GenericContainer<?> INGESTA = servicio("ingesta", 8081);

    @Container
    static final GenericContainer<?> RIESGO = servicio("riesgo", 8082)
            .withEnv("SPRING_DATA_MONGODB_URI", "mongodb://mongo:27017/riesgo?directConnection=true")
            .withEnv("INGESTA_URL", "http://ingesta:8081")
            .withEnv("RIESGO_RELOJ", "2026-10-10T12:00:00Z")
            .dependsOn(MONGO, INGESTA);

    private final HttpClient http = HttpClient.newHttpClient();
    private final ObjectMapper json = new ObjectMapper();

    @Test
    void unaPersonaRegistraSuCasaYConoceSuRiesgoYQueHacer() throws Exception {
        var ana = post("/usuarios", Map.of("nombre", "Ana"));
        var usuarioId = ana.path("id").asText();
        var casa = post("/usuarios/" + usuarioId + "/lugares", Map.of("nombre", "Casa", "tipo", "CASA",
                "ubigeo", "060101", "latitud", -7.16, "longitud", -78.51));

        var riesgo = get("/usuarios/" + usuarioId + "/lugares/" + casa.path("id").asText() + "/riesgo");

        assertThat(riesgo.path("nivel").asText()).isEqualTo("ALTO");
        assertThat(riesgo.path("avisos").get(0).asText()).isEqualTo("403-2026");
        assertThat(riesgo.path("plan").toString()).contains("Aléjate de los cauces");
    }

    private static GenericContainer<?> servicio(String nombre, int puerto) {
        var jar = Path.of("..", nombre, "target", nombre + "-" + VERSION + ".jar");
        return new GenericContainer<>("eclipse-temurin:21-jre")
                .withNetwork(RED)
                .withNetworkAliases(nombre)
                .withCopyFileToContainer(MountableFile.forHostPath(jar), "/app.jar")
                .withCommand("java", "-jar", "/app.jar")
                .withExposedPorts(puerto)
                .waitingFor(Wait.forHttp("/actuator/health").forPort(puerto)
                        .withStartupTimeout(Duration.ofMinutes(2)));
    }

    private String urlDeRiesgo(String ruta) {
        return "http://" + RIESGO.getHost() + ":" + RIESGO.getMappedPort(8082) + ruta;
    }

    private JsonNode post(String ruta, Map<String, ?> cuerpo) throws IOException, InterruptedException {
        var pedido = HttpRequest.newBuilder(URI.create(urlDeRiesgo(ruta)))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(cuerpo)))
                .build();
        return enviar(pedido);
    }

    private JsonNode get(String ruta) throws IOException, InterruptedException {
        return enviar(HttpRequest.newBuilder(URI.create(urlDeRiesgo(ruta))).GET().build());
    }

    private JsonNode enviar(HttpRequest pedido) throws IOException, InterruptedException {
        var respuesta = http.send(pedido, HttpResponse.BodyHandlers.ofString());
        assertThat(respuesta.statusCode()).as("%s %s", pedido.method(), pedido.uri()).isBetween(200, 299);
        return json.readTree(respuesta.body());
    }
}