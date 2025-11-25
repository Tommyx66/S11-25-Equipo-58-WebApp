package com.ecoshop.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad JPA que representa una certificación ambiental en la base de datos.
 * 
 * Esta clase mapea la tabla "certifications" en la base de datos PostgreSQL.
 * Cada instancia de esta clase representa una certificación ambiental que puede
 * estar asociada a múltiples productos.
 * 
 * Estructura de la tabla:
 * - id: Identificador único (clave primaria, auto-generado)
 * - name: Nombre de la certificación (obligatorio, máximo 200 caracteres)
 * - code: Código único de la certificación (obligatorio, único, máximo 50 caracteres)
 * - type: Tipo de certificación (opcional, máximo 50 caracteres)
 * - logo_url: URL del logo de la certificación (opcional, máximo 500 caracteres)
 * - created_at: Fecha de creación (auto-asignada)
 * - updated_at: Fecha de última actualización (auto-actualizada)
 * 
 * Relaciones:
 * - @ManyToMany: Relación many-to-many con Product a través de la tabla intermedia
 *   "producto_certificaciones"
 */
@Entity
@Table(name = "certifications", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code", name = "uk_certification_code")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certification {

    /**
     * Identificador único de la certificación.
     * 
     * @GeneratedValue(strategy = GenerationType.IDENTITY):
     * - La BD genera automáticamente el ID usando una secuencia o auto-incremento
     * - PostgreSQL usa SERIAL o BIGSERIAL para esto
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre de la certificación.
     * 
     * Ejemplos: "Fair Trade", "Carbon Neutral", "Organic"
     * Campo obligatorio, máximo 200 caracteres.
     */
    @Column(nullable = false, length = 200)
    private String name;

    /**
     * Código único de la certificación.
     * 
     * Ejemplos: "FAIR_TRADE", "CARBON_NEUTRAL", "ORGANIC"
     * Campo obligatorio, único, máximo 50 caracteres.
     * Se usa como identificador único alternativo para búsquedas y referencias.
     */
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    /**
     * Tipo de certificación.
     * 
     * Ejemplos: "CARBONO", "SOCIAL", "AMBIENTAL", "ORGANICO"
     * Campo opcional que permite categorizar las certificaciones.
     */
    @Column(length = 50)
    private String type;

    /**
     * URL del logo de la certificación.
     * 
     * Campo opcional que almacena la dirección del logo de la certificación.
     * Útil para mostrar el logo en el frontend.
     */
    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    /**
     * Fecha de creación de la certificación en el sistema.
     * 
     * Se asigna automáticamente cuando se crea la certificación.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Fecha de última actualización de la certificación.
     * 
     * Se actualiza automáticamente cuando se modifica la certificación.
     */
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    /**
     * Relación many-to-many con Product.
     * 
     * Esta relación está mapeada desde el lado de Product, por lo que
     * aquí solo la declaramos para mantener la bidireccionalidad.
     * No es necesario configurar @JoinTable aquí ya que se hace en Product.
     * 
     * @JsonIgnore: Evita que esta relación se serialice en JSON, previniendo
     * referencias circulares y problemas de rendimiento durante la serialización.
     */
    @ManyToMany(mappedBy = "certificaciones", fetch = FetchType.LAZY)
    @JsonIgnore // Evita referencias circulares durante la serialización JSON
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @Builder.Default
    private Set<Product> productos = new HashSet<>();

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Asigna la fecha de creación si no está establecida.
     */
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    /**
     * Método que se ejecuta automáticamente antes de actualizar la entidad.
     * Actualiza la fecha de última modificación.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

