package com.rumo.infrastructure.persistence.company;

import com.rumo.TestcontainersConfig;
import com.rumo.domain.company.Company;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfig.class)
@Transactional
class CompanyRepositoryTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    void shouldSaveAndFindCompany() {
        Company company = Company.create("Rumoo SA", "12345678000199");

        Company saved = companyRepository.save(company);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Rumoo SA");
        assertThat(saved.isActive()).isTrue();

        Optional<Company> found = companyRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getCnpj()).isEqualTo("12345678000199");
    }

    @Test
    void shouldDeactivateCompany() {
        Company company = Company.create("Rumoo SA", "12345678000198");
        Company saved = companyRepository.save(company);

        companyRepository.deactivate(saved.getId());

        assertThat(companyRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    void deactivateNonexistentIdShouldNotThrow() {
        companyRepository.deactivate(99999L);
    }

    @Test
    void shouldDeleteCompanyPermanently() {
        Company company = Company.create("Rumoo SA", "12345678000197");
        Company saved = companyRepository.save(company);

        companyRepository.delete(saved.getId());
    }

    @Test
    void shouldNotFindDeactivatedCompanyInList() {
        Company active = Company.create("Active", "12345678000101");
        Company deactivated = Company.create("Deactivated", "12345678000102");
        companyRepository.save(active);
        Company savedDeactivated = companyRepository.save(deactivated);

        companyRepository.deactivate(savedDeactivated.getId());

        List<Company> page = companyRepository.findAll(0, 10);
        assertThat(page).hasSize(1);
        assertThat(page.get(0).getName()).isEqualTo("Active");
    }

    @Test
    void shouldListAllWithPagination() {
        companyRepository.save(Company.create("Company A", "12345678000103"));
        companyRepository.save(Company.create("Company B", "12345678000104"));
        companyRepository.save(Company.create("Company C", "12345678000105"));

        List<Company> page = companyRepository.findAll(0, 2);

        assertThat(page).hasSize(2);
        assertThat(companyRepository.count()).isEqualTo(3);
    }
}
