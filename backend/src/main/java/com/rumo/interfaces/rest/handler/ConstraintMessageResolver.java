package com.rumo.interfaces.rest.handler;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;

final class ConstraintMessageResolver {

  private static final Map<String, String> CONSTRAINT_MESSAGES =
      Map.of(
          "uk_collaborators_company_email",
          "Email already exists for this company",
          "uk_collaborators_keycloak_sub",
          "Keycloak identity is already linked to another collaborator",
          "group_memberships_pkey",
          "Collaborator is already a member of this group");

  private ConstraintMessageResolver() {}

  static String resolve(DataIntegrityViolationException ex) {
    Throwable rootCause = ex.getRootCause();
    String rootMessage = rootCause != null ? String.valueOf(rootCause.getMessage()) : "";
    for (Map.Entry<String, String> entry : CONSTRAINT_MESSAGES.entrySet()) {
      if (rootMessage.contains(entry.getKey())) {
        return entry.getValue();
      }
    }
    return "A record with the same unique value already exists";
  }
}
