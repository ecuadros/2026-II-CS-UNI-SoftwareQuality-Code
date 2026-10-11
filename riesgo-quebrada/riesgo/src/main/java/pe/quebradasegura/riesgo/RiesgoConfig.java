package pe.quebradasegura.riesgo;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.quebradasegura.riesgo.evaluacion.EvaluadorRiesgo;

@Configuration
class RiesgoConfig {

    @Bean
    Clock reloj() {
        return Clock.systemUTC();
    }

    @Bean
    EvaluadorRiesgo evaluadorRiesgo() {
        return new EvaluadorRiesgo();
    }
}
