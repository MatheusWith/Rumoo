package com.rumo.application.collaborator.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CollaboratorRequest(
    @NotBlank(message = "name is required")
        @Size(min = 1, max = 255, message = "name must be between 1 and 255 characters")
        String name,
    @NotBlank(message = "email is required")
        @Email(message = "email must be a valid email address")
        @Size(max = 255, message = "email must be at most 255 characters")
        String email,
    @NotNull(message = "companyId is required") Long companyId,
    @Size(max = 255, message = "keycloakSub must be at most 255 characters") String keycloakSub) {}
