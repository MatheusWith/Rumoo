package com.rumo.infrastructure.persistence.collaborator;

import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupMembership;

public class CollaboratorMapper {

  private CollaboratorMapper() {}

  public static CollaboratorEntity toEntity(Collaborator collaborator) {
    return CollaboratorEntity.builder()
        .id(collaborator.getId())
        .name(collaborator.getName())
        .email(collaborator.getEmail())
        .companyId(collaborator.getCompanyId())
        .keycloakSub(collaborator.getKeycloakSub())
        .active(collaborator.isActive())
        .build();
  }

  public static GroupMembershipEntity toEntity(GroupMembership membership) {
    return GroupMembershipEntity.builder()
        .id(new GroupMembershipId(membership.collaboratorId(), membership.groupId()))
        .role(membership.role())
        .build();
  }

  public static Collaborator toDomain(CollaboratorEntity entity) {
    return new Collaborator(
        entity.getId(),
        entity.getName(),
        entity.getEmail(),
        entity.getCompanyId(),
        entity.getKeycloakSub(),
        entity.isActive());
  }

  public static Group toDomain(GroupEntity entity) {
    return new Group(entity.getId(), entity.getName(), entity.getCompanyId(), entity.isActive());
  }

  public static GroupMembership toDomain(GroupMembershipEntity entity) {
    return new GroupMembership(
        entity.getId().getCollaboratorId(), entity.getId().getGroupId(), entity.getRole());
  }
}
