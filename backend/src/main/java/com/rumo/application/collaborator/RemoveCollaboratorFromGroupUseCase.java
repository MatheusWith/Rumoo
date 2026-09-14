package com.rumo.application.collaborator;

import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RemoveCollaboratorFromGroupUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public RemoveCollaboratorFromGroupUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional
  public void execute(Long collaboratorId, Long groupId) {
    Collaborator collaborator =
        CollaboratorGroupRules.findCollaborator(collaboratorRepository, collaboratorId);
    Group group = CollaboratorGroupRules.findGroup(collaboratorRepository, groupId);
    CollaboratorGroupRules.validateSameCompany(collaborator, group);
    collaboratorRepository.removeMembership(collaborator.getId(), groupId);
  }
}
