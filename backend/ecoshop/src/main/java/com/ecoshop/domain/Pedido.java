package com.ecoshop.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Pedidos")
public class Pedido {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "pedido_id")
  private Integer pedidoId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @CreationTimestamp
  @Column(name = "fecha_pedido", updatable = false)
  private LocalDateTime fechaPedido;

  @Column(nullable = false, length = 15)
  private String estado; // 'pendiente_pago', 'procesando', etc.

  @Column(nullable = false)
  private BigDecimal total;

  @Column(name = "direccion_envio", nullable = false, columnDefinition = "TEXT")
  private String direccionEnvio;

  @Column(name = "metodo_pago", length = 50)
  private String metodoPago;

  @Column(name = "id_transaccion_pago")
  private String idTransaccionPago;

  @Column(name = "huella_carbono_total_kg")
  private BigDecimal huellaCarbonoTotalKg;

  // --- CONSTRUCTOR
  public Pedido() {}

  // --- GETTERS Y SETTERS ---
  public Integer getPedidoId() { return pedidoId; }
  public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }

  public Usuario getUsuario() { return usuario; }
  public void setUsuario(Usuario usuario) { this.usuario = usuario; }

  public LocalDateTime getFechaPedido() { return fechaPedido; }
  public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }

  public String getEstado() { return estado; }
  public void setEstado(String estado) { this.estado = estado; }

  public BigDecimal getTotal() { return total; }
  public void setTotal(BigDecimal total) { this.total = total; }

  public String getDireccionEnvio() { return direccionEnvio; }
  public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }

  public String getMetodoPago() { return metodoPago; }
  public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

  public String getIdTransaccionPago() { return idTransaccionPago; }
  public void setIdTransaccionPago(String idTransaccionPago) { this.idTransaccionPago = idTransaccionPago; }

  public BigDecimal getHuellaCarbonoTotalKg() { return huellaCarbonoTotalKg; }
  public void setHuellaCarbonoTotalKg(BigDecimal huellaCarbonoTotalKg) { this.huellaCarbonoTotalKg = huellaCarbonoTotalKg; }
}
