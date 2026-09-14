package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.application.collaborator.dto.CollaboratorUpdateRequest;
import com.rumo.domain.collaborator.Collaborator;
import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateCollaboratorUseCase {

  private final ICollaboratorRepository collaboratorRepository;
  private final ICompanyRepository companyRepository;

  public UpdateCollaboratorUseCase(
      ICollaboratorRepository collaboratorRepository, ICompanyRepository companyRepository) {
    this.collaboratorRepository = collaboratorRepository;
    this.companyRepository = companyRepository;
  }

  @Transactional
  public CollaboratorResponse execute(Long id, CollaboratorUpdateRequest request) {
    Collaborator existing =
        collaboratorRepository
            .findById(id)
            .orElseThrow(() -> new CollaboratorNotFoundException(id));
    companyRepository
        .findById(existing.getCompanyId())
        .orElseThrow(() -> new CompanyNotFoundException(existing.getCompanyId()));
    existing.update(request.name(), request.email(), request.keycloakSub());
    Collaborator updated = collaboratorRepository.save(existing);
    return CollaboratorResponse.from(updated);
  }
}
