package com.rumo.application.collaborator.dto;

import java.util.List;

public record CollaboratorPage(
    List<CollaboratorResponse> content, int page, int size, long totalElements, int totalPages) {}
