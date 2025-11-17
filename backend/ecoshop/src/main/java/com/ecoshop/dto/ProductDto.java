package com.ecoshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Data Transfer Object (DTO) para productos.
 * 
 * Esta clase representa los datos de un producto que se transfieren entre
 * el cliente y el servidor. A diferencia de la entidad Product, este DTO:
 * - Solo contiene los datos necesarios para la API
 * - No incluye detalles de implementación de JPA
 * - Incluye validaciones que se aplican automáticamente
 * 
 * ¿Por qué usar DTOs?
 * - Separación entre la capa de presentación y la capa de datos
 * - Control sobre qué datos se exponen en la API
 * - Validación automática de datos antes de procesarlos
 * - Flexibilidad para cambiar la estructura sin afectar la BD
 * - Mejor rendimiento al evitar cargar relaciones innecesarias
 * 
 * Validaciones:
 * Las anotaciones de validación (@NotNull, @NotBlank, @Size, etc.) se
 * activan automáticamente cuando se usa @Valid en el controlador.
 * Si la validación falla, se lanza MethodArgumentNotValidException.
 */
@Data // Genera automáticamente getters, setters, toString, equals y hashCode (Lombok)
@Builder // Permite construir objetos usando el patrón Builder (Lombok)
@NoArgsConstructor // Genera constructor sin argumentos
@AllArgsConstructor // Genera constructor con todos los argumentos (Lombok)
public class ProductDto {

    /**
     * Identificador único del producto.
     * 
     * Este campo puede ser null cuando se crea un nuevo producto (la BD asignará el ID).
     * Cuando se actualiza un producto, este campo debe contener el ID del producto existente.
     */
    private Long id;

    /**
     * Nombre del producto.
     * 
     * @NotBlank: El campo no puede estar vacío ni ser null
     * @Size: Longitud máxima de 200 caracteres
     * 
     * Validación automática: Si el nombre está vacío o excede 200 caracteres,
     * se lanza MethodArgumentNotValidException con el mensaje especificado.
     */
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    /**
     * Marca del producto.
     * 
     * Campo opcional (puede ser null o vacío).
     * Si se proporciona, no puede exceder 100 caracteres.
     */
    @Size(max = 100, message = "La marca no puede exceder 100 caracteres")
    private String marca;

    /**
     * Precio del producto.
     * 
     * @NotNull: El campo no puede ser null (obligatorio)
     * @DecimalMin: El valor debe ser mayor a 0 (no puede ser 0 ni negativo)
     * @Digits: Formato numérico - máximo 8 dígitos enteros y 2 decimales
     * 
     * Ejemplos válidos:
     * - 14990.00 (precio entero)
     * - 14990.50 (precio con decimales)
     * - 99999999.99 (precio máximo)
     * 
     * Ejemplos inválidos:
     * - 0 (debe ser mayor a 0)
     * - -100 (no puede ser negativo)
     * - 999999999.99 (excede los 8 dígitos enteros)
     */
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener máximo 8 dígitos enteros y 2 decimales")
    private BigDecimal precio;

    /**
     * Información sobre el impacto ambiental del producto.
     * 
     * @Valid: Activa la validación de los campos del objeto ImpactoAmbientalDto
     * Esto significa que las validaciones dentro de ImpactoAmbientalDto también
     * se aplicarán cuando se valide este DTO.
     * 
     * Campo opcional (puede ser null).
     */
    @Valid // Activa validaciones en el objeto ImpactoAmbientalDto
    private ImpactoAmbientalDto impactoAmbiental;

    /**
     * URL de la imagen del producto.
     * 
     * Campo opcional que almacena la dirección de la imagen.
     * Si se proporciona, no puede exceder 500 caracteres.
     */
    @Size(max = 500, message = "La URL de la imagen no puede exceder 500 caracteres")
    private String imagen;

    /**
     * Lista de certificaciones del producto.
     * 
     * Campo opcional que contiene una lista de certificaciones (ej: ["Fair Trade", "Carbon Neutral"]).
     * No tiene validaciones, puede ser null o una lista vacía.
     */
    private List<String> certificaciones;

    /**
     * DTO interno para el impacto ambiental del producto.
     * 
     * Esta clase anidada representa los datos de impacto ambiental que se
     * transfieren en el DTO principal. Se usa para agrupar campos relacionados
     * y mantener la estructura del JSON de respuesta.
     * 
     * Nota: Esta clase está anidada dentro de ProductDto para mantener
     * la coherencia con la estructura de la API. También podríamos haberla
     * definido como una clase separada, pero esta estructura es más clara.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImpactoAmbientalDto {
        
        /**
         * Huella de carbono del producto.
         * 
         * Ejemplos: "0.8kg CO₂", "1.2kg CO₂", etc.
         * Campo opcional, máximo 50 caracteres.
         */
        @Size(max = 50, message = "La huella de carbono no puede exceder 50 caracteres")
        private String huellaCarbono;

        /**
         * Indica si los materiales del producto son reciclables.
         * 
         * true: Los materiales son reciclables
         * false: Los materiales no son reciclables
         * null: No se ha especificado esta información
         * 
         * Campo opcional, no tiene validaciones.
         */
        private Boolean materialesReciclables;

        /**
         * Nivel de impacto ambiental del producto.
         * 
         * Ejemplos: "Bajo impacto ambiental", "Medio impacto ambiental", "Alto impacto ambiental"
         * Campo opcional, máximo 100 caracteres.
         */
        @Size(max = 100, message = "El nivel no puede exceder 100 caracteres")
        private String nivel;
    }
}

