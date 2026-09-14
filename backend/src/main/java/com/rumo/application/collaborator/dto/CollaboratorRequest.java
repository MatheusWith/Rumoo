package com.rumo.application.collaborator.dto;

import jakarta.validation.constraints.NotNull;

public record CollaboratorRequest(
    @CollaboratorName String name,
    @CollaboratorEmail String email,
    @NotNull(message = "companyId is required") Long companyId,
    @OptionalKeycloakSub String keycloakSub) {}
