package com.ecoshop.dto.Usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UsuarioRequestDTO {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password; 

    private String nombre;
    private String direccionDefault;

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "cliente|marca|admin", message = "El rol debe ser: cliente, marca o admin")
    private String rol;

    // --- GETTERS Y SETTERS ---
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccionDefault() { return direccionDefault; }
    public void setDireccionDefault(String direccionDefault) { this.direccionDefault = direccionDefault; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
