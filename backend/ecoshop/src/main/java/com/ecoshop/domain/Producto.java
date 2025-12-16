package com.ecoshop.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Productos")
public class Producto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "producto_id")
  private Integer productoId;

  // Relación Muchos Productos -> Una Marca
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "marca_id", nullable = false)
  private Marca marca;

  @Column(nullable = false, length = 200)
  private String nombre;

  @Column(columnDefinition = "TEXT")
  private String descripcion;

  @Column(nullable = false)
  private BigDecimal precio; // Siempre usa BigDecimal para dinero

  @Column(nullable = false)
  private Integer stock = 0;

  @Column(length = 100, unique = true)
  private String sku;

  // Campos de impacto
  @Column(columnDefinition = "TEXT")
  private String materiales;

  @Column(length = 100)
  private String origen;

  @Column(name = "huella_carbono_kg")
  private BigDecimal huellaCarbonoKg;

  @Column(name = "porcentaje_reciclable")
  private Integer porcentajeReciclable = 0;

  @Column(name = "eco_badge", length = 15)
  private String ecoBadge; // 'bajo_impacto', 'medio_impacto', 'neutro'
  
  @Column(name = "imagen_url")
  private String imagenUrl;

  @CreationTimestamp
  @Column(name = "fecha_creacion", updatable = false)
  private LocalDateTime fechaCreacion;

  @Column(nullable = false)
  private Boolean activo = true;

  // --- CONSTRUCTOR VACÍO ---
  public Producto() {}

  // --- GETTERS Y SETTERS ---
  public Integer getProductoId() { return productoId; }
  public void setProductoId(Integer productoId) { this.productoId = productoId; }

  public Marca getMarca() { return marca; }
  public void setMarca(Marca marca) { this.marca = marca; }

  public String getNombre() { return nombre; }
  public void setNombre(String nombre) { this.nombre = nombre; }

  public String getDescripcion() { return descripcion; }
  public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

  public BigDecimal getPrecio() { return precio; }
  public void setPrecio(BigDecimal precio) { this.precio = precio; }

  public Integer getStock() { return stock; }
  public void setStock(Integer stock) { this.stock = stock; }

  public String getSku() { return sku; }
  public void setSku(String sku) { this.sku = sku; }

  public String getMateriales() { return materiales; }
  public void setMateriales(String materiales) { this.materiales = materiales; }

  public String getOrigen() { return origen; }
  public void setOrigen(String origen) { this.origen = origen; }

  public BigDecimal getHuellaCarbonoKg() { return huellaCarbonoKg; }
  public void setHuellaCarbonoKg(BigDecimal huellaCarbonoKg) { this.huellaCarbonoKg = huellaCarbonoKg; }

  public Integer getPorcentajeReciclable() { return porcentajeReciclable; }
  public void setPorcentajeReciclable(Integer porcentajeReciclable) { this.porcentajeReciclable = porcentajeReciclable; }

  public String getEcoBadge() { return ecoBadge; }
  public void setEcoBadge(String ecoBadge) { this.ecoBadge = ecoBadge; }
  
  public String getImagenUrl() { return imagenUrl; }
  public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

  public LocalDateTime getFechaCreacion() { return fechaCreacion; }
  public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

  public Boolean getActivo() { return activo; }
  public void setActivo(Boolean activo) { this.activo = activo; }
}
