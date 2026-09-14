package com.rumo.application.collaborator.dto;

import com.rumo.domain.collaborator.GroupMembership;
import com.rumo.domain.collaborator.GroupRole;

public record GroupMembershipResponse(Long groupId, GroupRole role) {

  public static GroupMembershipResponse from(GroupMembership membership) {
    return new GroupMembershipResponse(membership.groupId(), membership.role());
  }
}
