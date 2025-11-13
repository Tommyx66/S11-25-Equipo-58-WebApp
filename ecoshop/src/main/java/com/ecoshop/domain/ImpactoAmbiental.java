package com.ecoshop.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase embeddable que representa el impacto ambiental de un producto.
 * 
 * Esta clase NO es una entidad separada, sino que sus campos se almacenan
 * directamente en la tabla de productos. Es útil para agrupar campos relacionados
 * sin necesidad de crear una relación de base de datos.
 * 
 * ¿Por qué usar @Embeddable?
 * - Agrupa campos relacionados lógicamente (impacto ambiental)
 * - Simplifica el código al no necesitar una relación JPA separada
 * - Mejora el rendimiento al evitar joins innecesarios
 * - Los campos se almacenan en la misma tabla que Product
 * 
 * Campos en la base de datos (tabla products):
 * - huella_carbono: Huella de carbono del producto (ej: "0.8kg CO₂")
 * - materiales_reciclables: Indica si los materiales son reciclables (true/false)
 * - nivel: Nivel de impacto ambiental (ej: "Bajo impacto ambiental")
 * 
 * Esta clase se usa en la entidad Product mediante la anotación @Embedded.
 */
@Embeddable // Indica que esta clase puede ser embebida en otras entidades
@Data // Genera automáticamente getters, setters, toString, equals y hashCode (Lombok)
@Builder // Permite construir objetos usando el patrón Builder (Lombok)
@NoArgsConstructor // Genera constructor sin argumentos (requerido por JPA)
@AllArgsConstructor // Genera constructor con todos los argumentos (Lombok)
public class ImpactoAmbiental {

    /**
     * Huella de carbono del producto.
     * 
     * Representa la cantidad de emisiones de CO₂ asociadas al producto.
     * Ejemplos: "0.8kg CO₂", "1.2kg CO₂", etc.
     */
    @Column(name = "huella_carbono", length = 50) // Nombre de columna en BD, máximo 50 caracteres
    private String huellaCarbono;

    /**
     * Indica si los materiales del producto son reciclables.
     * 
     * true: Los materiales son reciclables
     * false: Los materiales no son reciclables
     * null: No se ha especificado esta información
     */
    @Column(name = "materiales_reciclables") // Nombre de columna en BD
    private Boolean materialesReciclables;

    /**
     * Nivel de impacto ambiental del producto.
     * 
     * Describe el nivel general de impacto ambiental.
     * Ejemplos: "Bajo impacto ambiental", "Medio impacto ambiental", "Alto impacto ambiental"
     */
    @Column(name = "nivel", length = 100) // Nombre de columna en BD, máximo 100 caracteres
    private String nivel;
}

