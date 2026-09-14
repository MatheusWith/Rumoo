package com.rumo.infrastructure.persistence.collaborator;

import com.rumo.domain.collaborator.GroupRole;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupMembershipJpaRepository
    extends JpaRepository<GroupMembershipEntity, GroupMembershipId> {

  Page<GroupMembershipEntity> findAllByIdCollaboratorId(Long collaboratorId, Pageable pageable);

  List<GroupMembershipEntity> findAllByIdCollaboratorId(Long collaboratorId);

  @Modifying
  @Query(
      "DELETE FROM GroupMembershipEntity g "
          + "WHERE g.id.collaboratorId = :collaboratorId AND g.id.groupId = :groupId")
  void deleteById(@Param("collaboratorId") Long collaboratorId, @Param("groupId") Long groupId);

  @Modifying
  @Query(
      "UPDATE GroupMembershipEntity g SET g.role = :role "
          + "WHERE g.id.collaboratorId = :collaboratorId AND g.id.groupId = :groupId")
  void updateRoleById(
      @Param("collaboratorId") Long collaboratorId,
      @Param("groupId") Long groupId,
      @Param("role") GroupRole role);
}
