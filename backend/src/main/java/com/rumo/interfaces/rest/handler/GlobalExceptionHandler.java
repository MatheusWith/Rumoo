package com.rumo.interfaces.rest.handler;

import com.rumo.domain.collaborator.CollaboratorNotFoundException;
import com.rumo.domain.collaborator.CrossCompanyMembershipException;
import com.rumo.domain.collaborator.GroupMembershipNotFoundException;
import com.rumo.domain.collaborator.GroupNotFoundException;
import com.rumo.domain.company.CompanyNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(AuthorizationDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(AuthorizationDeniedException ex) {
    return buildResponse(HttpStatus.FORBIDDEN, "Access denied");
  }

  @ExceptionHandler(CompanyNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(CompanyNotFoundException ex) {
    return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler({
    CollaboratorNotFoundException.class,
    GroupNotFoundException.class,
    GroupMembershipNotFoundException.class,
    CrossCompanyMembershipException.class
  })
  public ResponseEntity<ErrorResponse> handleCollaboratorModuleNotFound(RuntimeException ex) {
    return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException ex) {
    return buildResponse(HttpStatus.CONFLICT, ConstraintMessageResolver.resolve(ex));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(HttpMessageNotReadableException ex) {
    return buildResponse(HttpStatus.BAD_REQUEST, "Invalid request body");
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .reduce((a, b) -> a + "; " + b)
            .orElse("Validation failed");
    return buildResponse(HttpStatus.BAD_REQUEST, message);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
  }

  private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
    return ResponseEntity.status(status)
        .body(ErrorResponse.of(status.value(), status.getReasonPhrase(), message));
  }
}
