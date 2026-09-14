package com.rumo.application.collaborator.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Collaborator name: required, 1-255 characters. */
@Documented
@Constraint(validatedBy = {})
@Target({
  ElementType.FIELD,
  ElementType.PARAMETER,
  ElementType.RECORD_COMPONENT,
  ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
@NotBlank(message = "name is required")
@Size(min = 1, max = 255, message = "name must be between 1 and 255 characters")
public @interface CollaboratorName {

  String message() default "name is required";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
