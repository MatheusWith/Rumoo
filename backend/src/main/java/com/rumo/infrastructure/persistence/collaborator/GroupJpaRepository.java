package com.rumo.infrastructure.persistence.collaborator;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupJpaRepository extends JpaRepository<GroupEntity, Long> {

  Optional<GroupEntity> findByIdAndActiveTrue(Long id);
}
