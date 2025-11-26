package com.ecoshop.dto.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PedidoResponseDTO {
  private Integer pedidoId;
  private Integer usuarioId;
  private String emailUsuario; // Dato extra útil para el admin
  private LocalDateTime fechaPedido;
  private String estado;
  private BigDecimal total;
  private String direccionEnvio;
  private String metodoPago;
  private String idTransaccionPago;
  private BigDecimal huellaCarbonoTotalKg;

  public PedidoResponseDTO() {}

  // --- GETTERS Y SETTERS ---
  public Integer getPedidoId() { return pedidoId; }
  public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }

  public Integer getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

  public String getEmailUsuario() { return emailUsuario; }
  public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }

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
