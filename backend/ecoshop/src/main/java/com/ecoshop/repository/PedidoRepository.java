package com.ecoshop.repository;

import com.ecoshop.domain.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

  // Obtener pedidos por ID de usuario
  List<Pedido> findByUsuario_UsuarioId(Integer usuarioId);
}
