package com.rumo.infrastructure.persistence.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyJpaRepository extends JpaRepository<CompanyEntity, Long> {

    @Query(value = "SELECT * FROM companies WHERE deletado_em IS NULL ORDER BY id OFFSET :offset LIMIT :limit", nativeQuery = true)
    List<CompanyEntity> findActive(@Param("offset") int offset, @Param("limit") int limit);

    @Query(value = "SELECT COUNT(*) FROM companies WHERE deletado_em IS NULL", nativeQuery = true)
    long countActive();
}
