package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FindCollaboratorByIdUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public FindCollaboratorByIdUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional(readOnly = true)
  public CollaboratorResponse execute(Long id) {
    return collaboratorRepository
        .findById(id)
        .map(CollaboratorResponse::from)
        .orElseThrow(() -> new CollaboratorNotFoundException(id));
  }
}
