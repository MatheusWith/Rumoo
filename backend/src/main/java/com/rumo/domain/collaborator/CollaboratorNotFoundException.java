package com.rumo.domain.collaborator;

public class CollaboratorNotFoundException extends RuntimeException {

  public CollaboratorNotFoundException(Long id) {
    super("Collaborator not found with id: " + id);
  }
}
