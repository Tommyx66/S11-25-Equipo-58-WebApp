package com.ecoshop.repository;

import com.ecoshop.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
  boolean existsByEmail(String email);
}
