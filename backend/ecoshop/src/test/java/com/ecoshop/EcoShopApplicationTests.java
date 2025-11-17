package com.ecoshop;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class EcoShopApplicationTests {

	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void contextLoads() {
		// Verificar que el contexto de Spring se carga correctamente
		assertThat(restTemplate).isNotNull();
	}

	@Test
	void healthEndpointReturnsOk() {
		String response = restTemplate.getForObject("http://localhost:" + port + "/api/v1/health", String.class);
		assertThat(response).isEqualTo("EcoShop API OK");
	}

}
