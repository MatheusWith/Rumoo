package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyUseCaseTest {

    @Mock
    private ICompanyRepository companyRepository;

    @Test
    void shouldCreateCompany() {
        CompanyRequest request = new CompanyRequest("Rumoo SA", "12345678000199");
        Company saved = Company.create("Rumoo SA", "12345678000199");
        saved.setId(1L);
        when(companyRepository.save(any(Company.class))).thenReturn(saved);

        CreateCompanyUseCase useCase = new CreateCompanyUseCase(companyRepository);
        CompanyResponse response = useCase.execute(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Rumoo SA");
        assertThat(response.cnpj()).isEqualTo("12345678000199");
        assertThat(response.active()).isTrue();
    }

    @Test
    void shouldFindById() {
        Company company = Company.create("Rumoo SA", "12345678000199");
        company.setId(1L);
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        FindCompanyByIdUseCase useCase = new FindCompanyByIdUseCase(companyRepository);
        CompanyResponse response = useCase.execute(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Rumoo SA");
    }

    @Test
    void shouldThrowWhenNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        FindCompanyByIdUseCase useCase = new FindCompanyByIdUseCase(companyRepository);
        assertThatThrownBy(() -> useCase.execute(99L))
                .isInstanceOf(CompanyNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldFindAllPaginated() {
        Company c1 = Company.create("Company A", "12345678000101");
        c1.setId(1L);
        Company c2 = Company.create("Company B", "12345678000102");
        c2.setId(2L);
        when(companyRepository.count()).thenReturn(2L);
        when(companyRepository.findAll(0, 20)).thenReturn(List.of(c1, c2));

        ListCompaniesUseCase useCase = new ListCompaniesUseCase(companyRepository);
        CompanyPage page = useCase.execute(0, 20);

        assertThat(page.content()).hasSize(2);
        assertThat(page.totalElements()).isEqualTo(2);
        assertThat(page.totalPages()).isEqualTo(1);
    }

    @Test
    void shouldUpdateCompany() {
        Company existing = Company.create("Old Name", "12345678000199");
        existing.setId(1L);
        CompanyRequest request = new CompanyRequest("New Name", "12345678000199");
        when(companyRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(companyRepository.save(any(Company.class))).thenAnswer(i -> i.getArgument(0));

        UpdateCompanyUseCase useCase = new UpdateCompanyUseCase(companyRepository);
        CompanyResponse response = useCase.execute(1L, request);

        assertThat(response.name()).isEqualTo("New Name");
        assertThat(response.cnpj()).isEqualTo("12345678000199");
    }

    @Test
    void shouldThrowWhenUpdateNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());
        CompanyRequest request = new CompanyRequest("New Name", "12345678000199");

        UpdateCompanyUseCase useCase = new UpdateCompanyUseCase(companyRepository);
        assertThatThrownBy(() -> useCase.execute(99L, request))
                .isInstanceOf(CompanyNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldDeactivateCompany() {
        Company company = Company.create("Rumoo SA", "12345678000199");
        company.setId(1L);
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        DeleteCompanyUseCase useCase = new DeleteCompanyUseCase(companyRepository);
        useCase.execute(1L);

        verify(companyRepository).deactivate(1L);
    }

    @Test
    void shouldThrowWhenDeleteNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        DeleteCompanyUseCase useCase = new DeleteCompanyUseCase(companyRepository);
        assertThatThrownBy(() -> useCase.execute(99L))
                .isInstanceOf(CompanyNotFoundException.class)
                .hasMessageContaining("99");
    }
}
