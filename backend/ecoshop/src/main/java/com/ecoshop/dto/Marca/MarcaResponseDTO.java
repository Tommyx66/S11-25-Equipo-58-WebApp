package com.ecoshop.dto.Marca;

import java.time.LocalDateTime;

public class MarcaResponseDTO {
  private Integer marcaId;
  private Integer usuarioId;
  private String nombreOficial;
  private String descripcionSostenible;
  private String sitioWeb;
  private String logoUrl;
  private LocalDateTime fechaUnion;

  public MarcaResponseDTO() {}

  // Constructor completo
  public MarcaResponseDTO(Integer marcaId, Integer usuarioId, String nombreOficial, String descripcionSostenible, String sitioWeb, String logoUrl, LocalDateTime fechaUnion) {
      this.marcaId = marcaId;
      this.usuarioId = usuarioId;
      this.nombreOficial = nombreOficial;
      this.descripcionSostenible = descripcionSostenible;
      this.sitioWeb = sitioWeb;
      this.logoUrl = logoUrl;
      this.fechaUnion = fechaUnion;
  }

  // Getters y Setters
  public Integer getMarcaId() { return marcaId; }
  public void setMarcaId(Integer marcaId) { this.marcaId = marcaId; }
  
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

  public LocalDateTime getFechaUnion() { return fechaUnion; }
  public void setFechaUnion(LocalDateTime fechaUnion) { this.fechaUnion = fechaUnion; }
}
