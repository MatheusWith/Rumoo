package com.rumo.interfaces.rest;

import com.rumo.application.collaborator.AddCollaboratorToGroupUseCase;
import com.rumo.application.collaborator.ChangeCollaboratorRoleUseCase;
import com.rumo.application.collaborator.ListCollaboratorGroupsUseCase;
import com.rumo.application.collaborator.RemoveCollaboratorFromGroupUseCase;
import com.rumo.application.collaborator.dto.GroupMembershipRequest;
import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.application.collaborator.dto.GroupRoleRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/collaborators/{id}/groups")
public class CollaboratorGroupController {

  private final AddCollaboratorToGroupUseCase addCollaboratorToGroupUseCase;
  private final ChangeCollaboratorRoleUseCase changeCollaboratorRoleUseCase;
  private final RemoveCollaboratorFromGroupUseCase removeCollaboratorFromGroupUseCase;
  private final ListCollaboratorGroupsUseCase listCollaboratorGroupsUseCase;

  public CollaboratorGroupController(
      AddCollaboratorToGroupUseCase addCollaboratorToGroupUseCase,
      ChangeCollaboratorRoleUseCase changeCollaboratorRoleUseCase,
      RemoveCollaboratorFromGroupUseCase removeCollaboratorFromGroupUseCase,
      ListCollaboratorGroupsUseCase listCollaboratorGroupsUseCase) {
    this.addCollaboratorToGroupUseCase = addCollaboratorToGroupUseCase;
    this.changeCollaboratorRoleUseCase = changeCollaboratorRoleUseCase;
    this.removeCollaboratorFromGroupUseCase = removeCollaboratorFromGroupUseCase;
    this.listCollaboratorGroupsUseCase = listCollaboratorGroupsUseCase;
  }

  @PostMapping
  @PreAuthorize("hasAuthority('collaborator:update')")
  public ResponseEntity<GroupMembershipResponse> add(
      @PathVariable Long id, @Valid @RequestBody GroupMembershipRequest request) {
    GroupMembershipResponse response =
        addCollaboratorToGroupUseCase.execute(id, request.groupId(), request.role());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PutMapping("/{groupId}")
  @PreAuthorize("hasAuthority('collaborator:update')")
  public ResponseEntity<GroupMembershipResponse> changeRole(
      @PathVariable Long id,
      @PathVariable Long groupId,
      @Valid @RequestBody GroupRoleRequest request) {
    GroupMembershipResponse response =
        changeCollaboratorRoleUseCase.execute(id, groupId, request.role());
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{groupId}")
  @PreAuthorize("hasAuthority('collaborator:update')")
  public ResponseEntity<Void> remove(@PathVariable Long id, @PathVariable Long groupId) {
    removeCollaboratorFromGroupUseCase.execute(id, groupId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  @PreAuthorize("hasAuthority('collaborator:read')")
  public ResponseEntity<List<GroupMembershipResponse>> list(
      @PathVariable Long id,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    List<GroupMembershipResponse> response = listCollaboratorGroupsUseCase.execute(id, page, size);
    return ResponseEntity.ok(response);
  }
}
