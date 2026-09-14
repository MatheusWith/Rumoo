package com.rumo.interfaces.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rumo.application.collaborator.CreateCollaboratorUseCase;
import com.rumo.application.collaborator.DeleteCollaboratorUseCase;
import com.rumo.application.collaborator.FindCollaboratorByIdUseCase;
import com.rumo.application.collaborator.ListCollaboratorsUseCase;
import com.rumo.application.collaborator.UpdateCollaboratorUseCase;
import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorRequest;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.application.collaborator.dto.CollaboratorUpdateRequest;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.interfaces.security.SecurityConfig;
import com.rumo.interfaces.security.TestJwtDecoderConfig;
import com.rumo.interfaces.security.TestTokens;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(CollaboratorController.class)
@Import({TestJwtDecoderConfig.class, SecurityConfig.class})
class CollaboratorControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockitoBean private CreateCollaboratorUseCase createCollaboratorUseCase;

  @MockitoBean private FindCollaboratorByIdUseCase findCollaboratorByIdUseCase;

  @MockitoBean private ListCollaboratorsUseCase listCollaboratorsUseCase;

  @MockitoBean private UpdateCollaboratorUseCase updateCollaboratorUseCase;

  @MockitoBean private DeleteCollaboratorUseCase deleteCollaboratorUseCase;

  private static final String AUTH = TestTokens.bearer("user", "collaborator:create");

  @Test
  void shouldCreateCollaborator() throws Exception {
    CollaboratorRequest request = new CollaboratorRequest("Alice", "alice@rumoo.com", 1L, null);
    CollaboratorResponse response =
        new CollaboratorResponse(1L, "Alice", "alice@rumoo.com", 1L, null, true);
    when(createCollaboratorUseCase.execute(any(CollaboratorRequest.class))).thenReturn(response);

    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.name").value("Alice"))
        .andExpect(jsonPath("$.companyId").value(1L));
  }

  @Test
  void shouldReturn400WhenEmailInvalid() throws Exception {
    String body = "{\"name\":\"Alice\",\"email\":\"not-an-email\",\"companyId\":1}";

    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void shouldReturn400WhenCompanyIdMissing() throws Exception {
    String body = "{\"name\":\"Alice\",\"email\":\"alice@rumoo.com\"}";

    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void shouldReturn409WhenUniqueConstraintViolated() throws Exception {
    when(createCollaboratorUseCase.execute(any(CollaboratorRequest.class)))
        .thenThrow(new DataIntegrityViolationException("duplicate"));

    CollaboratorRequest request = new CollaboratorRequest("Alice", "dup@rumoo.com", 1L, null);
    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict());
  }

  @Test
  void shouldFindById() throws Exception {
    CollaboratorResponse response =
        new CollaboratorResponse(1L, "Alice", "alice@rumoo.com", 1L, null, true);
    when(findCollaboratorByIdUseCase.execute(1L)).thenReturn(response);

    mockMvc
        .perform(
            get("/api/v1/collaborators/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L));
  }

  @Test
  void shouldReturn404WhenNotFound() throws Exception {
    when(findCollaboratorByIdUseCase.execute(99L))
        .thenThrow(new CollaboratorNotFoundException(99L));

    mockMvc
        .perform(
            get("/api/v1/collaborators/99")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Collaborator not found with id: 99"));
  }

  @Test
  void shouldFindAllPaginatedAndFilteredByCompany() throws Exception {
    CollaboratorResponse r1 =
        new CollaboratorResponse(1L, "Alice", "alice@rumoo.com", 1L, null, true);
    CollaboratorPage page = new CollaboratorPage(List.of(r1), 0, 20, 1, 1);
    when(listCollaboratorsUseCase.execute(1L, 0, 20)).thenReturn(page);

    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .param("companyId", "1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].name").value("Alice"))
        .andExpect(jsonPath("$.totalElements").value(1));
  }

  @Test
  void shouldUpdateCollaborator() throws Exception {
    CollaboratorUpdateRequest request =
        new CollaboratorUpdateRequest("New Name", "new@rumoo.com", "sub-123");
    CollaboratorResponse response =
        new CollaboratorResponse(1L, "New Name", "new@rumoo.com", 1L, "sub-123", true);
    when(updateCollaboratorUseCase.execute(eq(1L), any(CollaboratorUpdateRequest.class)))
        .thenReturn(response);

    mockMvc
        .perform(
            put("/api/v1/collaborators/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("New Name"));
  }

  @Test
  void shouldReturn404WhenUpdateNotFound() throws Exception {
    doThrow(new CollaboratorNotFoundException(99L))
        .when(updateCollaboratorUseCase)
        .execute(eq(99L), any(CollaboratorUpdateRequest.class));

    CollaboratorUpdateRequest request = new CollaboratorUpdateRequest("New", "new@rumoo.com", null);
    mockMvc
        .perform(
            put("/api/v1/collaborators/99")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound());
  }

  @Test
  void shouldDeleteCollaborator() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:delete")))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldReturn404WhenDeleteNotFound() throws Exception {
    doThrow(new CollaboratorNotFoundException(99L)).when(deleteCollaboratorUseCase).execute(99L);

    mockMvc
        .perform(
            delete("/api/v1/collaborators/99")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:delete")))
        .andExpect(status().isNotFound());
  }
}
