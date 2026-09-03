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

    private String nome;
    private String cnpj;

    @Setter
    private boolean ativa;

    private LocalDateTime deletadoEm;

    public static Company create(String nome, String cnpj) {
        return new Company(null, nome, cnpj, true, null);
    }

    public Company update(String nome, String cnpj) {
        this.nome = nome;
        this.cnpj = cnpj;
        return this;
    }

    public Company softDelete() {
        this.deletadoEm = LocalDateTime.now();
        return this;
    }
}
