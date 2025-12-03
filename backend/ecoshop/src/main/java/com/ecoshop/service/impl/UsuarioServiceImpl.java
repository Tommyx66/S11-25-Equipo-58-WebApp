package com.ecoshop.service.impl;

import com.ecoshop.dto.Usuario.UsuarioRequestDTO;
import com.ecoshop.dto.Usuario.UsuarioResponseDTO;
import com.ecoshop.domain.Usuario;
import com.ecoshop.exception.ResourceNotFoundException;
import com.ecoshop.repository.UsuarioRepository;
import com.ecoshop.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  @Transactional
  public UsuarioResponseDTO createUsuario(UsuarioRequestDTO dto) {
    // 1. Validar si el email ya existe
    if (usuarioRepository.existsByEmail(dto.getEmail())) {
      throw new IllegalArgumentException("El email ya está registrado");
    }

    // 2. Crear Entidad
    Usuario usuario = new Usuario();
    usuario.setEmail(dto.getEmail());
    usuario.setNombre(dto.getNombre());
    usuario.setDireccionDefault(dto.getDireccionDefault());
    usuario.setRol(dto.getRol());

    // NOTE: Analizar otra vez si se va asignar
    // passwordEncoder.encode(dto.getPassword()) con Spring Security
    usuario.setPasswordHash(dto.getPassword());

    // 3. Guardar
    Usuario savedUsuario = usuarioRepository.save(usuario);
    return mapToResponseDTO(savedUsuario);
  }

  @Override
  @Transactional(readOnly = true)
  public UsuarioResponseDTO getUsuarioById(Integer id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    return mapToResponseDTO(usuario);
  }

  @Override
  @Transactional(readOnly = true)
  public List<UsuarioResponseDTO> getAllUsuarios() {
    return usuarioRepository.findAll().stream()
        .map(this::mapToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public UsuarioResponseDTO updateUsuario(Integer id, UsuarioRequestDTO dto) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

    // Actualizamos datos básicos.
    // OJO: Normalmente el cambio de contraseña y email se hace en endpoints
    // separados por seguridad.
    usuario.setNombre(dto.getNombre());
    usuario.setDireccionDefault(dto.getDireccionDefault());

    // Solo actualizamos el rol si es necesario (cuidado con esto en producción)
    usuario.setRol(dto.getRol());

    Usuario updatedUsuario = usuarioRepository.save(usuario);
    return mapToResponseDTO(updatedUsuario);
  }

  @Override
  @Transactional
  public void deleteUsuario(Integer id) {
    if (!usuarioRepository.existsById(id)) {
      throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
    }
    usuarioRepository.deleteById(id);
  }

  // Método manual para convertir Entidad -> DTO
  private UsuarioResponseDTO mapToResponseDTO(Usuario usuario) {
    return new UsuarioResponseDTO(
        usuario.getUsuarioId(),
        usuario.getEmail(),
        usuario.getNombre(),
        usuario.getDireccionDefault(),
        usuario.getRol(),
        usuario.getFechaRegistro());
  }
}
