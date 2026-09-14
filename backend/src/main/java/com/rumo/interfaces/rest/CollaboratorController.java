package com.rumo.interfaces.rest;

import com.rumo.application.collaborator.CreateCollaboratorUseCase;
import com.rumo.application.collaborator.DeleteCollaboratorUseCase;
import com.rumo.application.collaborator.FindCollaboratorByIdUseCase;
import com.rumo.application.collaborator.ListCollaboratorsUseCase;
import com.rumo.application.collaborator.UpdateCollaboratorUseCase;
import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorRequest;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.application.collaborator.dto.CollaboratorUpdateRequest;
import jakarta.validation.Valid;
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
@RequestMapping("/api/v1/collaborators")
public class CollaboratorController {

  private final CreateCollaboratorUseCase createCollaboratorUseCase;
  private final FindCollaboratorByIdUseCase findCollaboratorByIdUseCase;
  private final ListCollaboratorsUseCase listCollaboratorsUseCase;
  private final UpdateCollaboratorUseCase updateCollaboratorUseCase;
  private final DeleteCollaboratorUseCase deleteCollaboratorUseCase;

  public CollaboratorController(
      CreateCollaboratorUseCase createCollaboratorUseCase,
      FindCollaboratorByIdUseCase findCollaboratorByIdUseCase,
      ListCollaboratorsUseCase listCollaboratorsUseCase,
      UpdateCollaboratorUseCase updateCollaboratorUseCase,
      DeleteCollaboratorUseCase deleteCollaboratorUseCase) {
    this.createCollaboratorUseCase = createCollaboratorUseCase;
    this.findCollaboratorByIdUseCase = findCollaboratorByIdUseCase;
    this.listCollaboratorsUseCase = listCollaboratorsUseCase;
    this.updateCollaboratorUseCase = updateCollaboratorUseCase;
    this.deleteCollaboratorUseCase = deleteCollaboratorUseCase;
  }

  @PostMapping
  @PreAuthorize("hasAuthority('collaborator:create')")
  public ResponseEntity<CollaboratorResponse> create(
      @Valid @RequestBody CollaboratorRequest request) {
    CollaboratorResponse response = createCollaboratorUseCase.execute(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('collaborator:read')")
  public ResponseEntity<CollaboratorResponse> findById(@PathVariable Long id) {
    CollaboratorResponse response = findCollaboratorByIdUseCase.execute(id);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  @PreAuthorize("hasAuthority('collaborator:read')")
  public ResponseEntity<CollaboratorPage> findAll(
      @RequestParam Long companyId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    CollaboratorPage response = listCollaboratorsUseCase.execute(companyId, page, size);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('collaborator:update')")
  public ResponseEntity<CollaboratorResponse> update(
      @PathVariable Long id, @Valid @RequestBody CollaboratorUpdateRequest request) {
    CollaboratorResponse response = updateCollaboratorUseCase.execute(id, request);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('collaborator:delete')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    deleteCollaboratorUseCase.execute(id);
    return ResponseEntity.noContent().build();
  }
}
