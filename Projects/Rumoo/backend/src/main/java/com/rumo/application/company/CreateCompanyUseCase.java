package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCompanyUseCase {

    private final ICompanyRepository companyRepository;

    public CreateCompanyUseCase(ICompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public CompanyResponse execute(CompanyRequest request) {
        Company company = Company.create(request.name(), request.cnpj());
        Company saved = companyRepository.save(company);
        return CompanyResponse.from(saved);
    }
}
