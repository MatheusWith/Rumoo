package com.rumo.domain.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Setter
    private Long id;

    private String name;
    private String cnpj;

    @Setter
    private boolean active;

    private LocalDateTime deletedAt;

    public static Company create(String name, String cnpj) {
        return new Company(null, name, cnpj, true, null);
    }

    public Company update(String name, String cnpj) {
        this.name = name;
        this.cnpj = cnpj;
        return this;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
