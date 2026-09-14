package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListCollaboratorGroupsUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public ListCollaboratorGroupsUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional(readOnly = true)
  public List<GroupMembershipResponse> execute(Long collaboratorId, int page, int size) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 100);
    CollaboratorGroupRules.findCollaborator(collaboratorRepository, collaboratorId);
    return collaboratorRepository
        .findAllMembershipsByCollaboratorId(collaboratorId, safePage, safeSize)
        .stream()
        .map(GroupMembershipResponse::from)
        .toList();
  }
}
