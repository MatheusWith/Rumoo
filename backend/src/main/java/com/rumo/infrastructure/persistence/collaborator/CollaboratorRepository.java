package com.rumo.infrastructure.persistence.collaborator;

import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupMembership;
import com.rumo.domain.collaborator.GroupRole;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
// PMD class-level cyclomatic complexity: the port exposes many trivial delegating methods by
// design, so the summed method count exceeds PMD's classReportLevel of 10 without any method
// being individually complex. Kept as one aggregate contract per the approved spec instead of
// splitting into two ports.
@SuppressWarnings("PMD.CyclomaticComplexity")
public class CollaboratorRepository implements ICollaboratorRepository {

  private final CollaboratorJpaRepository jpaRepository;
  private final GroupJpaRepository groupJpaRepository;
  private final GroupMembershipJpaRepository membershipJpaRepository;
  private final EntityManager entityManager;

  public CollaboratorRepository(
      CollaboratorJpaRepository jpaRepository,
      GroupJpaRepository groupJpaRepository,
      GroupMembershipJpaRepository membershipJpaRepository,
      EntityManager entityManager) {
    this.jpaRepository = jpaRepository;
    this.groupJpaRepository = groupJpaRepository;
    this.membershipJpaRepository = membershipJpaRepository;
    this.entityManager = entityManager;
  }

  @Override
  public Collaborator save(Collaborator collaborator) {
    CollaboratorEntity saved = jpaRepository.save(CollaboratorMapper.toEntity(collaborator));
    return CollaboratorMapper.toDomain(saved);
  }

  @Override
  public Optional<Collaborator> findById(Long id) {
    return jpaRepository
        .findById(id)
        .filter(CollaboratorEntity::isActive)
        .map(CollaboratorMapper::toDomain);
  }

  @Override
  public List<Collaborator> findAll(int page, int size) {
    return jpaRepository.findAllByActiveTrue(PageRequest.of(page, size)).stream()
        .map(CollaboratorMapper::toDomain)
        .toList();
  }

  @Override
  public List<Collaborator> findAllByCompanyId(Long companyId, int page, int size) {
    return jpaRepository
        .findAllByActiveTrueAndCompanyId(companyId, PageRequest.of(page, size))
        .stream()
        .map(CollaboratorMapper::toDomain)
        .toList();
  }

  @Override
  public long count() {
    return jpaRepository.countByActiveTrue();
  }

  @Override
  public long countByCompanyId(Long companyId) {
    return jpaRepository.countByActiveTrueAndCompanyId(companyId);
  }

  @Override
  @Transactional
  public void deactivate(Long id) {
    jpaRepository.updateActiveById(id, false);
    entityManager.clear();
  }

  @Override
  public Optional<Group> findGroupById(Long id) {
    return groupJpaRepository.findByIdAndActiveTrue(id).map(CollaboratorMapper::toDomain);
  }

  @Override
  public Optional<GroupMembership> findMembership(Long collaboratorId, Long groupId) {
    return membershipJpaRepository
        .findById(new GroupMembershipId(collaboratorId, groupId))
        .map(CollaboratorMapper::toDomain);
  }

  @Override
  public List<GroupMembership> findAllMembershipsByCollaboratorId(
      Long collaboratorId, int page, int size) {
    return membershipJpaRepository
        .findAllByIdCollaboratorId(collaboratorId, PageRequest.of(page, size))
        .stream()
        .map(CollaboratorMapper::toDomain)
        .toList();
  }

  @Override
  public GroupMembership saveMembership(GroupMembership membership) {
    GroupMembershipEntity saved =
        membershipJpaRepository.save(CollaboratorMapper.toEntity(membership));
    return CollaboratorMapper.toDomain(saved);
  }

  @Override
  @Transactional
  public void removeMembership(Long collaboratorId, Long groupId) {
    membershipJpaRepository.deleteById(collaboratorId, groupId);
    entityManager.clear();
  }

  @Override
  @Transactional
  public void changeMembershipRole(Long collaboratorId, Long groupId, GroupRole role) {
    membershipJpaRepository.updateRoleById(collaboratorId, groupId, role);
    entityManager.clear();
  }
}
