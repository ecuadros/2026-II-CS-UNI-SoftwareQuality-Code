package pe.quebradasegura.riesgo;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.quebradasegura.riesgo.evaluacion.EvaluadorRiesgo;

@Configuration
class RiesgoConfig {

   //configura un reloj que puede ser fijo o el reloj del sistema
    @Bean
    Clock reloj(@Value("${riesgo.reloj:}") String instanteFijo) {
        return instanteFijo.isBlank()
                ? Clock.systemUTC()
                : Clock.fixed(Instant.parse(instanteFijo), ZoneOffset.UTC);
    }

    @Bean
    EvaluadorRiesgo evaluadorRiesgo() {
        return new EvaluadorRiesgo();
    }
}
