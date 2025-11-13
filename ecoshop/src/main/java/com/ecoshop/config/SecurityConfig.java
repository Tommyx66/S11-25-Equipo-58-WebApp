package com.ecoshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de seguridad de Spring Security.
 * 
 * Esta clase configura la seguridad de la aplicación, incluyendo:
 * - Autenticación y autorización
 * - Configuración de CORS (Cross-Origin Resource Sharing)
 * - Configuración de CSRF (Cross-Site Request Forgery)
 * - Gestión de sesiones
 * 
 * Configuración actual:
 * - CSRF deshabilitado: Para APIs REST no es necesario (usar tokens JWT en producción)
 * - CORS habilitado: Permite solicitudes desde diferentes orígenes
 * - Sesiones stateless: No se mantiene estado de sesión (típico para APIs REST)
 * - Endpoints públicos: /api/v1/health y /api/v1/products/** no requieren autenticación
 * 
 * IMPORTANTE para producción:
 * - Configurar dominios específicos en CORS (no usar "*")
 * - Implementar autenticación JWT para endpoints protegidos
 * - Configurar HTTPS
 * - Revisar y ajustar las políticas de seguridad
 */
@Configuration // Indica que esta clase contiene configuración de Spring
@EnableWebSecurity // Habilita la configuración de seguridad web
public class SecurityConfig {

    /**
     * Configura la cadena de filtros de seguridad.
     * 
     * Este método define cómo Spring Security maneja las solicitudes HTTP.
     * 
     * Configuraciones aplicadas:
     * 1. CSRF deshabilitado: Para APIs REST no se necesita protección CSRF
     *    (en producción, usar tokens JWT en su lugar)
     * 
     * 2. CORS habilitado: Permite solicitudes desde diferentes orígenes
     *    (configurado en el método corsConfigurationSource())
     * 
     * 3. Sesiones stateless: No se mantiene estado de sesión entre solicitudes
     *    (típico para APIs REST, cada solicitud es independiente)
     * 
     * 4. Autorización de endpoints:
     *    - /api/v1/health: Público (permite acceso sin autenticación)
     *    - /api/v1/products/**: Público (permite acceso sin autenticación)
     *    - Cualquier otra ruta: Requiere autenticación (aunque actualmente no hay autenticación configurada)
     * 
     * @param http Objeto HttpSecurity para configurar la seguridad
     * @return SecurityFilterChain configurado
     * @throws Exception Si hay un error en la configuración
     */
    @Bean // Indica que este método devuelve un bean de Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilita CSRF (Cross-Site Request Forgery)
                // Para APIs REST no es necesario, ya que no usamos cookies de sesión
                // En producción, usar tokens JWT para autenticación
                .csrf(AbstractHttpConfigurer::disable)
                
                // Habilita CORS y configura la fuente de configuración
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configura la gestión de sesiones como stateless
                // No se mantiene estado de sesión entre solicitudes (típico para APIs REST)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configura la autorización de endpoints
                .authorizeHttpRequests(auth -> auth
                        // Estos endpoints son públicos (no requieren autenticación)
                        .requestMatchers("/api/v1/health", "/api/v1/products/**").permitAll()
                        // Cualquier otra solicitud requiere autenticación
                        // (actualmente no hay autenticación configurada, así que esto no tiene efecto)
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    /**
     * Configura la fuente de configuración de CORS.
     * 
     * CORS (Cross-Origin Resource Sharing) permite que el navegador permita
     * solicitudes desde diferentes orígenes (dominios, puertos, protocolos).
     * 
     * Configuración actual:
     * - Orígenes permitidos: Todos (*) - ⚠️ Cambiar en producción
     * - Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS
     * - Headers permitidos: Todos (*)
     * - Headers expuestos: Authorization, Content-Type
     * - Credenciales: No permitidas (allowCredentials = false)
     * - Tiempo de caché: 3600 segundos (1 hora)
     * 
     * IMPORTANTE para producción:
     * - Especificar dominios específicos en lugar de "*"
     * - Ejemplo: configuration.setAllowedOrigins(Arrays.asList("https://frontend.com", "https://www.frontend.com"))
     * - Revisar y ajustar según las necesidades de seguridad
     * 
     * @return CorsConfigurationSource configurado
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // En producción, especificar dominios específicos en lugar de "*"
        // Ejemplo: configuration.setAllowedOrigins(Arrays.asList("https://frontend.com"))
        configuration.setAllowedOrigins(List.of("*")); // Permite todos los orígenes
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers permitidos en las solicitudes
        configuration.setAllowedHeaders(List.of("*")); // Permite todos los headers
        
        // Headers que el cliente puede leer en la respuesta
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // No permite credenciales (cookies, autenticación HTTP) en las solicitudes
        // Si necesitas enviar credenciales, cambiar a true y especificar orígenes específicos
        configuration.setAllowCredentials(false);
        
        // Tiempo que el navegador puede cachear la respuesta de la preflight (OPTIONS)
        // 3600 segundos = 1 hora
        configuration.setMaxAge(3600L);

        // Registra la configuración de CORS para todas las rutas ("/**")
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

