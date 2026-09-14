package com.rumo.domain.collaborator;

public class GroupMembershipNotFoundException extends RuntimeException {

  public GroupMembershipNotFoundException(Long collaboratorId, Long groupId) {
    super("Group membership not found for collaborator " + collaboratorId + " in group " + groupId);
  }
}
