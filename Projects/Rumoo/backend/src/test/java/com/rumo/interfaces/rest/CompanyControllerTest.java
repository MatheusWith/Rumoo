package com.rumo.interfaces.rest;

import tools.jackson.databind.ObjectMapper;
import com.rumo.application.company.CompanyNotFoundException;
import com.rumo.application.company.CompanyService;
import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CompanyController.class)
class CompanyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CompanyService companyService;

    @Test
    void shouldCreateCompany() throws Exception {
        CompanyRequest request = new CompanyRequest("Rumoo SA", "12345678000199");
        CompanyResponse response = new CompanyResponse(1L, "Rumoo SA", "12345678000199", true);
        when(companyService.create(any(CompanyRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Rumoo SA"));
    }

    @Test
    void shouldReturn400WhenCnpjMissing() throws Exception {
        String body = "{\"nome\":\"Rumoo SA\"}";

        mockMvc.perform(post("/api/v1/companies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFindById() throws Exception {
        CompanyResponse response = new CompanyResponse(1L, "Rumoo SA", "12345678000199", true);
        when(companyService.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/companies/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Rumoo SA"));
    }

    @Test
    void shouldReturn404WhenNotFound() throws Exception {
        when(companyService.findById(99L)).thenThrow(new CompanyNotFoundException(99L));

        mockMvc.perform(get("/api/v1/companies/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Company not found with id: 99"));
    }

    @Test
    void shouldFindAllPaginated() throws Exception {
        CompanyResponse r1 = new CompanyResponse(1L, "Company A", "12345678000101", true);
        CompanyPage page = new CompanyPage(List.of(r1), 0, 20, 1, 1);
        when(companyService.findAll(0, 20)).thenReturn(page);

        mockMvc.perform(get("/api/v1/companies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nome").value("Company A"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void shouldUpdateCompany() throws Exception {
        CompanyRequest request = new CompanyRequest("New Name", "12345678000199");
        CompanyResponse response = new CompanyResponse(1L, "New Name", "12345678000199", true);
        when(companyService.update(eq(1L), any(CompanyRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/companies/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("New Name"));
    }

    @Test
    void shouldDeleteCompany() throws Exception {
        doNothing().when(companyService).delete(1L);

        mockMvc.perform(delete("/api/v1/companies/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenUpdateNotFound() throws Exception {
        CompanyRequest request = new CompanyRequest("New Name", "12345678000199");
        when(companyService.update(eq(99L), any(CompanyRequest.class)))
                .thenThrow(new CompanyNotFoundException(99L));

        mockMvc.perform(put("/api/v1/companies/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn404WhenDeleteNotFound() throws Exception {
        org.mockito.Mockito.doThrow(new CompanyNotFoundException(99L))
                .when(companyService).delete(99L);

        mockMvc.perform(delete("/api/v1/companies/99"))
                .andExpect(status().isNotFound());
    }
}
