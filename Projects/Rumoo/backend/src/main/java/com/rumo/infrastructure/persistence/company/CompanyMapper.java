package com.rumo.infrastructure.persistence.company;

import com.rumo.domain.company.Company;

public class CompanyMapper {

    private CompanyMapper() {
    }

    public static CompanyEntity toEntity(Company company) {
        return CompanyEntity.builder()
                .id(company.getId())
                .nome(company.getNome())
                .cnpj(company.getCnpj())
                .ativa(company.isAtiva())
                .deletadoEm(company.getDeletadoEm())
                .build();
    }

    public static Company toDomain(CompanyEntity entity) {
        return new Company(
                entity.getId(),
                entity.getNome(),
                entity.getCnpj(),
                entity.isAtiva(),
                entity.getDeletadoEm()
        );
    }
}
