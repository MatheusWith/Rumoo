package com.rumo.application.collaborator.dto;

import com.rumo.domain.collaborator.GroupRole;
import jakarta.validation.constraints.NotNull;

public record GroupMembershipRequest(
    @NotNull(message = "groupId is required") Long groupId,
    @NotNull(message = "role is required") GroupRole role) {}
