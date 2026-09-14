package com.rumo.infrastructure.persistence.collaborator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "collaborators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaboratorEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String email;

  @Column(name = "company_id", nullable = false)
  private Long companyId;

  @Column(name = "keycloak_sub", unique = true)
  private String keycloakSub;

  @Column(nullable = false)
  private boolean active;
}
