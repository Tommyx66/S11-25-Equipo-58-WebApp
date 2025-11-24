package com.ecoshop.mapper;

import com.ecoshop.domain.Certification;
import com.ecoshop.dto.CertificationRequest;
import com.ecoshop.dto.CertificationResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidades y DTOs de certificaciones.
 * 
 * Esta clase es responsable de la conversión bidireccional entre:
 * - Certification (entidad JPA) <-> CertificationResponse (objeto de transferencia)
 * - CertificationRequest (DTO de entrada) -> Certification (entidad JPA)
 * 
 * ¿Por qué usar un mapper?
 * - Separación de responsabilidades: las entidades representan la estructura de la BD
 * - Los DTOs representan lo que se expone en la API
 * - Evita exponer detalles internos de la entidad (como relaciones JPA)
 * - Permite cambiar la estructura de la BD sin afectar la API
 * - Facilita la validación y el control de datos expuestos
 * 
 * Patrón usado: Data Transfer Object (DTO) Pattern
 */
@Component // Indica a Spring que esta clase es un componente (bean de Spring)
public class CertificationMapper {

    /**
     * Convierte una entidad Certification a un DTO CertificationResponse.
     * 
     * Este método se usa cuando se necesita enviar datos desde la BD al cliente.
     * Por ejemplo, cuando se consulta una certificación o se lista todas las certificaciones.
     * 
     * Proceso:
     * 1. Verifica que la entidad no sea null (evita NullPointerException)
     * 2. Construye el DTO con todos los campos de la entidad
     * 3. Retorna el DTO listo para ser enviado en la respuesta HTTP
     * 
     * @param certification Entidad Certification de la base de datos
     * @return CertificationResponse listo para enviar al cliente, o null si certification es null
     */
    public CertificationResponse toResponse(Certification certification) {
        // Validación: si la entidad es null, retornamos null
        // Esto evita NullPointerException y permite manejar casos donde no hay datos
        if (certification == null) {
            return null;
        }

        // Construimos el DTO de respuesta con todos los campos de la entidad
        return CertificationResponse.builder()
                .id(certification.getId())
                .name(certification.getName())
                .code(certification.getCode())
                .type(certification.getType())
                .logoUrl(certification.getLogoUrl())
                .createdAt(certification.getCreatedAt())
                .updatedAt(certification.getUpdatedAt())
                .build();
    }

    /**
     * Convierte un DTO CertificationRequest a una entidad Certification.
     * 
     * Este método se usa cuando se necesita crear una nueva certificación
     * a partir de los datos que vienen del cliente.
     * 
     * Proceso:
     * 1. Verifica que el DTO no sea null
     * 2. Normaliza el código (trim) para eliminar espacios en blanco extremos
     * 3. Construye la entidad con todos los campos del DTO
     * 4. Retorna la entidad lista para ser guardada en la BD
     * 
     * Nota importante:
     * - El ID no se asigna (será generado por la BD)
     * - Las fechas createdAt y updatedAt se asignan automáticamente por @PrePersist
     * 
     * @param request CertificationRequest recibido del cliente
     * @return Certification entidad lista para guardar en BD, o null si request es null
     */
    public Certification toEntity(CertificationRequest request) {
        // Validación: si el DTO es null, retornamos null
        if (request == null) {
            return null;
        }

        // Normalizamos el código: eliminamos espacios en blanco extremos y convertimos a mayúsculas
        // Esto asegura consistencia en la base de datos
        String normalizedCode = request.getCode() != null ? request.getCode().trim().toUpperCase() : null;

        // Construimos la entidad con todos los campos del DTO
        // Las fechas se asignan automáticamente mediante @PrePersist en la entidad
        return Certification.builder()
                .name(request.getName())
                .code(normalizedCode)
                .type(request.getType())
                .logoUrl(request.getLogoUrl())
                .build();
    }

    /**
     * Actualiza una entidad Certification existente con los datos de un CertificationRequest.
     * 
     * Este método se usa cuando se necesita actualizar una certificación existente.
     * Actualiza solo los campos que vienen en el request, manteniendo los demás
     * campos de la entidad original (como id, createdAt, etc.).
     * 
     * Proceso:
     * 1. Verifica que la entidad y el request no sean null
     * 2. Normaliza el código (trim) para eliminar espacios en blanco extremos
     * 3. Actualiza los campos modificables de la entidad
     * 4. La fecha updatedAt se actualiza automáticamente por @PreUpdate
     * 
     * Nota importante:
     * - No modifica el ID (se mantiene el original)
     * - No modifica createdAt (se mantiene la fecha original)
     * - updatedAt se actualiza automáticamente mediante @PreUpdate
     * 
     * @param certification Entidad Certification existente a actualizar
     * @param request CertificationRequest con los nuevos datos
     * @throws IllegalArgumentException si certification o request son null
     */
    public void updateEntity(Certification certification, CertificationRequest request) {
        // Validación: si la entidad o el request son null, lanzamos excepción
        if (certification == null) {
            throw new IllegalArgumentException("La certificación no puede ser null");
        }
        if (request == null) {
            throw new IllegalArgumentException("El request no puede ser null");
        }

        // Normalizamos el código: eliminamos espacios en blanco extremos y convertimos a mayúsculas
        // Esto asegura consistencia en la base de datos
        String normalizedCode = request.getCode() != null ? request.getCode().trim().toUpperCase() : null;

        // Actualizamos los campos modificables de la entidad
        certification.setName(request.getName());
        certification.setCode(normalizedCode);
        certification.setType(request.getType());
        certification.setLogoUrl(request.getLogoUrl());
        
        // IMPORTANTE: No modificamos createdAt (se preserva del valor original)
        // La fecha updatedAt se actualiza automáticamente mediante @PreUpdate en la entidad
    }
}
