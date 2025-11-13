# Setup Inicial - EcoShop Backend

## Para el Equipo

Hola equipo!

He configurado la estructura inicial del backend con el CRUD completo de productos. Todo está listo para empezar a trabajar.

## Setup Rápido

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPO]
cd ecoshop
```

### 2. Levantar PostgreSQL con Docker
```bash
docker-compose up -d
```

Esto crea PostgreSQL en el puerto **5433** (configurado así para evitar conflictos).

### 3. Configurar variables de entorno (si las necesitas)
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Si usas PostgreSQL local, editar .env con tus credenciales
```

### 4. Ejecutar la aplicación

#### Opción A: Desde tu IDE (Recomendado)
1. Abrir el proyecto en IntelliJ/VS Code
2. Asegurar que Java 21 esté configurado
3. Ejecutar `EcoShopApplication`

#### Opción B: Desde terminal
```bash
.\mvnw.cmd spring-boot:run
```

### 5. Probar que funciona
- Health Check: http://localhost:8080/api/v1/health
- Productos: http://localhost:8080/api/v1/products

## ✅ Lo que está implementado

- ✅ CRUD completo de Productos
- ✅ Base de datos PostgreSQL configurada
- ✅ Validaciones de entrada
- ✅ Manejo de excepciones centralizado
- ✅ CORS configurado
- ✅ Tests básicos incluidos
- ✅ Documentación completa en el código (comentarios en español)

## Endpoints Disponibles

```
GET    /api/v1/health              - Health check
GET    /api/v1/products            - Listar todos los productos
GET    /api/v1/products/{id}       - Obtener producto por ID
POST   /api/v1/products            - Crear producto
PUT    /api/v1/products/{id}       - Actualizar producto
DELETE /api/v1/products/{id}       - Eliminar producto
```

## Requisitos

- Java 21
- Maven 3.8+ (incluido Maven Wrapper en el proyecto)
- Docker (para PostgreSQL)
- IDE de tu preferencia (IntelliJ, VS Code, etc.)

## Documentación

Todo está documentado en:
- `README.md` - Guía completa del proyecto
- Código fuente - Comentarios explicativos en cada clase


