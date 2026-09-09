package com.rumo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@Import(TestcontainersConfig.class)
class RumooApplicationTests {

  @MockitoBean private JwtDecoder jwtDecoder;

  @Test
  void contextLoads() {}
}
