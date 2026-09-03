package com.rumo.application.company;

import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import com.rumo.domain.company.Company;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    private final ICompanyRepository companyRepository;

    public CompanyService(ICompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        Company company = new Company(null, request.nome(), request.cnpj(), true, null);
        Company saved = companyRepository.save(company);
        return CompanyResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public CompanyResponse findById(Long id) {
        return companyRepository.findById(id)
                .map(CompanyResponse::from)
                .orElseThrow(() -> new CompanyNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public CompanyPage findAll(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        long total = companyRepository.count();
        int offset = safePage * safeSize;
        List<CompanyResponse> content = companyRepository.findAll(offset, safeSize).stream()
                .map(CompanyResponse::from)
                .toList();
        int totalPages = (int) Math.ceil((double) total / safeSize);
        return new CompanyPage(content, safePage, safeSize, total, totalPages);
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));
        existing.setNome(request.nome());
        existing.setCnpj(request.cnpj());
        Company updated = companyRepository.save(existing);
        return CompanyResponse.from(updated);
    }

    @Transactional
    public void delete(Long id) {
        companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));
        companyRepository.delete(id);
    }
}
