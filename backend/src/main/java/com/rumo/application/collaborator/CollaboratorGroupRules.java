package com.rumo.application.collaborator;

import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.CrossCompanyMembershipException;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupNotFoundException;
import com.rumo.domain.collaborator.ICollaboratorRepository;

final class CollaboratorGroupRules {

  private CollaboratorGroupRules() {}

  static Collaborator findCollaborator(ICollaboratorRepository repository, Long collaboratorId) {
    return repository
        .findById(collaboratorId)
        .orElseThrow(() -> new CollaboratorNotFoundException(collaboratorId));
  }

  static Group findGroup(ICollaboratorRepository repository, Long groupId) {
    return repository.findGroupById(groupId).orElseThrow(() -> new GroupNotFoundException(groupId));
  }

  static void validateSameCompany(Collaborator collaborator, Group group) {
    if (!collaborator.getCompanyId().equals(group.getCompanyId())) {
      throw new CrossCompanyMembershipException(collaborator.getCompanyId(), group.getCompanyId());
    }
  }
}
