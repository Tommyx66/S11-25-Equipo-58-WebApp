package com.ecoshop.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Pedido_Items")
public class PedidoItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "pedido_item_id")
  private Integer pedidoItemId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pedido_id", nullable = false)
  private Pedido pedido;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "producto_id", nullable = false)
  private Producto producto;

  @Column(nullable = false)
  private Integer cantidad;

  @Column(name = "precio_unitario", nullable = false)
  private BigDecimal precioUnitario;

  // --- CONSTRUCTORES ---
  public PedidoItem() {}

  // --- GETTERS Y SETTERS ---
  public Integer getPedidoItemId() { return pedidoItemId; }
  public void setPedidoItemId(Integer pedidoItemId) { this.pedidoItemId = pedidoItemId; }

  public Pedido getPedido() { return pedido; }
  public void setPedido(Pedido pedido) { this.pedido = pedido; }

  public Producto getProducto() { return producto; }
  public void setProducto(Producto producto) { this.producto = producto; }

  public Integer getCantidad() { return cantidad; }
  public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

  public BigDecimal getPrecioUnitario() { return precioUnitario; }
  public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}
