package com.rumo.domain.company;

import java.time.LocalDateTime;

public class Company {

    private Long id;
    private String nome;
    private String cnpj;
    private boolean ativa;
    private LocalDateTime deletadoEm;

    public Company(Long id, String nome, String cnpj, boolean ativa, LocalDateTime deletadoEm) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.ativa = ativa;
        this.deletadoEm = deletadoEm;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }

    public LocalDateTime getDeletadoEm() {
        return deletadoEm;
    }

    public void setDeletadoEm(LocalDateTime deletadoEm) {
        this.deletadoEm = deletadoEm;
    }
}
