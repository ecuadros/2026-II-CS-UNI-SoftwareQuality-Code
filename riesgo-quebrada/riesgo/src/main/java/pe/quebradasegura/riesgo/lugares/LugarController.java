package pe.quebradasegura.riesgo.lugares;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class LugarController {

    private final UsuarioRepository usuarios;
    private final LugarRepository lugares;

    public LugarController(UsuarioRepository usuarios, LugarRepository lugares) {
        this.usuarios = usuarios;
        this.lugares = lugares;
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario crearUsuario(@Valid @RequestBody NuevoUsuario nuevo) {
        return usuarios.save(new Usuario(UUID.randomUUID().toString(), nuevo.nombre()));
    }

    @PostMapping("/usuarios/{usuarioId}/lugares")
    @ResponseStatus(HttpStatus.CREATED)
    public LugarDto registrarLugar(@PathVariable String usuarioId, @Valid @RequestBody NuevoLugar nuevo) {
        exigirUsuario(usuarioId);
        var lugar = new Lugar(UUID.randomUUID().toString(), usuarioId, nuevo.nombre(), nuevo.tipo(),
                nuevo.ubigeo(), new GeoJsonPoint(nuevo.longitud(), nuevo.latitud()));
        return LugarDto.de(lugares.save(lugar));
    }

    @GetMapping("/usuarios/{usuarioId}/lugares")
    public List<LugarDto> lugaresDelUsuario(@PathVariable String usuarioId) {
        exigirUsuario(usuarioId);
        return lugares.findByUsuarioId(usuarioId).stream().map(LugarDto::de).toList();
    }

    private void exigirUsuario(String usuarioId) {
        if (!usuarios.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el usuario " + usuarioId);
        }
    }
}
