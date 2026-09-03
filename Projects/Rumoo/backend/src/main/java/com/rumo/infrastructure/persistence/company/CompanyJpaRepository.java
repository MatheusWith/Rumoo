package com.rumo.infrastructure.persistence.company;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyJpaRepository extends JpaRepository<CompanyEntity, Long> {

    Page<CompanyEntity> findAllByDeletedAtIsNull(Pageable pageable);

    long countByDeletedAtIsNull();

    @Modifying
    @Query("UPDATE CompanyEntity c SET c.deletedAt = CURRENT_TIMESTAMP WHERE c.id = :id")
    @Transactional
    void softDeleteById(@Param("id") Long id);
}
