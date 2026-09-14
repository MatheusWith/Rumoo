package com.rumo.application.collaborator.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Collaborator email: required, valid format, at most 255 characters. */
@Documented
@Constraint(validatedBy = {})
@Target({
  ElementType.FIELD,
  ElementType.PARAMETER,
  ElementType.RECORD_COMPONENT,
  ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
@NotBlank(message = "email is required")
@Email(message = "email must be a valid email address")
@Size(max = 255, message = "email must be at most 255 characters")
public @interface CollaboratorEmail {

  String message() default "email is required";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
