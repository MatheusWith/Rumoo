package com.rumo.application.collaborator.dto;

import com.rumo.domain.collaborator.GroupRole;
import jakarta.validation.constraints.NotNull;

public record GroupRoleRequest(@NotNull(message = "role is required") GroupRole role) {}
