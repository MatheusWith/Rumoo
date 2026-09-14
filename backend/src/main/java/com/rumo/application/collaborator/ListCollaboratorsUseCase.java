package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import com.rumo.domain.company.CompanyNotFoundException;
import com.rumo.domain.company.ICompanyRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListCollaboratorsUseCase {

  private final ICollaboratorRepository collaboratorRepository;
  private final ICompanyRepository companyRepository;

  public ListCollaboratorsUseCase(
      ICollaboratorRepository collaboratorRepository, ICompanyRepository companyRepository) {
    this.collaboratorRepository = collaboratorRepository;
    this.companyRepository = companyRepository;
  }

  @Transactional(readOnly = true)
  public CollaboratorPage execute(Long companyId, int page, int size) {
    companyRepository
        .findById(companyId)
        .orElseThrow(() -> new CompanyNotFoundException(companyId));
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 100);
    long total = collaboratorRepository.countByCompanyId(companyId);
    List<CollaboratorResponse> content =
        collaboratorRepository.findAllByCompanyId(companyId, safePage, safeSize).stream()
            .map(CollaboratorResponse::from)
            .toList();
    int totalPages = (int) Math.ceil((double) total / safeSize);
    return new CollaboratorPage(content, safePage, safeSize, total, totalPages);
  }
}
