package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupMembershipNotFoundException;
import com.rumo.domain.collaborator.GroupRole;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChangeCollaboratorRoleUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public ChangeCollaboratorRoleUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional
  public GroupMembershipResponse execute(Long collaboratorId, Long groupId, GroupRole role) {
    Collaborator collaborator =
        CollaboratorGroupRules.findCollaborator(collaboratorRepository, collaboratorId);
    Group group = CollaboratorGroupRules.findGroup(collaboratorRepository, groupId);
    CollaboratorGroupRules.validateSameCompany(collaborator, group);
    collaboratorRepository
        .findMembership(collaboratorId, groupId)
        .orElseThrow(() -> new GroupMembershipNotFoundException(collaboratorId, groupId));
    collaboratorRepository.changeMembershipRole(collaboratorId, groupId, role);
    return new GroupMembershipResponse(groupId, role);
  }
}
