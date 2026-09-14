package com.rumo.infrastructure.persistence.collaborator;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class GroupMembershipId implements Serializable {

  @Column(name = "collaborator_id")
  private Long collaboratorId;

  @Column(name = "group_id")
  private Long groupId;
}
