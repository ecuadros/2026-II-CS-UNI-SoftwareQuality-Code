package pe.quebradasegura.riesgo.evaluacion;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RiesgoController.class)
class RiesgoControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private RiesgoService servicio;

    @Test
    void devuelveElNivelLosAvisosYElPlan() throws Exception {
        when(servicio.riesgoDe("u1", "l1"))
                .thenReturn(new Evaluacion(NivelRiesgo.ALTO, List.of("403-2026"), List.of("Paso 1")));

        mvc.perform(get("/usuarios/u1/lugares/l1/riesgo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nivel").value("ALTO"))
                .andExpect(jsonPath("$.avisos[0]").value("403-2026"))
                .andExpect(jsonPath("$.plan[0]").value("Paso 1"));
    }

    @Test
    void unLugarInexistenteDevuelve404() throws Exception {
        when(servicio.riesgoDe("u1", "nada")).thenThrow(new LugarNoEncontrado("nada"));

        mvc.perform(get("/usuarios/u1/lugares/nada/riesgo")).andExpect(status().isNotFound());
    }
}
