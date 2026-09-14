package com.rumo.application.collaborator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorRequest;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.application.collaborator.dto.CollaboratorUpdateRequest;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CollaboratorUseCaseTest {

  @Mock private ICollaboratorRepository collaboratorRepository;

  @Mock private ICompanyRepository companyRepository;

  private Company activeCompany() {
    Company company = Company.create("Rumoo SA", "12345678000199");
    company.setId(1L);
    return company;
  }

  @Test
  void shouldCreateCollaborator() {
    when(companyRepository.findById(1L)).thenReturn(Optional.of(activeCompany()));
    Collaborator saved = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    saved.setId(10L);
    when(collaboratorRepository.save(any(Collaborator.class))).thenReturn(saved);

    CreateCollaboratorUseCase useCase =
        new CreateCollaboratorUseCase(collaboratorRepository, companyRepository);
    CollaboratorResponse response =
        useCase.execute(new CollaboratorRequest("Alice", "alice@rumoo.com", 1L, null));

    assertThat(response.id()).isEqualTo(10L);
    assertThat(response.name()).isEqualTo("Alice");
    assertThat(response.companyId()).isEqualTo(1L);
    assertThat(response.active()).isTrue();
  }

  @Test
  void shouldThrowWhenCompanyMissingOnCreate() {
    when(companyRepository.findById(99L)).thenReturn(Optional.empty());

    CreateCollaboratorUseCase useCase =
        new CreateCollaboratorUseCase(collaboratorRepository, companyRepository);
    assertThatThrownBy(
            () -> useCase.execute(new CollaboratorRequest("Alice", "a@rumoo.com", 99L, null)))
        .isInstanceOf(CompanyNotFoundException.class)
        .hasMessageContaining("99");
  }

  @Test
  void shouldFindById() {
    Collaborator collaborator = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    collaborator.setId(1L);
    when(collaboratorRepository.findById(1L)).thenReturn(Optional.of(collaborator));

    FindCollaboratorByIdUseCase useCase = new FindCollaboratorByIdUseCase(collaboratorRepository);
    CollaboratorResponse response = useCase.execute(1L);

    assertThat(response.id()).isEqualTo(1L);
    assertThat(response.name()).isEqualTo("Alice");
  }

  @Test
  void shouldThrowWhenFindByIdNotFound() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    FindCollaboratorByIdUseCase useCase = new FindCollaboratorByIdUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(99L))
        .isInstanceOf(CollaboratorNotFoundException.class)
        .hasMessageContaining("99");
  }

  @Test
  void shouldListPaginatedAndFilterByCompanyId() {
    Collaborator c1 = Collaborator.create("Alice", "a@rumoo.com", 1L, null);
    c1.setId(1L);
    Collaborator c2 = Collaborator.create("Bob", "b@rumoo.com", 1L, null);
    c2.setId(2L);
    when(collaboratorRepository.countByCompanyId(1L)).thenReturn(2L);
    when(collaboratorRepository.findAllByCompanyId(1L, 0, 20)).thenReturn(List.of(c1, c2));

    ListCollaboratorsUseCase useCase = new ListCollaboratorsUseCase(collaboratorRepository);
    CollaboratorPage page = useCase.execute(1L, 0, 20);

    assertThat(page.content()).hasSize(2);
    assertThat(page.totalElements()).isEqualTo(2);
    assertThat(page.totalPages()).isEqualTo(1);
  }

  @Test
  void shouldListAllWhenNoCompanyFilter() {
    Collaborator c1 = Collaborator.create("Alice", "a@rumoo.com", 1L, null);
    c1.setId(1L);
    when(collaboratorRepository.count()).thenReturn(1L);
    when(collaboratorRepository.findAll(0, 20)).thenReturn(List.of(c1));

    ListCollaboratorsUseCase useCase = new ListCollaboratorsUseCase(collaboratorRepository);
    CollaboratorPage page = useCase.execute(null, 0, 20);

    assertThat(page.content()).hasSize(1);
    assertThat(page.totalElements()).isEqualTo(1);
  }

  @Test
  void shouldUpdateCollaboratorWithoutChangingCompanyId() {
    Collaborator existing = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    existing.setId(1L);
    when(collaboratorRepository.findById(1L)).thenReturn(Optional.of(existing));
    when(companyRepository.findById(1L)).thenReturn(Optional.of(activeCompany()));
    when(collaboratorRepository.save(any(Collaborator.class))).thenAnswer(i -> i.getArgument(0));

    UpdateCollaboratorUseCase useCase =
        new UpdateCollaboratorUseCase(collaboratorRepository, companyRepository);
    CollaboratorResponse response =
        useCase.execute(1L, new CollaboratorUpdateRequest("New Name", "new@rumoo.com", "sub-123"));

    assertThat(response.name()).isEqualTo("New Name");
    assertThat(response.email()).isEqualTo("new@rumoo.com");
    assertThat(response.keycloakSub()).isEqualTo("sub-123");
    assertThat(response.companyId()).isEqualTo(1L);
  }

  @Test
  void shouldThrowWhenUpdateNotFound() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    UpdateCollaboratorUseCase useCase =
        new UpdateCollaboratorUseCase(collaboratorRepository, companyRepository);
    assertThatThrownBy(
            () -> useCase.execute(99L, new CollaboratorUpdateRequest("New", "n@rumoo.com", null)))
        .isInstanceOf(CollaboratorNotFoundException.class)
        .hasMessageContaining("99");
  }

  @Test
  void shouldThrowWhenUpdateWithInactiveCompany() {
    Collaborator existing = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    existing.setId(1L);
    when(collaboratorRepository.findById(1L)).thenReturn(Optional.of(existing));
    when(companyRepository.findById(1L)).thenReturn(Optional.empty());

    UpdateCollaboratorUseCase useCase =
        new UpdateCollaboratorUseCase(collaboratorRepository, companyRepository);
    assertThatThrownBy(
            () -> useCase.execute(1L, new CollaboratorUpdateRequest("New", "n@rumoo.com", null)))
        .isInstanceOf(CompanyNotFoundException.class)
        .hasMessageContaining("1");
  }

  @Test
  void shouldDeactivateCollaborator() {
    Collaborator collaborator = Collaborator.create("Alice", "alice@rumoo.com", 1L, null);
    collaborator.setId(1L);
    when(collaboratorRepository.findById(1L)).thenReturn(Optional.of(collaborator));

    DeleteCollaboratorUseCase useCase = new DeleteCollaboratorUseCase(collaboratorRepository);
    useCase.execute(1L);

    verify(collaboratorRepository).deactivate(1L);
  }

  @Test
  void shouldThrowWhenDeleteNotFound() {
    when(collaboratorRepository.findById(99L)).thenReturn(Optional.empty());

    DeleteCollaboratorUseCase useCase = new DeleteCollaboratorUseCase(collaboratorRepository);
    assertThatThrownBy(() -> useCase.execute(99L))
        .isInstanceOf(CollaboratorNotFoundException.class)
        .hasMessageContaining("99");
  }
}
