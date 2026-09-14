package com.rumo.infrastructure.persistence.collaborator;

import com.rumo.domain.collaborator.GroupRole;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "group_memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMembershipEntity {

  @EmbeddedId private GroupMembershipId id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GroupRole role;
}
