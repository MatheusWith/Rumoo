package com.rumo.infrastructure.persistence.collaborator;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CollaboratorJpaRepository extends JpaRepository<CollaboratorEntity, Long> {

  Page<CollaboratorEntity> findAllByActiveTrue(Pageable pageable);

  Page<CollaboratorEntity> findAllByActiveTrueAndCompanyId(Long companyId, Pageable pageable);

  long countByActiveTrue();

  long countByActiveTrueAndCompanyId(Long companyId);

  @Modifying
  @Query("UPDATE CollaboratorEntity c SET c.active = :active WHERE c.id = :id")
  void updateActiveById(@Param("id") Long id, @Param("active") boolean active);
}
