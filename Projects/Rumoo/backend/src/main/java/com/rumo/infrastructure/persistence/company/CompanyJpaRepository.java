package com.rumo.infrastructure.persistence.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyJpaRepository extends JpaRepository<CompanyEntity, Long> {

    Page<CompanyEntity> findAllByDeletadoEmIsNull(Pageable pageable);

    long countByDeletadoEmIsNull();
}
