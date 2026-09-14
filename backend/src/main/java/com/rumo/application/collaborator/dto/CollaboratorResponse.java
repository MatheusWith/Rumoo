package com.rumo.application.collaborator.dto;

import com.rumo.domain.collaborator.Collaborator;

public record CollaboratorResponse(
    Long id, String name, String email, Long companyId, String keycloakSub, boolean active) {

  public static CollaboratorResponse from(Collaborator collaborator) {
    return new CollaboratorResponse(
        collaborator.getId(),
        collaborator.getName(),
        collaborator.getEmail(),
        collaborator.getCompanyId(),
        collaborator.getKeycloakSub(),
        collaborator.isActive());
  }
}
