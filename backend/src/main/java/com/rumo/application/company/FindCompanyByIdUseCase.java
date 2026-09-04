package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FindCompanyByIdUseCase {

    private final ICompanyRepository companyRepository;

    public FindCompanyByIdUseCase(ICompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public CompanyResponse execute(Long id) {
        return companyRepository.findById(id)
                .map(CompanyResponse::from)
                .orElseThrow(() -> new CompanyNotFoundException(id));
    }
}
