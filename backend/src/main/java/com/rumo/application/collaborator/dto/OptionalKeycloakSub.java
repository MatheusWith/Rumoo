package com.rumo.application.collaborator.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Size;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Optional collaborator keycloakSub: bounded length when present. */
@Documented
@Constraint(validatedBy = {})
@Target({
  ElementType.FIELD,
  ElementType.PARAMETER,
  ElementType.RECORD_COMPONENT,
  ElementType.ANNOTATION_TYPE
})
@Retention(RetentionPolicy.RUNTIME)
@Size(max = 255, message = "keycloakSub must be at most 255 characters")
public @interface OptionalKeycloakSub {

  String message() default "keycloakSub must be at most 255 characters";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
