package com.rumo.infrastructure.persistence.company;

import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CompanyRepository implements ICompanyRepository {

    private final CompanyJpaRepository jpaRepository;

    public CompanyRepository(CompanyJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
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
                .filter(e -> e.getDeletadoEm() == null)
                .map(CompanyMapper::toDomain);
    }

    @Override
    public List<Company> findAll() {
        return jpaRepository.findAll().stream()
                .filter(e -> e.getDeletadoEm() == null)
                .map(CompanyMapper::toDomain)
                .toList();
    }

    @Override
    public List<Company> findAll(int offset, int limit) {
        return jpaRepository.findActive(offset, limit).stream()
                .map(CompanyMapper::toDomain)
                .toList();
    }

    @Override
    public long count() {
        return jpaRepository.countActive();
    }

    @Override
    public void delete(Long id) {
        jpaRepository.findById(id).ifPresent(entity -> {
            entity.setDeletadoEm(LocalDateTime.now());
            jpaRepository.save(entity);
        });
    }
}
