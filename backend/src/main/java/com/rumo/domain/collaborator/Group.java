package com.rumo.domain.collaborator;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Group {

  @Setter private Long id;

  private String name;
  private Long companyId;

  @Setter private boolean active;
}
