package com.rumo.application.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyRequest(
        @NotBlank(message = "name is required")
        @Size(min = 1, max = 255, message = "name must be between 1 and 255 characters")
        String name,

        @NotBlank(message = "cnpj is required")
        @Size(min = 14, max = 14, message = "cnpj must have exactly 14 characters")
        String cnpj
) {
}
