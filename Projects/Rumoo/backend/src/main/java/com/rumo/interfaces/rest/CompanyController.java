package com.rumo.interfaces.rest;

import com.rumo.application.company.CreateCompanyUseCase;
import com.rumo.application.company.DeleteCompanyUseCase;
import com.rumo.application.company.FindCompanyByIdUseCase;
import com.rumo.application.company.ListCompaniesUseCase;
import com.rumo.application.company.UpdateCompanyUseCase;
import com.rumo.application.company.dto.CompanyPage;
import com.rumo.application.company.dto.CompanyRequest;
import com.rumo.application.company.dto.CompanyResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {

    private final CreateCompanyUseCase createCompanyUseCase;
    private final FindCompanyByIdUseCase findCompanyByIdUseCase;
    private final ListCompaniesUseCase listCompaniesUseCase;
    private final UpdateCompanyUseCase updateCompanyUseCase;
    private final DeleteCompanyUseCase deleteCompanyUseCase;

    public CompanyController(
            CreateCompanyUseCase createCompanyUseCase,
            FindCompanyByIdUseCase findCompanyByIdUseCase,
            ListCompaniesUseCase listCompaniesUseCase,
            UpdateCompanyUseCase updateCompanyUseCase,
            DeleteCompanyUseCase deleteCompanyUseCase
    ) {
        this.createCompanyUseCase = createCompanyUseCase;
        this.findCompanyByIdUseCase = findCompanyByIdUseCase;
        this.listCompaniesUseCase = listCompaniesUseCase;
        this.updateCompanyUseCase = updateCompanyUseCase;
        this.deleteCompanyUseCase = deleteCompanyUseCase;
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> create(@Valid @RequestBody CompanyRequest request) {
        CompanyResponse response = createCompanyUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> findById(@PathVariable Long id) {
        CompanyResponse response = findCompanyByIdUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CompanyPage> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        CompanyPage response = listCompaniesUseCase.execute(page, size);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(@PathVariable Long id, @Valid @RequestBody CompanyRequest request) {
        CompanyResponse response = updateCompanyUseCase.execute(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteCompanyUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
