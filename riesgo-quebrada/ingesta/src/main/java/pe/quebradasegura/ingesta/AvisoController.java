package pe.quebradasegura.ingesta;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//define un endpoint que entrega los avisos de lluvia que afectan a un distrito
@RestController
public class AvisoController {

    private final List<Aviso> avisos;

    //TODO: Cambiar la fuente de donde se obtienen los avisos, para que no sea un archivo local sino un endpoint remoto.
    public AvisoController(ObjectMapper json) throws IOException {
        try (var archivo = new ClassPathResource("avisos.json").getInputStream()) {
            this.avisos = json.readValue(archivo, new TypeReference<>() { });
        }
    }

    @GetMapping("/avisos")
    public List<Aviso> avisos(@RequestParam String ubigeo) {
        return avisos.stream().filter(aviso -> aviso.afectaA(ubigeo)).toList();
    }
}