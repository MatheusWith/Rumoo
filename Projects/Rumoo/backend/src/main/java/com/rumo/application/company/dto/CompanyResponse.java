package com.rumo.application.company.dto;

import com.rumo.domain.company.Company;

public record CompanyResponse(
        Long id,
        String nome,
        String cnpj,
        boolean ativa
) {
    public static CompanyResponse from(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getNome(),
                company.getCnpj(),
                company.isAtiva()
        );
    }
}
