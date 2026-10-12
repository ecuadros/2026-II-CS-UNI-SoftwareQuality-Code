package pe.quebradasegura.ingesta;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AvisoController.class)
class AvisoControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void devuelveLosAvisosQueAfectanAlDistrito() throws Exception {
        mvc.perform(get("/avisos").param("ubigeo", "060101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigo").value("403-2026"))
                .andExpect(jsonPath("$[0].inicio").value("2026-10-09T05:00:38Z"));
    }

    @Test
    void unDistritoSinAvisosDevuelveUnaListaVacia() throws Exception {
        mvc.perform(get("/avisos").param("ubigeo", "150101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
