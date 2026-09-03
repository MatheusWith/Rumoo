package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ListCompaniesUseCase {

    private final ICompanyRepository companyRepository;

    public ListCompaniesUseCase(ICompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public CompanyPage execute(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        long total = companyRepository.count();
        List<CompanyResponse> content = companyRepository.findAll(safePage, safeSize).stream()
                .map(CompanyResponse::from)
                .toList();
        int totalPages = (int) Math.ceil((double) total / safeSize);
        return new CompanyPage(content, safePage, safeSize, total, totalPages);
    }
}
