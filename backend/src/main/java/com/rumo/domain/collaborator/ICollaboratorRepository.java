package com.rumo.domain.collaborator;

import java.util.List;
import java.util.Optional;

public interface ICollaboratorRepository {

  Collaborator save(Collaborator collaborator);

  Optional<Collaborator> findById(Long id);

  List<Collaborator> findAll(int page, int size);

  List<Collaborator> findAllByCompanyId(Long companyId, int page, int size);

  long count();

  long countByCompanyId(Long companyId);

  void deactivate(Long id);

  Optional<Group> findGroupById(Long id);

  Optional<GroupMembership> findMembership(Long collaboratorId, Long groupId);

  List<GroupMembership> findAllMembershipsByCollaboratorId(Long collaboratorId, int page, int size);

  GroupMembership saveMembership(GroupMembership membership);

  void removeMembership(Long collaboratorId, Long groupId);

  void changeMembershipRole(Long collaboratorId, Long groupId, GroupRole role);
}
