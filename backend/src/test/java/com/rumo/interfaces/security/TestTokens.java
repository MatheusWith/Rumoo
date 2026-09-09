package com.rumo.interfaces.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.List;
import java.util.Map;

public final class TestTokens {

  public static final String ISSUER = "https://issuer/realms/Rumoo";

  private static final RSAKey RSA_KEY = generateKey("test-key");
  private static final RSAKey FOREIGN_RSA_KEY = generateKey("foreign-key");

  private TestTokens() {}

  public static RSAPublicKey publicKey() {
    try {
      return RSA_KEY.toRSAPublicKey();
    } catch (Exception e) {
      throw new IllegalStateException("Failed to export public key", e);
    }
  }

  public static String bearer(String subject, String... roles) {
    return "Bearer " + signed(subject, ISSUER, RSA_KEY, roles);
  }

  public static String foreignIssuerBearer(String subject) {
    return "Bearer " + signed(subject, "https://evil/realms/Rumoo", RSA_KEY);
  }

  public static String tamperedSignatureBearer(String subject) {
    return "Bearer " + signed(subject, ISSUER, FOREIGN_RSA_KEY);
  }

  private static String signed(String subject, String issuer, RSAKey signingKey, String... roles) {
    try {
      JWSHeader header =
          new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(signingKey.getKeyID()).build();
      JWTClaimsSet.Builder claims =
          new JWTClaimsSet.Builder()
              .issuer(issuer)
              .subject(subject)
              .issueTime(new Date())
              .expirationTime(new Date(System.currentTimeMillis() + 300_000));
      if (roles != null) {
        claims.claim("realm_access", Map.of("roles", List.of(roles)));
      }
      SignedJWT signedJWT = new SignedJWT(header, claims.build());
      signedJWT.sign(new RSASSASigner(signingKey));
      return signedJWT.serialize();
    } catch (Exception e) {
      throw new IllegalStateException("Failed to sign test token", e);
    }
  }

  private static RSAKey generateKey(String keyId) {
    try {
      return new RSAKeyGenerator(2048).keyID(keyId).generate();
    } catch (Exception e) {
      throw new IllegalStateException("Failed to generate test key", e);
    }
  }
}
