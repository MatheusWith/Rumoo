package com.rumo.interfaces.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

class JwtRolesConverterTest {

  private final JwtRolesConverter converter = new JwtRolesConverter();

  @Test
  void shouldConvertRealmRolesToAuthorities() {
    Jwt jwt = jwtWithRoles("company:read", "company:create");

    var roles =
        converter.convert(jwt).getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

    assertThat(roles).containsExactlyInAnyOrder("company:read", "company:create");
  }

  @Test
  void shouldProduceEmptyAuthoritiesWhenNoRealmAccess() {
    Jwt jwt = jwt();

    assertThat(converter.convert(jwt).getAuthorities()).isEmpty();
  }

  @Test
  void shouldProduceEmptyAuthoritiesWhenNoRolesClaim() {
    Jwt jwt = jwtBuilder().claim("realm_access", Map.of("scope", "openid")).build();

    assertThat(converter.convert(jwt).getAuthorities()).isEmpty();
  }

  private Jwt jwtWithRoles(String... roles) {
    return jwtBuilder().claim("realm_access", Map.of("roles", List.of(roles))).build();
  }

  private Jwt jwt() {
    return jwtBuilder().build();
  }

  private Jwt.Builder jwtBuilder() {
    Instant now = Instant.now();
    return Jwt.withTokenValue("token")
        .header("alg", "RS256")
        .issuer("https://issuer/realms/Rumoo")
        .issuedAt(now)
        .expiresAt(now.plusSeconds(300))
        .subject("user");
  }
}
