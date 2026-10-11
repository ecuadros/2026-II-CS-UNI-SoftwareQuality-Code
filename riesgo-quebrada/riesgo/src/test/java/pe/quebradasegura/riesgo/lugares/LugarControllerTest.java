package pe.quebradasegura.riesgo.lugares;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LugarController.class)
class LugarControllerTest {

    private static final String CASA_EN_CAJAMARCA = """
            {"nombre": "Casa", "tipo": "CASA", "ubigeo": "060101", "latitud": -7.16, "longitud": -78.51}
            """;

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private UsuarioRepository usuarios;

    @MockitoBean
    private LugarRepository lugares;

    @Test
    void creaUnUsuario() throws Exception {
        when(usuarios.save(any())).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content("{\"nombre\": \"Ana\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nombre").value("Ana"));
    }

    @Test
    void rechazaUnUsuarioSinNombre() throws Exception {
        mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content("{\"nombre\": \" \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registraUnLugarDelUsuario() throws Exception {
        when(usuarios.existsById("u1")).thenReturn(true);
        when(lugares.save(any())).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(post("/usuarios/u1/lugares").contentType(MediaType.APPLICATION_JSON).content(CASA_EN_CAJAMARCA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuarioId").value("u1"))
                .andExpect(jsonPath("$.ubigeo").value("060101"))
                .andExpect(jsonPath("$.latitud").value(-7.16))
                .andExpect(jsonPath("$.longitud").value(-78.51));
    }

    @Test
    void rechazaUnUbigeoQueNoTieneSeisDigitos() throws Exception {
        when(usuarios.existsById("u1")).thenReturn(true);
        var lugar = CASA_EN_CAJAMARCA.replace("060101", "6011");

        mvc.perform(post("/usuarios/u1/lugares").contentType(MediaType.APPLICATION_JSON).content(lugar))
                .andExpect(status().isBadRequest());
        verify(lugares, never()).save(any());
    }

    @Test
    void rechazaCoordenadasFueraDelPeru() throws Exception {
        when(usuarios.existsById("u1")).thenReturn(true);
        var enMadrid = CASA_EN_CAJAMARCA.replace("-7.16", "40.41").replace("-78.51", "-3.70");

        mvc.perform(post("/usuarios/u1/lugares").contentType(MediaType.APPLICATION_JSON).content(enMadrid))
                .andExpect(status().isBadRequest());
    }

    @Test
    void noRegistraLugaresDeUnUsuarioInexistente() throws Exception {
        when(usuarios.existsById("nadie")).thenReturn(false);

        mvc.perform(post("/usuarios/nadie/lugares").contentType(MediaType.APPLICATION_JSON).content(CASA_EN_CAJAMARCA))
                .andExpect(status().isNotFound());
        verify(lugares, never()).save(any());
    }
}
