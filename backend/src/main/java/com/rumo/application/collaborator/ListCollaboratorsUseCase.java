package com.rumo.application.collaborator;

import com.rumo.application.collaborator.dto.CollaboratorPage;
import com.rumo.application.collaborator.dto.CollaboratorResponse;
import com.rumo.domain.collaborator.ICollaboratorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListCollaboratorsUseCase {

  private final ICollaboratorRepository collaboratorRepository;

  public ListCollaboratorsUseCase(ICollaboratorRepository collaboratorRepository) {
    this.collaboratorRepository = collaboratorRepository;
  }

  @Transactional(readOnly = true)
  public CollaboratorPage execute(Long companyId, int page, int size) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 100);
    long total;
    List<CollaboratorResponse> content;
    if (companyId != null) {
      total = collaboratorRepository.countByCompanyId(companyId);
      content =
          collaboratorRepository.findAllByCompanyId(companyId, safePage, safeSize).stream()
              .map(CollaboratorResponse::from)
              .toList();
    } else {
      total = collaboratorRepository.count();
      content =
          collaboratorRepository.findAll(safePage, safeSize).stream()
              .map(CollaboratorResponse::from)
              .toList();
    }
    int totalPages = (int) Math.ceil((double) total / safeSize);
    return new CollaboratorPage(content, safePage, safeSize, total, totalPages);
  }
}
