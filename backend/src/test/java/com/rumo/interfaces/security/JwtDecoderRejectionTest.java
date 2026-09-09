package com.rumo.interfaces.security;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

class JwtDecoderRejectionTest {

  private static final String ISSUER = "https://issuer/realms/Rumoo";

  @Test
  void shouldAcceptTokenFromConfiguredIssuerSignedByConfiguredKey() throws Exception {
    RSAKey key = new RSAKeyGenerator(2048).keyID("test-key").generate();
    JwtDecoder decoder = decoderWith(key);

    String token = signedToken(key, ISSUER);

    decoder.decode(token);
  }

  @Test
  void shouldRejectTokenFromUnknownIssuer() throws Exception {
    RSAKey key = new RSAKeyGenerator(2048).keyID("test-key").generate();
    JwtDecoder decoder = decoderWith(key);

    String token = signedToken(key, "https://evil/realms/Rumoo");

    assertThatThrownBy(() -> decoder.decode(token))
        .isInstanceOf(org.springframework.security.oauth2.jwt.JwtException.class);
  }

  @Test
  void shouldRejectTokenWithTamperedSignature() throws Exception {
    RSAKey key = new RSAKeyGenerator(2048).keyID("test-key").generate();
    RSAKey foreignKey = new RSAKeyGenerator(2048).keyID("foreign").generate();
    JwtDecoder decoder = decoderWith(key);

    String token = signedToken(foreignKey, ISSUER);

    assertThatThrownBy(() -> decoder.decode(token))
        .isInstanceOf(org.springframework.security.oauth2.jwt.JwtException.class);
  }

  private JwtDecoder decoderWith(RSAKey key) throws Exception {
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(key.toRSAPublicKey()).build();
    decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(ISSUER));
    return decoder;
  }

  private String signedToken(RSAKey key, String issuer) throws Exception {
    JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(key.getKeyID()).build();
    JWTClaimsSet claims =
        new JWTClaimsSet.Builder().issuer(issuer).subject("user").audience("rumoo-backend").build();
    SignedJWT signedJWT = new SignedJWT(header, claims);
    signedJWT.sign(new RSASSASigner(key));
    return signedJWT.serialize();
  }
}
