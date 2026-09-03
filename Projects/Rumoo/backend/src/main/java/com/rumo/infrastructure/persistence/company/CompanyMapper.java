package com.rumo.infrastructure.persistence.company;

import com.rumo.domain.company.Company;

public class CompanyMapper {

    private CompanyMapper() {
    }

    public static CompanyEntity toEntity(Company company) {
        return CompanyEntity.builder()
                .id(company.getId())
                .name(company.getName())
                .cnpj(company.getCnpj())
                .active(company.isActive())
                .deletedAt(company.getDeletedAt())
                .build();
    }

    public static Company toDomain(CompanyEntity entity) {
        return new Company(
                entity.getId(),
                entity.getName(),
                entity.getCnpj(),
                entity.isActive(),
                entity.getDeletedAt()
        );
    }
}
