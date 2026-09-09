package com.rumo.interfaces.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rumo.application.company.CreateCompanyUseCase;
import com.rumo.application.company.DeleteCompanyUseCase;
import com.rumo.application.company.FindCompanyByIdUseCase;
import com.rumo.application.company.ListCompaniesUseCase;
import com.rumo.application.company.UpdateCompanyUseCase;
import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.interfaces.security.SecurityConfig;
import com.rumo.interfaces.security.TestJwtDecoderConfig;
import com.rumo.interfaces.security.TestTokens;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(CompanyController.class)
@Import({TestJwtDecoderConfig.class, SecurityConfig.class})
class CompanyAuthorizationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockitoBean private CreateCompanyUseCase createCompanyUseCase;

  @MockitoBean private FindCompanyByIdUseCase findCompanyByIdUseCase;

  @MockitoBean private ListCompaniesUseCase listCompaniesUseCase;

  @MockitoBean private UpdateCompanyUseCase updateCompanyUseCase;

  @MockitoBean private DeleteCompanyUseCase deleteCompanyUseCase;

  @Test
  void shouldReturn401WhenNoToken() throws Exception {
    mockMvc.perform(get("/api/v1/companies")).andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturn401WhenTokenFromUnknownIssuer() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.foreignIssuerBearer("user")))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturn401WhenSignatureTampered() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.tamperedSignatureBearer("user")))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldAllowReadForCompanyReader() throws Exception {
    CompanyPage page = new CompanyPage(List.of(), 0, 20, 0, 0);
    when(listCompaniesUseCase.execute(0, 20)).thenReturn(page);

    mockMvc
        .perform(
            get("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:read")))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenNoReaderRole() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:create")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldReturn403WhenNoRolesAtAll() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/companies").header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowCreateForCompanyCreator() throws Exception {
    CompanyRequest request = new CompanyRequest("Rumoo SA", "12345678000199");
    CompanyResponse response = new CompanyResponse(1L, "Rumoo SA", "12345678000199", true);
    when(createCompanyUseCase.execute(any(CompanyRequest.class))).thenReturn(response);

    mockMvc
        .perform(
            post("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:create"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated());
  }

  @Test
  void shouldReturn403WhenCreatingWithoutCompanyCreate() throws Exception {
    CompanyRequest request = new CompanyRequest("Rumoo SA", "12345678000199");

    mockMvc
        .perform(
            post("/api/v1/companies")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowUpdateForCompanyUpdater() throws Exception {
    CompanyRequest request = new CompanyRequest("New Name", "12345678000199");
    CompanyResponse response = new CompanyResponse(1L, "New Name", "12345678000199", true);
    when(updateCompanyUseCase.execute(eq(1L), any(CompanyRequest.class))).thenReturn(response);

    mockMvc
        .perform(
            put("/api/v1/companies/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenUpdatingWithoutCompanyUpdate() throws Exception {
    CompanyRequest request = new CompanyRequest("New Name", "12345678000199");

    mockMvc
        .perform(
            put("/api/v1/companies/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowDeleteForCompanyDeleter() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/companies/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:delete")))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldReturn403WhenDeletingWithoutCompanyDelete() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/companies/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:update")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldReturn404WithReaderRoleOnMissingCompany() throws Exception {
    when(findCompanyByIdUseCase.execute(99L)).thenThrow(new CompanyNotFoundException(99L));

    mockMvc
        .perform(
            get("/api/v1/companies/99")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "company:read")))
        .andExpect(status().isNotFound());
  }
}
