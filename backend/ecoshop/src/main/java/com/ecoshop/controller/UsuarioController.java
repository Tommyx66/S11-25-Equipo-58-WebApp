package com.ecoshop.controller;

import com.ecoshop.dto.Usuario.UsuarioRequestDTO;
import com.ecoshop.dto.Usuario.UsuarioResponseDTO;
import com.ecoshop.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

  private final UsuarioService usuarioService;

  public UsuarioController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @PostMapping
  public ResponseEntity<UsuarioResponseDTO> createUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
    UsuarioResponseDTO newUsuario = usuarioService.createUsuario(dto);
    return new ResponseEntity<>(newUsuario, HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Integer id) {
    return ResponseEntity.ok(usuarioService.getUsuarioById(id));
  }

  @GetMapping
  public ResponseEntity<List<UsuarioResponseDTO>> getAllUsuarios() {
    return ResponseEntity.ok(usuarioService.getAllUsuarios());
  }

  @PutMapping("/{id}")
  public ResponseEntity<UsuarioResponseDTO> updateUsuario(@PathVariable Integer id,
      @Valid @RequestBody UsuarioRequestDTO dto) {
    return ResponseEntity.ok(usuarioService.updateUsuario(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
    usuarioService.deleteUsuario(id);
    return ResponseEntity.noContent().build();
  }
}
