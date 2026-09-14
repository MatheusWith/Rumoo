package com.rumo.interfaces.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rumo.application.collaborator.AddCollaboratorToGroupUseCase;
import com.rumo.application.collaborator.ChangeCollaboratorRoleUseCase;
import com.rumo.application.collaborator.CreateCollaboratorUseCase;
import com.rumo.application.collaborator.DeleteCollaboratorUseCase;
import com.rumo.application.collaborator.FindCollaboratorByIdUseCase;
import com.rumo.application.collaborator.ListCollaboratorGroupsUseCase;
import com.rumo.application.collaborator.ListCollaboratorsUseCase;
import com.rumo.application.collaborator.RemoveCollaboratorFromGroupUseCase;
import com.rumo.application.collaborator.UpdateCollaboratorUseCase;
import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorRequest;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.application.collaborator.dto.CollaboratorUpdateRequest;
import com.rumo.application.collaborator.dto.GroupMembershipRequest;
import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.application.collaborator.dto.GroupRoleRequest;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.GroupRole;
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

@WebMvcTest({CollaboratorController.class, CollaboratorGroupController.class})
@Import({TestJwtDecoderConfig.class, SecurityConfig.class})
class CollaboratorAuthorizationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockitoBean private CreateCollaboratorUseCase createCollaboratorUseCase;

  @MockitoBean private FindCollaboratorByIdUseCase findCollaboratorByIdUseCase;

  @MockitoBean private ListCollaboratorsUseCase listCollaboratorsUseCase;

  @MockitoBean private UpdateCollaboratorUseCase updateCollaboratorUseCase;

  @MockitoBean private DeleteCollaboratorUseCase deleteCollaboratorUseCase;

  @MockitoBean private AddCollaboratorToGroupUseCase addCollaboratorToGroupUseCase;

  @MockitoBean private ChangeCollaboratorRoleUseCase changeCollaboratorRoleUseCase;

  @MockitoBean private RemoveCollaboratorFromGroupUseCase removeCollaboratorFromGroupUseCase;

  @MockitoBean private ListCollaboratorGroupsUseCase listCollaboratorGroupsUseCase;

  @Test
  void shouldReturn401WhenNoToken() throws Exception {
    mockMvc.perform(get("/api/v1/collaborators")).andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturn401WhenTokenFromUnknownIssuer() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.foreignIssuerBearer("user")))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturn401WhenSignatureTampered() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.tamperedSignatureBearer("user")))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldAllowReadForCollaboratorReader() throws Exception {
    CollaboratorPage page = new CollaboratorPage(List.of(), 0, 20, 0, 0);
    when(listCollaboratorsUseCase.execute(null, 0, 20)).thenReturn(page);

    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenNoReaderRole() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:create")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldReturn403WhenNoRolesAtAll() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowCreateForCollaboratorCreator() throws Exception {
    CollaboratorRequest request = new CollaboratorRequest("Alice", "alice@rumoo.com", 1L, null);
    when(createCollaboratorUseCase.execute(any(CollaboratorRequest.class)))
        .thenReturn(new CollaboratorResponse(1L, "Alice", "alice@rumoo.com", 1L, null, true));

    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:create"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated());
  }

  @Test
  void shouldReturn403WhenCreatingWithoutCollaboratorCreate() throws Exception {
    CollaboratorRequest request = new CollaboratorRequest("Alice", "alice@rumoo.com", 1L, null);

    mockMvc
        .perform(
            post("/api/v1/collaborators")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowUpdateForCollaboratorUpdater() throws Exception {
    when(updateCollaboratorUseCase.execute(eq(1L), any(CollaboratorUpdateRequest.class)))
        .thenReturn(new CollaboratorResponse(1L, "New", "new@rumoo.com", 1L, null, true));

    mockMvc
        .perform(
            put("/api/v1/collaborators/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new CollaboratorUpdateRequest("New", "new@rumoo.com", null))))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenUpdatingWithoutCollaboratorUpdate() throws Exception {
    mockMvc
        .perform(
            put("/api/v1/collaborators/1")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new CollaboratorUpdateRequest("New", "new@rumoo.com", null))))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowDeleteForCollaboratorDeleter() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:delete")))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldReturn403WhenDeletingWithoutCollaboratorDelete() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldReturn404WithReaderRoleOnMissingCollaborator() throws Exception {
    when(findCollaboratorByIdUseCase.execute(99L))
        .thenThrow(new CollaboratorNotFoundException(99L));

    mockMvc
        .perform(
            get("/api/v1/collaborators/99")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isNotFound());
  }

  @Test
  void shouldAllowAddToGroupWithCollaboratorUpdate() throws Exception {
    when(addCollaboratorToGroupUseCase.execute(1L, 20L, GroupRole.MEMBER))
        .thenReturn(new GroupMembershipResponse(20L, GroupRole.MEMBER));

    mockMvc
        .perform(
            post("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new GroupMembershipRequest(20L, GroupRole.MEMBER))))
        .andExpect(status().isCreated());
  }

  @Test
  void shouldReturn403WhenAddingToGroupWithoutCollaboratorUpdate() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new GroupMembershipRequest(20L, GroupRole.MEMBER))))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowRoleChangeWithCollaboratorUpdate() throws Exception {
    when(changeCollaboratorRoleUseCase.execute(1L, 20L, GroupRole.LEADER))
        .thenReturn(new GroupMembershipResponse(20L, GroupRole.LEADER));

    mockMvc
        .perform(
            put("/api/v1/collaborators/1/groups/20")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new GroupRoleRequest(GroupRole.LEADER))))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenChangingRoleWithoutCollaboratorUpdate() throws Exception {
    mockMvc
        .perform(
            put("/api/v1/collaborators/1/groups/20")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new GroupRoleRequest(GroupRole.LEADER))))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowRemoveFromGroupWithCollaboratorUpdate() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1/groups/20")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update")))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldReturn403WhenRemovingFromGroupWithoutCollaboratorUpdate() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1/groups/20")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isForbidden());
  }

  @Test
  void shouldAllowListGroupsWithCollaboratorRead() throws Exception {
    when(listCollaboratorGroupsUseCase.execute(1L, 0, 20))
        .thenReturn(List.of(new GroupMembershipResponse(20L, GroupRole.LEADER)));

    mockMvc
        .perform(
            get("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturn403WhenListingGroupsWithoutCollaboratorRead() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/collaborators/1/groups")
                .header(
                    HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:update")))
        .andExpect(status().isForbidden());
  }
}
