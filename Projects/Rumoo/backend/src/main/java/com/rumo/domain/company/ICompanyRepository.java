package com.rumo.domain.company;

import java.util.List;
import java.util.Optional;

public interface ICompanyRepository {

    Company save(Company company);

    Optional<Company> findById(Long id);

    List<Company> findAll(int page, int size);

    long count();

    void deactivate(Long id);

    void delete(Long id);
}
