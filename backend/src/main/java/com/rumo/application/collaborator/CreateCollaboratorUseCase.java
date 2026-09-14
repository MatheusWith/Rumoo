package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.CollaboratorRequest;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCollaboratorUseCase {

  private final ICollaboratorRepository collaboratorRepository;
  private final ICompanyRepository companyRepository;

  public CreateCollaboratorUseCase(
      ICollaboratorRepository collaboratorRepository, ICompanyRepository companyRepository) {
    this.collaboratorRepository = collaboratorRepository;
    this.companyRepository = companyRepository;
  }

  @Transactional
  public CollaboratorResponse execute(CollaboratorRequest request) {
    companyRepository
        .findById(request.companyId())
        .orElseThrow(() -> new CompanyNotFoundException(request.companyId()));
    Collaborator collaborator =
        Collaborator.create(
            request.name(), request.email(), request.companyId(), request.keycloakSub());
    Collaborator saved = collaboratorRepository.save(collaborator);
    return CollaboratorResponse.from(saved);
  }
}
