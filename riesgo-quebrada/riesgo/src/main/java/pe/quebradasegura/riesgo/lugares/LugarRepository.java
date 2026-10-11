package pe.quebradasegura.riesgo.lugares;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LugarRepository extends MongoRepository<Lugar, String> {

    List<Lugar> findByUsuarioId(String usuarioId);
}
