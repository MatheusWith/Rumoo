package com.rumo.interfaces.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rumo.application.collaborator.AddCollaboratorToGroupUseCase;
import com.rumo.application.collaborator.ChangeCollaboratorRoleUseCase;
import com.rumo.application.collaborator.ListCollaboratorGroupsUseCase;
import com.rumo.application.collaborator.RemoveCollaboratorFromGroupUseCase;
import com.rumo.application.collaborator.dto.GroupMembershipRequest;
import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.application.collaborator.dto.GroupRoleRequest;
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

@WebMvcTest(CollaboratorGroupController.class)
@Import({TestJwtDecoderConfig.class, SecurityConfig.class})
class CollaboratorGroupControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockitoBean private AddCollaboratorToGroupUseCase addCollaboratorToGroupUseCase;
  @MockitoBean private ChangeCollaboratorRoleUseCase changeCollaboratorRoleUseCase;
  @MockitoBean private RemoveCollaboratorFromGroupUseCase removeCollaboratorFromGroupUseCase;
  @MockitoBean private ListCollaboratorGroupsUseCase listCollaboratorGroupsUseCase;

  private static final String AUTH = TestTokens.bearer("user", "collaborator:update");

  @Test
  void shouldAddCollaboratorToGroup() throws Exception {
    when(addCollaboratorToGroupUseCase.execute(1L, 20L, GroupRole.MEMBER))
        .thenReturn(new GroupMembershipResponse(20L, GroupRole.MEMBER));

    mockMvc
        .perform(
            post("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new GroupMembershipRequest(20L, GroupRole.MEMBER))))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.groupId").value(20L))
        .andExpect(jsonPath("$.role").value("MEMBER"));
  }

  @Test
  void shouldChangeRole() throws Exception {
    when(changeCollaboratorRoleUseCase.execute(1L, 20L, GroupRole.LEADER))
        .thenReturn(new GroupMembershipResponse(20L, GroupRole.LEADER));

    mockMvc
        .perform(
            put("/api/v1/collaborators/1/groups/20")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new GroupRoleRequest(GroupRole.LEADER))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.role").value("LEADER"));
  }

  @Test
  void shouldRemoveFromGroup() throws Exception {
    mockMvc
        .perform(
            delete("/api/v1/collaborators/1/groups/20").header(HttpHeaders.AUTHORIZATION, AUTH))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldListGroups() throws Exception {
    when(listCollaboratorGroupsUseCase.execute(1L, 0, 20))
        .thenReturn(List.of(new GroupMembershipResponse(20L, GroupRole.LEADER)));

    mockMvc
        .perform(
            get("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, TestTokens.bearer("user", "collaborator:read")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].groupId").value(20L))
        .andExpect(jsonPath("$[0].role").value("LEADER"));
  }

  @Test
  void shouldReturn400WhenRoleInvalid() throws Exception {
    String body = "{\"groupId\":20,\"role\":\"BOSS\"}";

    mockMvc
        .perform(
            post("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());
  }

  @Test
  void shouldReturn400WhenRoleMissing() throws Exception {
    String body = "{\"groupId\":20}";

    mockMvc
        .perform(
            post("/api/v1/collaborators/1/groups")
                .header(HttpHeaders.AUTHORIZATION, AUTH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());
  }
}
