package com.ecoshop.dto.Marca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MarcaRequestDTO {

  @NotNull(message = "El ID del usuario es obligatorio")
  private Integer usuarioId;

  @NotBlank(message = "El nombre oficial es obligatorio")
  @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
  private String nombreOficial;

  private String descripcionSostenible;
  private String sitioWeb;
  private String logoUrl;

  // Getters y Setters
  public Integer getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

  public String getNombreOficial() { return nombreOficial; }
  public void setNombreOficial(String nombreOficial) { this.nombreOficial = nombreOficial; }

  public String getDescripcionSostenible() { return descripcionSostenible; }
  public void setDescripcionSostenible(String descripcionSostenible) { this.descripcionSostenible = descripcionSostenible; }

  public String getSitioWeb() { return sitioWeb; }
  public void setSitioWeb(String sitioWeb) { this.sitioWeb = sitioWeb; }

  public String getLogoUrl() { return logoUrl; }
  public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
