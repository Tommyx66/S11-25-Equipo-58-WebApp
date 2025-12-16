package com.ecoshop.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "Marcas")
public class Marca {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "marca_id")
  private Integer marcaId;

  @OneToOne(fetch = FetchType.LAZY) 
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @Column(name = "nombre_oficial", nullable = false, length = 150)
  private String nombreOficial;

  @Column(name = "descripcion_sostenible", columnDefinition = "TEXT")
  private String descripcionSostenible;

  @Column(name = "sitio_web")
  private String sitioWeb;

  @Column(name = "logo_url")
  private String logoUrl;

  @CreationTimestamp
  @Column(name = "fecha_union", updatable = false)
  private LocalDateTime fechaUnion;

  // --- CONSTRUCTORES ---
  public Marca() {}

  public Marca(Usuario usuario, String nombreOficial, String descripcionSostenible, String sitioWeb, String logoUrl) {
      this.usuario = usuario;
      this.nombreOficial = nombreOficial;
      this.descripcionSostenible = descripcionSostenible;
      this.sitioWeb = sitioWeb;
      this.logoUrl = logoUrl;
  }

  // --- GETTERS Y SETTERS ---
  public Integer getMarcaId() { return marcaId; }
  public void setMarcaId(Integer marcaId) { this.marcaId = marcaId; }

  public Usuario getUsuario() { return usuario; }
  public void setUsuario(Usuario usuario) { this.usuario = usuario; }

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
