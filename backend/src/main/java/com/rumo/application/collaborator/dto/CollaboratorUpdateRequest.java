package com.rumo.application.collaborator.dto;

public record CollaboratorUpdateRequest(
    @CollaboratorName String name,
    @CollaboratorEmail String email,
    @OptionalKeycloakSub String keycloakSub) {}
