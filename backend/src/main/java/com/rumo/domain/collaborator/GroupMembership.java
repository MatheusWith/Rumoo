package com.rumo.domain.collaborator;

public record GroupMembership(Long collaboratorId, Long groupId, GroupRole role) {}
