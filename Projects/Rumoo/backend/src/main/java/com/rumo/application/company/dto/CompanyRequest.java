package com.rumo.application.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyRequest(
        @NotBlank(message = "nome is required")
        @Size(min = 1, max = 255, message = "nome must be between 1 and 255 characters")
        String nome,

        @NotBlank(message = "cnpj is required")
        @Size(min = 14, max = 14, message = "cnpj must have exactly 14 characters")
        String cnpj
) {
}
