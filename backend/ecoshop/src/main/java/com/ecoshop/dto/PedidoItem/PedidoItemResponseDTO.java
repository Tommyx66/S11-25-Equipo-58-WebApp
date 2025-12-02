package com.ecoshop.dto.PedidoItem;

import java.math.BigDecimal;

public class PedidoItemResponseDTO {
  private Integer pedidoItemId;
  private Integer pedidoId;
  private Integer productoId;
  private String nombreProducto; // Dato útil para mostrar
  private String imagenUrl;      // Dato útil para mostrar
  private Integer cantidad;
  private BigDecimal precioUnitario;
  private BigDecimal subtotal;   // Calculado (cantidad * precio)

  public PedidoItemResponseDTO() {}

  // Getters y Setters
  public Integer getPedidoItemId() { return pedidoItemId; }
  public void setPedidoItemId(Integer pedidoItemId) { this.pedidoItemId = pedidoItemId; }

  public Integer getPedidoId() { return pedidoId; }
  public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }

  public Integer getProductoId() { return productoId; }
  public void setProductoId(Integer productoId) { this.productoId = productoId; }

  public String getNombreProducto() { return nombreProducto; }
  public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }

  public String getImagenUrl() { return imagenUrl; }
  public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

  public Integer getCantidad() { return cantidad; }
  public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

  public BigDecimal getPrecioUnitario() { return precioUnitario; }
  public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

  public BigDecimal getSubtotal() { return subtotal; }
  public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
