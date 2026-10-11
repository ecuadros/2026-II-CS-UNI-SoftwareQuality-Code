package pe.quebradasegura.riesgo.evaluacion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LugarNoEncontrado extends RuntimeException {

    public LugarNoEncontrado(String lugarId) {
        super("No existe el lugar " + lugarId);
    }
}
