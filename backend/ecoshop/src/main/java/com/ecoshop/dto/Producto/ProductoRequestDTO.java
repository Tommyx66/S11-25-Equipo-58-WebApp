package com.ecoshop.dto.Producto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductoRequestDTO {

    @NotNull(message = "El ID de la marca es obligatorio")
    private Integer marcaId;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String sku;
    private String materiales;
    private String origen;
    private BigDecimal huellaCarbonoKg;
    private Integer porcentajeReciclable;
    
    // Validamos que el badge sea uno de los permitidos por la base de datos
    @Pattern(regexp = "bajo_impacto|medio_impacto|neutro", message = "Valores permitidos: bajo_impacto, medio_impacto, neutro")
    private String ecoBadge;
    
    private String imagenUrl; // Nuevo campo

    // Getters y Setters
    public Integer getMarcaId() { return marcaId; }
    public void setMarcaId(Integer marcaId) { this.marcaId = marcaId; }
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
}
