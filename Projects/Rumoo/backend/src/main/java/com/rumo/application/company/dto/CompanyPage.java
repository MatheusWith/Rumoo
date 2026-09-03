package com.rumo.application.company.dto;

import java.util.List;

public record CompanyPage(
        List<CompanyResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
