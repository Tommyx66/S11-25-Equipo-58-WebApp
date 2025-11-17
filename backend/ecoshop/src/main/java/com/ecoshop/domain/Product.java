package com.ecoshop.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA que representa un producto en la base de datos.
 * 
 * Esta clase mapea la tabla "products" en la base de datos PostgreSQL.
 * Cada instancia de esta clase representa una fila en la tabla.
 * 
 * Estructura de la tabla:
 * - id: Identificador único (clave primaria, auto-generado)
 * - nombre: Nombre del producto (obligatorio, máximo 200 caracteres)
 * - marca: Marca del producto (opcional, máximo 100 caracteres)
 * - precio: Precio del producto (obligatorio, 10 dígitos enteros, 2 decimales)
 * - imagen: URL de la imagen del producto (opcional, máximo 500 caracteres)
 * - huella_carbono: Huella de carbono (parte del objeto embeddable ImpactoAmbiental)
 * - materiales_reciclables: Si los materiales son reciclables (parte del objeto embeddable)
 * - nivel: Nivel de impacto ambiental (parte del objeto embeddable)
 * - product_certificaciones: Tabla separada para las certificaciones (relación uno a muchos)
 * 
 * Relaciones:
 * - @Embedded: ImpactoAmbiental está embebido en esta tabla (no es una relación separada)
 * - @ElementCollection: Las certificaciones están en una tabla separada (product_certificaciones)
 */
@Entity // Indica que esta clase es una entidad JPA
@Table(name = "products") // Especifica el nombre de la tabla en la BD
@Data // Genera automáticamente getters, setters, toString, equals y hashCode (Lombok)
@Builder // Permite construir objetos usando el patrón Builder (Lombok)
@NoArgsConstructor // Genera constructor sin argumentos (requerido por JPA)
@AllArgsConstructor // Genera constructor con todos los argumentos (Lombok)
public class Product {

    /**
     * Identificador único del producto.
     * 
     * @GeneratedValue(strategy = GenerationType.IDENTITY):
     * - La BD genera automáticamente el ID usando una secuencia o auto-incremento
     * - PostgreSQL usa SERIAL o BIGSERIAL para esto
     * - El ID se asigna automáticamente cuando se guarda por primera vez
     */
    @Id // Indica que este campo es la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // La BD genera el ID automáticamente
    private Long id;

    /**
     * Nombre del producto.
     * 
     * @Column(nullable = false): Este campo es obligatorio (no puede ser null)
     * @Column(length = 200): Longitud máxima de 200 caracteres en la BD
     */
    @Column(nullable = false, length = 200) // Campo obligatorio, máximo 200 caracteres
    private String nombre;

    /**
     * Marca del producto.
     * 
     * Campo opcional (puede ser null).
     */
    @Column(length = 100) // Campo opcional, máximo 100 caracteres
    private String marca;

    /**
     * Precio del producto.
     * 
     * @Column(precision = 10, scale = 2):
     * - precision = 10: Total de dígitos (incluyendo decimales)
     * - scale = 2: Número de decimales
     * - Ejemplo: 99999999.99 (8 dígitos enteros + 2 decimales = 10 dígitos totales)
     * 
     * Usamos BigDecimal en lugar de double para evitar problemas de precisión
     * con cálculos monetarios.
     */
    @Column(nullable = false, precision = 10, scale = 2) // Obligatorio, 10 dígitos totales, 2 decimales
    private BigDecimal precio;

    /**
     * Información sobre el impacto ambiental del producto.
     * 
     * @Embedded: Este objeto no es una entidad separada, sino que sus campos
     * se almacenan directamente en la tabla "products". Esto es útil cuando
     * queremos agrupar campos relacionados pero no necesitamos una relación
     * de base de datos separada.
     * 
     * Los campos de ImpactoAmbiental se almacenan en la tabla products con
     * nombres como: huella_carbono, materiales_reciclables, nivel
     */
    @Embedded // Los campos de este objeto se almacenan en la misma tabla
    private ImpactoAmbiental impactoAmbiental;

    /**
     * URL de la imagen del producto.
     * 
     * Campo opcional que almacena la dirección de la imagen del producto.
     */
    @Column(length = 500) // Campo opcional, máximo 500 caracteres
    private String imagen;

    /**
     * Lista de certificaciones del producto.
     * 
     * @ElementCollection: Esta es una colección de valores simples (String)
     * que se almacena en una tabla separada llamada "product_certificaciones".
     * 
     * Estructura de la tabla product_certificaciones:
     * - product_id: Clave foránea que referencia a products.id
     * - certificacion: Valor de la certificación (String)
     * 
     * @CollectionTable: Especifica el nombre de la tabla y cómo se relaciona
     * @Builder.Default: Inicializa la lista como vacía por defecto cuando se usa Builder
     * 
     * Ejemplo de datos:
     * - ["Fair Trade", "Carbon Neutral"]
     */
    @ElementCollection(fetch = FetchType.EAGER) // Colección de valores simples en tabla separada, carga inmediatamente
    @CollectionTable(name = "product_certificaciones", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "certificacion") // Nombre de la columna en la tabla de certificaciones
    @Builder.Default // Inicializa la lista vacía por defecto cuando se usa Builder
    private List<String> certificaciones = new ArrayList<>();
}

