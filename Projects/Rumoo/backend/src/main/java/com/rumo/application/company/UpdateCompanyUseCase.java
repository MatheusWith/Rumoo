package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateCompanyUseCase {

    private final ICompanyRepository companyRepository;

    public UpdateCompanyUseCase(ICompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public CompanyResponse execute(Long id, CompanyRequest request) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));
        existing.update(request.name(), request.cnpj());
        Company updated = companyRepository.save(existing);
        return CompanyResponse.from(updated);
    }
}
