package com.ecoshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO de respuesta para certificaciones.
 * 
 * Este DTO se usa para exponer la información de certificaciones
 * en las respuestas de la API. No expone la entidad directamente
 * para mantener el desacoplamiento entre la capa de dominio y la API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationResponse {

    /**
     * Identificador único de la certificación.
     */
    private Long id;

    /**
     * Nombre de la certificación.
     * 
     * Ejemplos: "Fair Trade", "Carbon Neutral", "Organic"
     */
    private String name;

    /**
     * Código único de la certificación.
     * 
     * Ejemplos: "FAIR_TRADE", "CARBON_NEUTRAL", "ORGANIC"
     */
    private String code;

    /**
     * Tipo de certificación.
     * 
     * Ejemplos: "CARBONO", "SOCIAL", "AMBIENTAL", "ORGANICO"
     */
    private String type;

    /**
     * URL del logo de la certificación.
     */
    private String logoUrl;

    /**
     * Fecha de creación de la certificación.
     * 
     * Se asigna automáticamente cuando se crea la certificación.
     */
    private LocalDateTime createdAt;

    /**
     * Fecha de última actualización de la certificación.
     * 
     * Se actualiza automáticamente cuando se modifica la certificación.
     */
    private LocalDateTime updatedAt;
}

