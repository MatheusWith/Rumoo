package com.rumo.infrastructure.persistence.collaborator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.rumo.TestcontainersConfig;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupMembership;
import com.rumo.domain.collaborator.GroupRole;
import com.rumo.domain.company.Company;
import com.rumo.infrastructure.persistence.company.CompanyRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@Import(TestcontainersConfig.class)
@Transactional
class CollaboratorRepositoryTest {

  @MockitoBean private JwtDecoder jwtDecoder;

  @Autowired private CollaboratorRepository collaboratorRepository;

  @Autowired private CompanyRepository companyRepository;

  @Autowired private GroupJpaRepository groupJpaRepository;

  private Company saveCompany(String cnpj) {
    return companyRepository.save(Company.create("Rumoo " + cnpj, cnpj));
  }

  private Group saveGroup(Long companyId, String name) {
    GroupEntity entity = GroupEntity.builder().name(name).companyId(companyId).active(true).build();
    return toDomainGroup(groupJpaRepository.save(entity));
  }

  private static Group toDomainGroup(GroupEntity entity) {
    return new Group(entity.getId(), entity.getName(), entity.getCompanyId(), entity.isActive());
  }

  @Test
  void shouldSaveAndFindCollaborator() {
    Company company = saveCompany("12345678000199");
    Collaborator collaborator =
        Collaborator.create("Alice", "alice@rumoo.com", company.getId(), null);

    Collaborator saved = collaboratorRepository.save(collaborator);

    assertThat(saved.getId()).isNotNull();
    assertThat(saved.isActive()).isTrue();

    Optional<Collaborator> found = collaboratorRepository.findById(saved.getId());
    assertThat(found).isPresent();
    assertThat(found.get().getName()).isEqualTo("Alice");
    assertThat(found.get().getCompanyId()).isEqualTo(company.getId());
  }

  @Test
  void shouldRejectDuplicateEmailWithinCompany() {
    Company company = saveCompany("12345678000198");
    collaboratorRepository.save(
        Collaborator.create("Alice", "dup@rumoo.com", company.getId(), null));

    assertThatThrownBy(
            () ->
                collaboratorRepository.save(
                    Collaborator.create("Bob", "dup@rumoo.com", company.getId(), null)))
        .isInstanceOf(DataIntegrityViolationException.class);
  }

  @Test
  void shouldAllowSameEmailInDifferentCompanies() {
    Company companyA = saveCompany("12345678000197");
    Company companyB = saveCompany("12345678000196");

    collaboratorRepository.save(
        Collaborator.create("Alice", "shared@rumoo.com", companyA.getId(), null));
    Collaborator saved =
        collaboratorRepository.save(
            Collaborator.create("Alice", "shared@rumoo.com", companyB.getId(), null));

    assertThat(saved.getId()).isNotNull();
  }

  @Test
  void shouldDeactivateAndHideFromFind() {
    Company company = saveCompany("12345678000195");
    Collaborator saved =
        collaboratorRepository.save(
            Collaborator.create("Alice", "alice2@rumoo.com", company.getId(), null));

    collaboratorRepository.deactivate(saved.getId());

    assertThat(collaboratorRepository.findById(saved.getId())).isEmpty();
  }

  @Test
  void shouldListAndFilterByCompanyId() {
    Company companyA = saveCompany("12345678000194");
    Company companyB = saveCompany("12345678000193");
    collaboratorRepository.save(
        Collaborator.create("Alice", "a@rumoo.com", companyA.getId(), null));
    collaboratorRepository.save(Collaborator.create("Bob", "b@rumoo.com", companyA.getId(), null));
    collaboratorRepository.save(
        Collaborator.create("Carol", "c@rumoo.com", companyB.getId(), null));

    List<Collaborator> all = collaboratorRepository.findAll(0, 10);
    List<Collaborator> inA = collaboratorRepository.findAllByCompanyId(companyA.getId(), 0, 10);

    assertThat(all).hasSize(3);
    assertThat(inA).hasSize(2);
    assertThat(collaboratorRepository.countByCompanyId(companyA.getId())).isEqualTo(2);
    assertThat(collaboratorRepository.count()).isEqualTo(3);
  }

  @Test
  void shouldManageGroupMemberships() {
    Company company = saveCompany("12345678000192");
    Collaborator saved =
        collaboratorRepository.save(
            Collaborator.create("Alice", "alice3@rumoo.com", company.getId(), null));
    Group group = saveGroup(company.getId(), "Marketing");

    GroupMembership membership =
        collaboratorRepository.saveMembership(
            new GroupMembership(saved.getId(), group.getId(), GroupRole.MEMBER));

    assertThat(membership.role()).isEqualTo(GroupRole.MEMBER);
    assertThat(collaboratorRepository.findMembership(saved.getId(), group.getId())).isPresent();

    collaboratorRepository.changeMembershipRole(saved.getId(), group.getId(), GroupRole.LEADER);
    assertThat(collaboratorRepository.findMembership(saved.getId(), group.getId()))
        .get()
        .extracting(GroupMembership::role)
        .isEqualTo(GroupRole.LEADER);

    List<GroupMembership> memberships =
        collaboratorRepository.findAllMembershipsByCollaboratorId(saved.getId(), 0, 20);
    assertThat(memberships).hasSize(1);

    collaboratorRepository.removeMembership(saved.getId(), group.getId());
    assertThat(collaboratorRepository.findMembership(saved.getId(), group.getId())).isEmpty();
  }

  @Test
  void shouldFindActiveGroupById() {
    Company company = saveCompany("12345678000191");
    Group active = saveGroup(company.getId(), "Active");

    Optional<Group> found = collaboratorRepository.findGroupById(active.getId());
    assertThat(found).isPresent();
    assertThat(found.get().getCompanyId()).isEqualTo(company.getId());

    GroupEntity inactive =
        GroupEntity.builder().name("Inactive").companyId(company.getId()).active(false).build();
    GroupEntity savedInactive = groupJpaRepository.save(inactive);
    assertThat(collaboratorRepository.findGroupById(savedInactive.getId())).isEmpty();
  }
}
