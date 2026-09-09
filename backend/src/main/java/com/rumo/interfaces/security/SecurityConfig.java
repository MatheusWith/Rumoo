package com.rumo.interfaces.security;

import com.rumo.interfaces.rest.handler.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  private final ObjectMapper objectMapper;

  public SecurityConfig(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.csrf(csrf -> csrf.disable())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .oauth2ResourceServer(
            oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(new JwtRolesConverter())))
        .exceptionHandling(
            exceptions ->
                exceptions
                    .authenticationEntryPoint(this::authenticationEntryPoint)
                    .accessDeniedHandler(this::accessDeniedHandler))
        .build();
  }

  private void authenticationEntryPoint(
      HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
      throws IOException {
    writeError(response, HttpStatus.UNAUTHORIZED, "Authentication is required");
  }

  private void accessDeniedHandler(
      HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception)
      throws IOException {
    writeError(response, HttpStatus.FORBIDDEN, "Access denied");
  }

  private void writeError(HttpServletResponse response, HttpStatus status, String message)
      throws IOException {
    response.setStatus(status.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    objectMapper.writeValue(
        response.getWriter(), ErrorResponse.of(status.value(), status.getReasonPhrase(), message));
  }

  @Bean
  @ConditionalOnMissingBean(JwtDecoder.class)
  JwtDecoder jwtDecoder(
      @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri) {
    validateIssuerUri(issuerUri);
    return JwtDecoders.fromIssuerLocation(issuerUri);
  }

  private void validateIssuerUri(String issuerUri) {
    URI uri = URI.create(issuerUri);
    if (!uri.isAbsolute()) {
      throw new IllegalArgumentException("Issuer URI must be absolute: " + issuerUri);
    }
  }
}
