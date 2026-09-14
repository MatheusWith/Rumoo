package com.rumo.application.collaborator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rumo.application.collaborator.dto.GroupMembershipResponse;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.CrossCompanyMembershipException;
import com.rumo.domain.collaborator.Group;
import com.rumo.domain.collaborator.GroupMembership;
import com.rumo.domain.collaborator.GroupMembershipNotFoundException;
import com.rumo.domain.collaborator.GroupNotFoundException;
import com.rumo.domain.collaborator.GroupRole;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CollaboratorGroupUseCaseTest {

  @Mock private ICollaboratorRepository collaboratorRepository;

  private Collaborator collaborator;
  private Group group;

  @BeforeEach
  void setUp() {
    collaborator = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    collaborator.setId(10L);
    group = new Group(20L, "Marketing", 1L, true);
  }

  @Test
  void shouldAddCollaboratorToGroup() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(20L)).thenReturn(Optional.of(group));
    when(collaboratorRepository.saveMembership(any(GroupMembership.class)))
        .thenReturn(new GroupMembership(10L, 20L, GroupRole.MEMBER));

    AddCollaboratorToGroupUseCase useCase =
        new AddCollaboratorToGroupUseCase(collaboratorRepository);
    GroupMembershipResponse response = useCase.execute(10L, 20L, GroupRole.MEMBER);

    assertThat(response.groupId()).isEqualTo(20L);
    assertThat(response.role()).isEqualTo(GroupRole.MEMBER);
    verify(collaboratorRepository).saveMembership(new GroupMembership(10L, 20L, GroupRole.MEMBER));
  }

  @Test
  void shouldThrowCrossCompanyWhenGroupBelongsToAnotherCompany() {
    group = new Group(21L, "Marketing", 2L, true);
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(21L)).thenReturn(Optional.of(group));

    AddCollaboratorToGroupUseCase useCase =
        new AddCollaboratorToGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 21L, GroupRole.MEMBER))
        .isInstanceOf(CrossCompanyMembershipException.class);
  }

  @Test
  void shouldThrowWhenCollaboratorMissingOnAdd() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    AddCollaboratorToGroupUseCase useCase =
        new AddCollaboratorToGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(99L, 20L, GroupRole.MEMBER))
        .isInstanceOf(CollaboratorNotFoundException.class);
  }

  @Test
  void shouldThrowWhenGroupMissingOnAdd() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(99L)).thenReturn(Optional.empty());

    AddCollaboratorToGroupUseCase useCase =
        new AddCollaboratorToGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 99L, GroupRole.MEMBER))
        .isInstanceOf(GroupNotFoundException.class);
  }

  @Test
  void shouldChangeRole() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(20L)).thenReturn(Optional.of(group));
    when(collaboratorRepository.findMembership(10L, 20L))
        .thenReturn(Optional.of(new GroupMembership(10L, 20L, GroupRole.MEMBER)));

    ChangeCollaboratorRoleUseCase useCase =
        new ChangeCollaboratorRoleUseCase(collaboratorRepository);
    GroupMembershipResponse response = useCase.execute(10L, 20L, GroupRole.LEADER);

    assertThat(response.role()).isEqualTo(GroupRole.LEADER);
    verify(collaboratorRepository).changeMembershipRole(10L, 20L, GroupRole.LEADER);
  }

  @Test
  void shouldThrowWhenMembershipMissingOnChangeRole() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(20L)).thenReturn(Optional.of(group));
    when(collaboratorRepository.findMembership(10L, 20L)).thenReturn(Optional.empty());

    ChangeCollaboratorRoleUseCase useCase =
        new ChangeCollaboratorRoleUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 20L, GroupRole.LEADER))
        .isInstanceOf(GroupMembershipNotFoundException.class);
  }

  @Test
  void shouldThrowWhenGroupCrossCompanyOnChangeRole() {
    group = new Group(21L, "Marketing", 2L, true);
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(21L)).thenReturn(Optional.of(group));

    ChangeCollaboratorRoleUseCase useCase =
        new ChangeCollaboratorRoleUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 21L, GroupRole.LEADER))
        .isInstanceOf(CrossCompanyMembershipException.class);
  }

  @Test
  void shouldRemoveFromGroup() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(20L)).thenReturn(Optional.of(group));

    RemoveCollaboratorFromGroupUseCase useCase =
        new RemoveCollaboratorFromGroupUseCase(collaboratorRepository);
    useCase.execute(10L, 20L);

    verify(collaboratorRepository).removeMembership(10L, 20L);
  }

  @Test
  void shouldThrowCrossCompanyOnRemove() {
    group = new Group(21L, "Marketing", 2L, true);
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(21L)).thenReturn(Optional.of(group));

    RemoveCollaboratorFromGroupUseCase useCase =
        new RemoveCollaboratorFromGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 21L))
        .isInstanceOf(CrossCompanyMembershipException.class);
  }

  @Test
  void shouldThrowWhenCollaboratorMissingOnRemove() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    RemoveCollaboratorFromGroupUseCase useCase =
        new RemoveCollaboratorFromGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(99L, 20L))
        .isInstanceOf(CollaboratorNotFoundException.class);
  }

  @Test
  void shouldThrowWhenGroupMissingOnRemove() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findGroupById(99L)).thenReturn(Optional.empty());

    RemoveCollaboratorFromGroupUseCase useCase =
        new RemoveCollaboratorFromGroupUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(10L, 99L)).isInstanceOf(GroupNotFoundException.class);
  }

  @Test
  void shouldListMemberships() {
    when(collaboratorRepository.findById(10L)).thenReturn(Optional.of(collaborator));
    when(collaboratorRepository.findAllMembershipsByCollaboratorId(10L, 0, 20))
        .thenReturn(List.of(new GroupMembership(10L, 20L, GroupRole.LEADER)));

    ListCollaboratorGroupsUseCase useCase =
        new ListCollaboratorGroupsUseCase(collaboratorRepository);
    List<GroupMembershipResponse> memberships = useCase.execute(10L, 0, 20);

    assertThat(memberships).hasSize(1);
    assertThat(memberships.get(0).groupId()).isEqualTo(20L);
    assertThat(memberships.get(0).role()).isEqualTo(GroupRole.LEADER);
  }

  @Test
  void shouldThrowWhenCollaboratorMissingOnList() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    ListCollaboratorGroupsUseCase useCase =
        new ListCollaboratorGroupsUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(99L, 0, 20))
        .isInstanceOf(CollaboratorNotFoundException.class);
  }
}
