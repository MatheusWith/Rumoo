package com.rumo.infrastructure.persistence.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyJpaRepository extends JpaRepository<CompanyEntity, Long> {

    Page<CompanyEntity> findAllByActiveTrue(Pageable pageable);

    long countByActiveTrue();

    @Modifying
    @Query("UPDATE CompanyEntity c SET c.active = :active WHERE c.id = :id")
    void updateActiveById(@Param("id") Long id, @Param("active") boolean active);

    @Modifying
    @Query(value = "DELETE FROM companies WHERE id = :id", nativeQuery = true)
    void deleteByIdNative(@Param("id") Long id);
}
