package com.ecoshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de solicitud para crear y actualizar certificaciones.
 * 
 * Este DTO se usa para recibir datos del cliente cuando se crea o actualiza
 * una certificación. Incluye validaciones Bean Validation que se aplican
 * automáticamente cuando se usa @Valid en el controlador.
 * 
 * Campos:
 * - name: Nombre de la certificación (obligatorio, máximo 200 caracteres)
 * - code: Código único de la certificación (obligatorio, único, máximo 50 caracteres)
 * - type: Tipo de certificación (opcional, máximo 50 caracteres)
 * - logoUrl: URL del logo de la certificación (opcional, máximo 500 caracteres)
 * 
 * Validaciones:
 * Las anotaciones de validación (@NotBlank, @Size, etc.) se activan
 * automáticamente cuando se usa @Valid en el controlador. Si la validación
 * falla, se lanza MethodArgumentNotValidException.
 */
@Data // Genera automáticamente getters, setters, toString, equals y hashCode (Lombok)
@Builder // Permite construir objetos usando el patrón Builder (Lombok)
@NoArgsConstructor // Genera constructor sin argumentos
@AllArgsConstructor // Genera constructor con todos los argumentos (Lombok)
public class CertificationRequest {

    /**
     * Nombre de la certificación.
     * 
     * @NotBlank: El campo no puede estar vacío ni ser null
     * @Size: Longitud máxima de 200 caracteres
     * 
     * Ejemplos válidos:
     * - "Fair Trade"
     * - "Carbon Neutral"
     * - "Organic"
     * 
     * Ejemplos inválidos:
     * - "" (vacío)
     * - "   " (solo espacios en blanco)
     * - null
     */
    @NotBlank(message = "El nombre de la certificación es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String name;

    /**
     * Código único de la certificación.
     * 
     * @NotBlank: El campo no puede estar vacío ni ser null
     * @Size: Longitud máxima de 50 caracteres
     * 
     * IMPORTANTE: Este código debe ser único en la base de datos. La validación
     * de unicidad se realiza en el servicio, no en el DTO.
     * 
     * El código se normaliza (trim) antes de validar la unicidad para evitar
     * espacios en blanco extremos.
     * 
     * Ejemplos válidos:
     * - "FAIR_TRADE"
     * - "CARBON_NEUTRAL"
     * - "ORGANIC"
     * 
     * Ejemplos inválidos:
     * - "" (vacío)
     * - "   " (solo espacios en blanco)
     * - null
     */
    @NotBlank(message = "El código de la certificación es obligatorio")
    @Size(max = 50, message = "El código no puede exceder 50 caracteres")
    private String code;

    /**
     * Tipo de certificación.
     * 
     * Campo opcional que permite categorizar las certificaciones.
     * Si se proporciona, no puede exceder 50 caracteres.
     * 
     * Ejemplos:
     * - "CARBONO"
     * - "SOCIAL"
     * - "AMBIENTAL"
     * - "ORGANICO"
     */
    @Size(max = 50, message = "El tipo no puede exceder 50 caracteres")
    private String type;

    /**
     * URL del logo de la certificación.
     * 
     * Campo opcional que almacena la dirección del logo de la certificación.
     * Útil para mostrar el logo en el frontend.
     * 
     * Si se proporciona, no puede exceder 500 caracteres.
     */
    @Size(max = 500, message = "La URL del logo no puede exceder 500 caracteres")
    private String logoUrl;
}

