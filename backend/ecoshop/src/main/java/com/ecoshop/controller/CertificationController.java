package com.ecoshop.controller;

import com.ecoshop.dto.CertificationRequest;
import com.ecoshop.dto.CertificationResponse;
import com.ecoshop.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar certificaciones.
 * 
 * Este controlador expone los endpoints CRUD para la gestión de certificaciones.
 * Todos los endpoints están bajo la ruta base "/api/v1/certifications".
 * 
 * Flujo de datos:
 * 1. El cliente envía una petición HTTP
 * 2. El controlador valida la petición (si aplica)
 * 3. El controlador delega la lógica de negocio al servicio
 * 4. El servicio procesa la petición y retorna un DTO
 * 5. El controlador envía la respuesta HTTP al cliente
 */
@RestController
@RequestMapping("/api/v1/certifications")
@RequiredArgsConstructor // Genera automáticamente un constructor con los campos finales (inyección de dependencias)
public class CertificationController {

    // Inyección de dependencias: Spring proporciona automáticamente una instancia de CertificationService
    private final CertificationService certificationService;

    /**
     * Obtiene todas las certificaciones existentes en la base de datos.
     * 
     * @return ResponseEntity con la lista de certificaciones (CertificationResponse) y código HTTP 200 (OK)
     * 
     * Ejemplo de uso:
     * GET http://localhost:8080/api/v1/certifications
     */
    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getAllCertifications() {
        // Delegamos la lógica al servicio para mantener separación de responsabilidades
        List<CertificationResponse> certifications = certificationService.findAll();
        return ResponseEntity.ok(certifications); // Retorna código HTTP 200 con la lista de certificaciones
    }

    /**
     * Obtiene una certificación específica por su ID.
     * 
     * @param id Identificador único de la certificación
     * @return ResponseEntity con la certificación encontrada (CertificationResponse) y código HTTP 200 (OK)
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     * 
     * Ejemplo de uso:
     * GET http://localhost:8080/api/v1/certifications/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<CertificationResponse> getCertificationById(@PathVariable Long id) {
        // @PathVariable extrae el valor del ID desde la URL
        CertificationResponse certification = certificationService.findById(id);
        return ResponseEntity.ok(certification);
    }

    /**
     * Obtiene una certificación específica por su código único.
     * 
     * @param code Código único de la certificación
     * @return ResponseEntity con la certificación encontrada (CertificationResponse) y código HTTP 200 (OK)
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     * 
     * Ejemplo de uso:
     * GET http://localhost:8080/api/v1/certifications/code/FAIR_TRADE
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<CertificationResponse> getCertificationByCode(@PathVariable String code) {
        // @PathVariable extrae el valor del código desde la URL
        CertificationResponse certification = certificationService.findByCode(code);
        return ResponseEntity.ok(certification);
    }

    /**
     * Crea una nueva certificación en la base de datos.
     * 
     * @param request Datos de la certificación a crear (viene en el cuerpo de la petición)
     * @return ResponseEntity con la certificación creada y código HTTP 201 (CREATED)
     * @throws org.springframework.web.bind.MethodArgumentNotValidException si los datos no son válidos
     * @throws com.ecoshop.exception.BadRequestException si ya existe una certificación con el mismo código
     * 
     * Validaciones aplicadas (definidas en CertificationRequest):
     * - name: obligatorio, máximo 200 caracteres
     * - code: obligatorio, máximo 50 caracteres, único
     * - type: opcional, máximo 50 caracteres
     * - logoUrl: opcional, máximo 500 caracteres
     * 
     * Ejemplo de uso:
     * POST http://localhost:8080/api/v1/certifications
     * Body: { "name": "Fair Trade", "code": "FAIR_TRADE", "type": "SOCIAL", "logoUrl": "https://..." }
     */
    @PostMapping
    public ResponseEntity<CertificationResponse> createCertification(@Valid @RequestBody CertificationRequest request) {
        // @Valid activa las validaciones definidas en CertificationRequest
        // @RequestBody convierte el JSON del cuerpo de la petición a un objeto CertificationRequest
        CertificationResponse createdCertification = certificationService.create(request);
        // Retornamos código HTTP 201 (CREATED) para indicar que se creó un nuevo recurso
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCertification);
    }

    /**
     * Actualiza una certificación existente en la base de datos.
     * 
     * @param id Identificador único de la certificación a actualizar
     * @param request Nuevos datos de la certificación (viene en el cuerpo de la petición)
     * @return ResponseEntity con la certificación actualizada y código HTTP 200 (OK)
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     * @throws org.springframework.web.bind.MethodArgumentNotValidException si los datos no son válidos
     * @throws com.ecoshop.exception.BadRequestException si el nuevo código ya existe en otra certificación
     * 
     * Ejemplo de uso:
     * PUT http://localhost:8080/api/v1/certifications/1
     * Body: { "name": "Fair Trade Updated", "code": "FAIR_TRADE", "type": "SOCIAL", "logoUrl": "https://..." }
     */
    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request) {
        // @Valid activa las validaciones definidas en CertificationRequest
        // @RequestBody convierte el JSON del cuerpo de la petición a un objeto CertificationRequest
        CertificationResponse updatedCertification = certificationService.update(id, request);
        return ResponseEntity.ok(updatedCertification);
    }

    /**
     * Elimina una certificación de la base de datos.
     * 
     * @param id Identificador único de la certificación a eliminar
     * @return ResponseEntity sin contenido y código HTTP 204 (NO_CONTENT)
     * @throws jakarta.persistence.EntityNotFoundException si la certificación no existe
     * 
     * Ejemplo de uso:
     * DELETE http://localhost:8080/api/v1/certifications/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        // @PathVariable extrae el valor del ID desde la URL
        certificationService.delete(id);
        // Retornamos código HTTP 204 (NO_CONTENT) para indicar que la operación fue exitosa
        // pero no hay contenido en la respuesta
        return ResponseEntity.noContent().build();
    }
}
