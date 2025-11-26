package com.ecoshop.dto.Usuario;

import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Integer usuarioId;
    private String email;
    private String nombre;
    private String direccionDefault;
    private String rol;
    private LocalDateTime fechaRegistro;

    public UsuarioResponseDTO() {}

    public UsuarioResponseDTO(Integer usuarioId, String email, String nombre, String direccionDefault, String rol, LocalDateTime fechaRegistro) {
        this.usuarioId = usuarioId;
        this.email = email;
        this.nombre = nombre;
        this.direccionDefault = direccionDefault;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
    }

    // --- GETTERS Y SETTERS ---
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccionDefault() { return direccionDefault; }
    public void setDireccionDefault(String direccionDefault) { this.direccionDefault = direccionDefault; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
