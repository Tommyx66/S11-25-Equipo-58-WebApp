package com.ecoshop.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
 * - stock: Stock disponible del producto (obligatorio, default 0)
 * - materiales: Materiales utilizados en la fabricación (opcional, máximo 500 caracteres)
 * - origen: Origen del producto (opcional, máximo 100 caracteres)
 * - porcentaje_reciclable: Porcentaje de material reciclable (opcional)
 * - eco_badge: Eco badge o certificación ecológica (opcional, máximo 50 caracteres)
 * - activo: Indica si el producto está activo (obligatorio, default true)
 * - fecha_creacion: Fecha de creación del producto (obligatorio, no actualizable)
 * - imagen: URL de la imagen del producto (opcional, máximo 500 caracteres)
 * - huella_carbono_kg: Huella de carbono en kg CO₂ (parte del objeto embeddable ImpactoAmbiental)
 * - materiales_reciclables: Si los materiales son reciclables (parte del objeto embeddable)
 * - nivel: Nivel de impacto ambiental (parte del objeto embeddable)
 * - producto_certificaciones: Tabla intermedia para la relación many-to-many con Certification
 * 
 * Relaciones:
 * - @Embedded: ImpactoAmbiental está embebido en esta tabla (no es una relación separada)
 * - @ManyToMany: Las certificaciones están en una relación many-to-many con Certification
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
     * Stock disponible del producto.
     * 
     * Representa la cantidad de unidades disponibles en inventario.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    /**
     * Materiales utilizados en la fabricación del producto.
     * 
     * Ejemplos: "Plástico reciclado", "Algodón orgánico", "Bambú"
     */
    @Column(length = 500)
    private String materiales;

    /**
     * Origen del producto.
     * 
     * Indica el país o región de origen del producto.
     * Ejemplos: "Argentina", "Chile", "Local"
     */
    @Column(length = 100)
    private String origen;

    /**
     * Porcentaje de material reciclable del producto.
     * 
     * Valor entre 0 y 100 que indica el porcentaje de material reciclable.
     */
    @Column(name = "porcentaje_reciclable")
    private Integer porcentajeReciclable;

    /**
     * Eco badge o certificación ecológica del producto.
     * 
     * Identificador del badge ecológico que posee el producto.
     * Ejemplos: "ECO001", "GREEN", "SUSTAINABLE"
     */
    @Column(name = "eco_badge", length = 50)
    private String ecoBadge;

    /**
     * Indica si el producto está activo y disponible para venta.
     * 
     * true: El producto está activo y disponible
     * false: El producto está inactivo (no se muestra en el catálogo)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    /**
     * Fecha de creación del producto en el sistema.
     * 
     * Se asigna automáticamente cuando se crea el producto.
     */
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Asigna la fecha de creación si no está establecida.
     */
    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

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
     * Certificaciones ambientales asociadas al producto.
     * 
     * @ManyToMany: Relación many-to-many con la entidad Certification.
     * Esta relación se almacena en una tabla intermedia llamada "producto_certificaciones".
     * 
     * Estructura de la tabla intermedia producto_certificaciones:
     * - producto_id: Clave foránea que referencia a products.id
     * - certificacion_id: Clave foránea que referencia a certifications.id
     * 
     * @JoinTable: Especifica el nombre de la tabla intermedia y las columnas
     * - name: Nombre de la tabla intermedia
     * - joinColumns: Columna que referencia a esta entidad (Product)
     * - inverseJoinColumns: Columna que referencia a la entidad relacionada (Certification)
     * 
     * @Builder.Default: Inicializa el Set como vacío por defecto cuando se usa Builder
     * 
     * Usamos Set en lugar de List para evitar duplicados y mejorar el rendimiento
     * en operaciones de búsqueda y eliminación.
     * 
     * FetchType.LAZY: Carga las certificaciones solo cuando se accede a ellas.
     * Esto evita problemas de rendimiento y referencias circulares durante la serialización.
     * Usamos @EntityGraph en el repositorio para cargar las certificaciones cuando sea necesario.
     */
    @ManyToMany(fetch = FetchType.LAZY) // Carga las certificaciones solo cuando se accede a ellas
    @JoinTable(
        name = "producto_certificaciones",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "certificacion_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @Builder.Default
    private Set<Certification> certificaciones = new HashSet<>();
}

