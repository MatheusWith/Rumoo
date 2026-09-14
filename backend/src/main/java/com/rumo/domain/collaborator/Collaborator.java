package com.rumo.domain.collaborator;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Collaborator {

  @Setter private Long id;

  private String name;
  private String email;
  private Long companyId;

  @Setter private String keycloakSub;

  @Setter private boolean active;

  public static Collaborator create(String name, String email, Long companyId, String keycloakSub) {
    return new Collaborator(null, name, email, companyId, keycloakSub, true);
  }

  public Collaborator update(String name, String email, String keycloakSub) {
    this.name = name;
    this.email = email;
    this.keycloakSub = keycloakSub;
    return this;
  }

  public void deactivate() {
    this.active = false;
  }
}
