package com.rumo.domain.collaborator;

public class CrossCompanyMembershipException extends RuntimeException {

  public CrossCompanyMembershipException(Long collaboratorCompanyId, Long groupCompanyId) {
    super(
        "Group belongs to a different company than the collaborator "
            + "(group company: "
            + groupCompanyId
            + ", collaborator company: "
            + collaboratorCompanyId
            + ")");
  }
}
