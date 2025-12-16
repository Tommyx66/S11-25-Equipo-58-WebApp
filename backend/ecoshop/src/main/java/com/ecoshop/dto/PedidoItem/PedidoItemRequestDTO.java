package com.ecoshop.dto.PedidoItem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PedidoItemRequestDTO {

  @NotNull(message = "El ID del pedido es obligatorio")
  private Integer pedidoId;

  @NotNull(message = "El ID del producto es obligatorio")
  private Integer productoId;

  @NotNull(message = "La cantidad es obligatoria")
  @Min(value = 1, message = "La cantidad debe ser al menos 1")
  private Integer cantidad;

  // Getters y Setters
  public Integer getPedidoId() { return pedidoId; }
  public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }

  public Integer getProductoId() { return productoId; }
  public void setProductoId(Integer productoId) { this.productoId = productoId; }

  public Integer getCantidad() { return cantidad; }
  public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
