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
        Company company = new Company(null, "Rumoo SA", "12345678000199", true, null);

        Company saved = companyRepository.save(company);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getNome()).isEqualTo("Rumoo SA");
        assertThat(saved.isAtiva()).isTrue();
        assertThat(saved.getDeletadoEm()).isNull();

        Optional<Company> found = companyRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getCnpj()).isEqualTo("12345678000199");
    }

    @Test
    void shouldSoftDeleteCompany() {
        Company company = new Company(null, "Rumoo SA", "12345678000198", true, null);
        Company saved = companyRepository.save(company);

        companyRepository.delete(saved.getId());

        assertThat(companyRepository.findById(saved.getId())).isEmpty();
        assertThat(companyRepository.findAll()).doesNotContain(saved);
    }

    @Test
    void shouldListAllWithPagination() {
        companyRepository.save(new Company(null, "Company A", "12345678000101", true, null));
        companyRepository.save(new Company(null, "Company B", "12345678000102", true, null));
        companyRepository.save(new Company(null, "Company C", "12345678000103", true, null));

        List<Company> page = companyRepository.findAll(0, 2);

        assertThat(page).hasSize(2);
        assertThat(companyRepository.count()).isEqualTo(3);
    }
}
