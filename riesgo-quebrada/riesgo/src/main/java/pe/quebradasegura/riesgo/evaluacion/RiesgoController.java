package pe.quebradasegura.riesgo.evaluacion;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RiesgoController {

    private final RiesgoService servicio;

    public RiesgoController(RiesgoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/usuarios/{usuarioId}/lugares/{lugarId}/riesgo")
    public Evaluacion riesgo(@PathVariable String usuarioId, @PathVariable String lugarId) {
        return servicio.riesgoDe(usuarioId, lugarId);
    }
}
