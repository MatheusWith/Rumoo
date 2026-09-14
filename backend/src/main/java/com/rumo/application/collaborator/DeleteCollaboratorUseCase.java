package com.rumo.application.collaborator;

import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeleteCollaboratorUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public DeleteCollaboratorUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional
  public void execute(Long id) {
    collaboratorRepository.findById(id).orElseThrow(() -> new CollaboratorNotFoundException(id));
    collaboratorRepository.deactivate(id);
  }
}
