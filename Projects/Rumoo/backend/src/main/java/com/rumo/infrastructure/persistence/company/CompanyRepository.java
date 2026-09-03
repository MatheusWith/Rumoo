package com.rumo.infrastructure.persistence.company;

import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

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
    public List<Company> findAll(int page, int size) {
        return jpaRepository.findAllByDeletadoEmIsNull(PageRequest.of(page, size))
                .stream()
                .map(CompanyMapper::toDomain)
                .toList();
    }

    @Override
    public long count() {
        return jpaRepository.countByDeletadoEmIsNull();
    }

    @Override
    public void softDelete(Long id) {
        jpaRepository.findById(id).ifPresent(entity -> {
            Company domain = CompanyMapper.toDomain(entity);
            domain.softDelete();
            jpaRepository.save(CompanyMapper.toEntity(domain));
        });
    }
}
