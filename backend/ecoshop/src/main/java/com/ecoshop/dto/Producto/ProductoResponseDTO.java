package com.ecoshop.dto.Producto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductoResponseDTO {
    private Integer productoId;
    private Integer marcaId;      // Devolvemos el ID de la marca
    private String nombreMarca;   // Útil para el frontend mostrar el nombre de la marca
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String sku;
    private String materiales;
    private String origen;
    private BigDecimal huellaCarbonoKg;
    private Integer porcentajeReciclable;
    private String ecoBadge;
    private String imagenUrl;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    public ProductoResponseDTO() {}

    // Getters y Setters
    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }
    public Integer getMarcaId() { return marcaId; }
    public void setMarcaId(Integer marcaId) { this.marcaId = marcaId; }
    public String getNombreMarca() { return nombreMarca; }
    public void setNombreMarca(String nombreMarca) { this.nombreMarca = nombreMarca; }
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
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
