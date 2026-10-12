package pe.quebradasegura.riesgo.lugares;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class LugarRepositoryIT {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void mongoProps(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", () -> mongo.getReplicaSetUrl("riesgo"));
    }

    @Autowired
    private LugarRepository lugares;

    @Test
    void encuentraLosLugaresDeUnUsuarioConSusCoordenadas() {
        lugares.saveAll(List.of(
                new Lugar("casa-ana", "ana", "Casa", TipoLugar.CASA, "060101", new GeoJsonPoint(-78.51, -7.16)),
                new Lugar("colegio-ana", "ana", "Colegio", TipoLugar.COLEGIO, "150101", new GeoJsonPoint(-77.04, -12.05)),
                new Lugar("casa-luis", "luis", "Casa", TipoLugar.CASA, "060101", new GeoJsonPoint(-78.52, -7.15))));

        var deAna = lugares.findByUsuarioId("ana");

        assertThat(deAna).extracting(Lugar::id).containsExactlyInAnyOrder("casa-ana", "colegio-ana");
        var casa = deAna.stream().filter(l -> l.id().equals("casa-ana")).findFirst().orElseThrow();
        assertThat(casa.ubicacion().getX()).isEqualTo(-78.51);
        assertThat(casa.ubicacion().getY()).isEqualTo(-7.16);
    }
}