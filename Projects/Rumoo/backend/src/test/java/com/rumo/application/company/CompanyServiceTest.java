package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import org.junit.jupiter.api.BeforeEach;
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
class CompanyServiceTest {

    @Mock
    private ICompanyRepository companyRepository;

    private CompanyService companyService;

    @BeforeEach
    void setUp() {
        companyService = new CompanyService(companyRepository);
    }

    @Test
    void shouldCreateCompany() {
        CompanyRequest request = new CompanyRequest("Rumoo SA", "12345678000199");
        Company saved = Company.create("Rumoo SA", "12345678000199");
        saved.setId(1L);
        when(companyRepository.save(any(Company.class))).thenReturn(saved);

        CompanyResponse response = companyService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Rumoo SA");
        assertThat(response.cnpj()).isEqualTo("12345678000199");
        assertThat(response.ativa()).isTrue();
    }

    @Test
    void shouldFindById() {
        Company company = Company.create("Rumoo SA", "12345678000199");
        company.setId(1L);
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        CompanyResponse response = companyService.findById(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Rumoo SA");
    }

    @Test
    void shouldThrowWhenNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyService.findById(99L))
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

        CompanyPage page = companyService.findAll(0, 20);

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

        CompanyResponse response = companyService.update(1L, request);

        assertThat(response.nome()).isEqualTo("New Name");
        assertThat(response.cnpj()).isEqualTo("12345678000199");
    }

    @Test
    void shouldThrowWhenUpdateNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());
        CompanyRequest request = new CompanyRequest("New Name", "12345678000199");

        assertThatThrownBy(() -> companyService.update(99L, request))
                .isInstanceOf(CompanyNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldDeleteCompany() {
        Company company = Company.create("Rumoo SA", "12345678000199");
        company.setId(1L);
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        companyService.delete(1L);

        verify(companyRepository).softDelete(1L);
    }

    @Test
    void shouldThrowWhenDeleteNotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyService.delete(99L))
                .isInstanceOf(CompanyNotFoundException.class)
                .hasMessageContaining("99");
    }
}
