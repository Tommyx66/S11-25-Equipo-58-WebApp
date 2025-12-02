package com.ecoshop.dto.Pedido;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class PedidoRequestDTO {

  @NotNull(message = "El usuario es obligatorio")
  private Integer usuarioId;

  @Pattern(regexp = "pendiente_pago|procesando|enviado|entregado|cancelado", 
            message = "Estado inválido. Valores: pendiente_pago, procesando, enviado, entregado, cancelado")
  private String estado;

  // @NotNull(message = "El total es obligatorio")
  // @DecimalMin(value = "0.0", message = "El total no puede ser negativo")
  // private BigDecimal total;

  @NotBlank(message = "La dirección de envío es obligatoria")
  private String direccionEnvio;

  private String metodoPago;
  private String idTransaccionPago;
  private BigDecimal huellaCarbonoTotalKg;

  // --- GETTERS Y SETTERS ---
  public Integer getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

  public String getEstado() { return estado; }
  public void setEstado(String estado) { this.estado = estado; }

  // public BigDecimal getTotal() { return total; }
  // public void setTotal(BigDecimal total) { this.total = total; }

  public String getDireccionEnvio() { return direccionEnvio; }
  public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }

  public String getMetodoPago() { return metodoPago; }
  public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

  public String getIdTransaccionPago() { return idTransaccionPago; }
  public void setIdTransaccionPago(String idTransaccionPago) { this.idTransaccionPago = idTransaccionPago; }

  public BigDecimal getHuellaCarbonoTotalKg() { return huellaCarbonoTotalKg; }
  public void setHuellaCarbonoTotalKg(BigDecimal huellaCarbonoTotalKg) { this.huellaCarbonoTotalKg = huellaCarbonoTotalKg; }
}
