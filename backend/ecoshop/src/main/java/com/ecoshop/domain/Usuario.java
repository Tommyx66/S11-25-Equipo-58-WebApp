package com.ecoshop.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "Usuarios")
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "usuario_id")
  private Integer usuarioId;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(length = 100)
  private String nombre;

  @Column(name = "direccion_default", columnDefinition = "TEXT")
  private String direccionDefault;

  @Column(nullable = false, length = 10)
  private String rol; // 'cliente', 'marca', 'admin'

  @CreationTimestamp
  @Column(name = "fecha_registro", updatable = false)
  private LocalDateTime fechaRegistro;

  // --- CONSTRUCTORES ---
  public Usuario() {}

  public Usuario(String email, String passwordHash, String nombre, String direccionDefault, String rol) {
      this.email = email;
      this.passwordHash = passwordHash;
      this.nombre = nombre;
      this.direccionDefault = direccionDefault;
      this.rol = rol;
  }

  // --- GETTERS Y SETTERS ---
  public Integer getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

  public String getNombre() { return nombre; }
  public void setNombre(String nombre) { this.nombre = nombre; }

  public String getDireccionDefault() { return direccionDefault; }
  public void setDireccionDefault(String direccionDefault) { this.direccionDefault = direccionDefault; }

  public String getRol() { return rol; }
  public void setRol(String rol) { this.rol = rol; }

  public LocalDateTime getFechaRegistro() { return fechaRegistro; }
  public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
