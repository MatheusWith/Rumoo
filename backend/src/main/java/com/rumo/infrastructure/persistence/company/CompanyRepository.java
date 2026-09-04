package com.rumo.infrastructure.persistence.company;

import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class CompanyRepository implements ICompanyRepository {

    private final CompanyJpaRepository jpaRepository;
    private final EntityManager entityManager;

    public CompanyRepository(CompanyJpaRepository jpaRepository, EntityManager entityManager) {
        this.jpaRepository = jpaRepository;
        this.entityManager = entityManager;
    }

    @Override
    public Company save(Company company) {
        CompanyEntity entity = CompanyMapper.toEntity(company);
        CompanyEntity saved = jpaRepository.save(entity);
        return CompanyMapper.toDomain(saved);
    }

    @Override
    public Optional<Company> findById(Long id) {
        return jpaRepository.findById(id)
                .filter(CompanyEntity::isActive)
                .map(CompanyMapper::toDomain);
    }

    @Override
    public List<Company> findAll(int page, int size) {
        return jpaRepository.findAllByActiveTrue(PageRequest.of(page, size))
                .stream()
                .map(CompanyMapper::toDomain)
                .toList();
    }

    @Override
    public long count() {
        return jpaRepository.countByActiveTrue();
    }

    @Override
    @Transactional
    public void deactivate(Long id) {
        jpaRepository.updateActiveById(id, false);
        entityManager.clear();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        jpaRepository.deleteById(id);
        entityManager.clear();
    }
}
