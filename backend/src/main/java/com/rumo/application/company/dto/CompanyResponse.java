package com.rumo.application.company.dto;

import com.rumo.domain.company.Company;

public record CompanyResponse(
        Long id,
        String name,
        String cnpj,
        boolean active
) {
    public static CompanyResponse from(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getCnpj(),
                company.isActive()
        );
    }
}
