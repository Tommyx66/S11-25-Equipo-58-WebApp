package com.ecoshop.service;

import com.ecoshop.dto.Usuario.UsuarioRequestDTO;
import com.ecoshop.dto.Usuario.UsuarioResponseDTO;
import java.util.List;

public interface UsuarioService {
  UsuarioResponseDTO createUsuario(UsuarioRequestDTO dto);

  UsuarioResponseDTO getUsuarioById(Integer id);

  List<UsuarioResponseDTO> getAllUsuarios();

  UsuarioResponseDTO updateUsuario(Integer id, UsuarioRequestDTO dto);

  void deleteUsuario(Integer id);
}
