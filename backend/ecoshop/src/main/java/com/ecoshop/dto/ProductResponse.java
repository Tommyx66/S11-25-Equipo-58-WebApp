package com.ecoshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de respuesta para productos.
 * 
 * Este DTO se usa para exponer la información de productos
 * en las respuestas GET de la API. Sigue el formato exacto
 * especificado en los requerimientos del proyecto.
 * 
 * Formato de respuesta JSON:
 * {
 *   "id": 1,
 *   "nombre": "Botella reutilizable EcoLife",
 *   "marca": "EcoLife",
 *   "precio": 14990,
 *   "impactoAmbiental": {
 *     "huellaCarbono": "0.8 kg CO₂",
 *     "materialesReciclables": true,
 *     "nivel": "Bajo impacto ambiental"
 *   },
 *   "imagen": "url-del-producto",
 *   "certificaciones": ["Fair Trade", "Carbon Neutral"],
 *   "fechaCreacion": "2024-01-15T10:30:00"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    /**
     * Identificador único del producto.
     */
    private Long id;

    /**
     * Nombre del producto.
     */
    private String nombre;

    /**
     * Marca del producto.
     */
    private String marca;

    /**
     * Precio del producto.
     */
    private BigDecimal precio;

    /**
     * Información sobre el impacto ambiental del producto.
     */
    private ImpactoAmbientalResponse impactoAmbiental;

    /**
     * URL de la imagen del producto.
     */
    private String imagen;

    /**
     * Lista de certificaciones del producto.
     * 
     * Ejemplos: ["Fair Trade", "Carbon Neutral"]
     */
    private List<String> certificaciones;

    /**
     * Fecha de creación del producto.
     * 
     * Se asigna automáticamente cuando se crea el producto.
     */
    private LocalDateTime fechaCreacion;
}

