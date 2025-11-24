# EcoShop Backend

E-commerce sostenible con métricas de impacto ambiental - Backend API

## Requisitos

- Java 21
- Maven 3.8+
- PostgreSQL 14+

## Configuración Inicial

### Opción 1: Usando Docker Compose (Recomendado y usado por mi Javi)

1. Iniciar PostgreSQL con Docker Compose:

```bash
docker-compose up -d
```

Esto creará una instancia de PostgreSQL en el puerto 5433 con:
- Base de datos: `ecoshop`
- Usuario: `postgres`
- Contraseña: `postgres`

**Nota:** El puerto está configurado en 5433 (no 5432) para evitar conflictos con instalaciones locales de PostgreSQL.

### Opción 2: Instalación Local de PostgreSQL

1. Instalar PostgreSQL localmente
2. Crear la base de datos:

```sql
CREATE DATABASE ecoshop;
```

### 2. Variables de Entorno

Copiar el archivo `.env.example` a `.env` y configurar las variables:

```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

```

Editar el archivo `.env` con tus credenciales de PostgreSQL:

```env
# Si usas Docker Compose (puerto 5433)
DB_URL=jdbc:postgresql://localhost:5433/ecoshop

# Si usas PostgreSQL local (ajustar puerto según tu instalación)
# DB_URL=jdbc:postgresql://localhost:5432/ecoshop

DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
```

### 3. Configuración de Spring Profiles

El proyecto usa perfiles de Spring. Por defecto usa el perfil `dev`:

- **dev**: Configuración para desarrollo local
- **prod**: Configuración para producción (requiere configuración adicional)

Para cambiar el perfil, establecer la variable de entorno:

```bash
SPRING_PROFILES_ACTIVE=dev
```

## Ejecutar la Aplicación

### Desarrollo

#### Opción 1: Desde el IDE (Recomendado)

1. Abrir el proyecto en tu IDE (IntelliJ IDEA, Eclipse, VS Code, etc.)
2. Asegurar que Java 21 esté configurado como SDK del proyecto
3. Ejecutar la clase `EcoShopApplication` como aplicación Java
4. La aplicación estará disponible en: `http://localhost:8080`

#### Opción 2: Desde la Terminal

```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

### Compilar

```bash
mvn clean install
```


## Endpoints Disponibles

### Health Check
- **GET** `/api/v1/health` - Verificar estado de la API

### Productos
- **GET** `/api/v1/products` - Obtener todos los productos
- **GET** `/api/v1/products/{id}` - Obtener producto por ID
- **POST** `/api/v1/products` - Crear nuevo producto
- **PUT** `/api/v1/products/{id}` - Actualizar producto
- **DELETE** `/api/v1/products/{id}` - Eliminar producto

### Certificaciones
- **GET** `/api/v1/certifications` - Obtener todas las certificaciones
- **GET** `/api/v1/certifications/{id}` - Obtener certificación por ID
- **GET** `/api/v1/certifications/code/{code}` - Obtener certificación por código
- **POST** `/api/v1/certifications` - Crear nueva certificación
- **PUT** `/api/v1/certifications/{id}` - Actualizar certificación
- **DELETE** `/api/v1/certifications/{id}` - Eliminar certificación

## Ejemplos de Uso

### Contrato de la API - Certificaciones

**IMPORTANTE:** El sistema maneja certificaciones de forma diferente según el tipo de operación:

- **GET (ProductResponse)**: Devuelve **nombres** de certificaciones para mejorar nuestra conexión con el front (ej: `["Fair Trade", "Carbon Neutral"]`)
- **POST/PUT (ProductDto)**: Espera **códigos** de certificaciones (ej: `["FAIR_TRADE", "CARBON_NEUTRAL"]`)

Los códigos deben existir previamente en la base de datos. Si un código no existe, se retornará un error 400 Bad Request, por lo que se acenseja antes de probar, subir un par de post.

### Crear Certificación

```json
POST /api/v1/certifications
Content-Type: application/json

{
  "name": "Fair Trade",
  "code": "FAIR_TRADE",
  "type": "SOCIAL",
  "logoUrl": "https://example.com/fair-trade.png"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Fair Trade",
  "code": "FAIR_TRADE",
  "type": "SOCIAL",
  "logoUrl": "https://example.com/fair-trade.png",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### Crear Producto

```json
POST /api/v1/products
Content-Type: application/json

{
  "nombre": "Botella reutilizable EcoLife",
  "marca": "EcoLife",
  "precio": 14990,
  "impactoAmbiental": {
    "huellaCarbono": "0.8",
    "materialesReciclables": true,
    "nivel": "Bajo impacto ambiental"
  },
  "imagen": "https://example.com/bottle.png",
  "certificaciones": ["FAIR_TRADE", "CARBON_NEUTRAL"]
}
```

**Respuesta (POST/PUT devuelve códigos):**
```json
{
  "id": 1,
  "nombre": "Botella reutilizable EcoLife",
  "marca": "EcoLife",
  "precio": 14990,
  "impactoAmbiental": {
    "huellaCarbono": "0.8 kg CO₂",
    "materialesReciclables": true,
    "nivel": "Bajo impacto ambiental"
  },
  "imagen": "https://example.com/bottle.png",
  "certificaciones": ["FAIR_TRADE", "CARBON_NEUTRAL"],
  "fechaCreacion": "2024-01-15T10:30:00"
}
```

### Obtener Producto (GET)

```json
GET /api/v1/products/1
```

**Respuesta (GET devuelve nombres):**
```json
{
  "id": 1,
  "nombre": "Botella reutilizable EcoLife",
  "marca": "EcoLife",
  "precio": 14990,
  "impactoAmbiental": {
    "huellaCarbono": "0.8 kg CO₂",
    "materialesReciclables": true,
    "nivel": "Bajo impacto ambiental"
  },
  "imagen": "https://example.com/bottle.png",
  "certificaciones": ["Fair Trade", "Carbon Neutral"],
  "fechaCreacion": "2024-01-15T10:30:00"
}
```

## Características Principales

### Módulo de Productos
- CRUD completo de productos
- Relación many-to-many con certificaciones
- Impacto ambiental embebido en la entidad Product
- Validaciones de negocio (precio, nombre, etc.)
- Manejo de fechas de creación automático

### Módulo de Certificaciones
- CRUD completo de certificaciones
- Códigos únicos normalizados (mayúsculas, sin espacios)
- Validación de unicidad de códigos
- Búsqueda case-insensitive
- Fechas de creación y actualización automáticas

### Relaciones
- **Product ↔ Certification**: Relación many-to-many bidireccional
- Tabla intermedia: `producto_certificaciones`
- Carga lazy (importante porque ya dio problema de busqueda infinita si se pone eager) con `@EntityGraph` para optimizar consultas

## Validaciones

### ProductDto
- `nombre`: Obligatorio, máximo 200 caracteres
- `precio`: Obligatorio, mayor a 0, máximo 8 dígitos enteros y 2 decimales
- `marca`: Opcional, máximo 100 caracteres
- `imagen`: Opcional, máximo 500 caracteres
- `certificaciones`: Lista de códigos (deben existir en BD)

### CertificationRequest
- `name`: Obligatorio, máximo 200 caracteres
- `code`: Obligatorio, máximo 50 caracteres, único
- `type`: Opcional, máximo 50 caracteres
- `logoUrl`: Opcional, máximo 500 caracteres

## Manejo de Errores

El sistema incluye un `GlobalExceptionHandler` que maneja lo basico:

- **400 Bad Request**: Validaciones de negocio (ej: certificación no encontrada, código duplicado)
- **404 Not Found**: Recurso no encontrado (ej: producto o certificación inexistente)
- **400 Validation Failed**: Errores de validación de campos (Bean Validation)
- **500 Internal Server Error**: Errores inesperados del servidor

Ejemplo de respuesta de error:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Certificación con código 'INVALID_CODE' no encontrada"
}
```

## Seguridad

- Los endpoints públicos no requieren autenticación
- CORS está configurado para permitir todas las solicitudes (configurar dominios específicos en producción)
- CSRF está deshabilitado para APIs REST

## Estructura del Proyecto

```
src/main/java/com/ecoshop/
├── config/          # Configuraciones (Security, Web)
├── controller/      # Controladores REST
│   ├── ProductController.java
│   ├── CertificationController.java
│   └── HealthController.java
├── domain/          # Entidades JPA
│   ├── Product.java
│   ├── Certification.java
│   └── ImpactoAmbiental.java
├── dto/             # Data Transfer Objects
│   ├── ProductDto.java
│   ├── ProductResponse.java
│   ├── CertificationRequest.java
│   ├── CertificationResponse.java
│   └── ImpactoAmbientalResponse.java
├── exception/       # Manejo de excepciones
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java
├── mapper/          # Mappers entre DTOs y Entidades
│   ├── ProductMapper.java
│   └── CertificationMapper.java
├── repository/      # Repositorios JPA
│   ├── ProductRepository.java
│   └── CertificationRepository.java
└── service/         # Lógica de negocio
    ├── ProductService.java
    ├── CertificationService.java
    └── impl/
        ├── ProductServiceImpl.java
        └── CertificationServiceImpl.java
```

## Base de Datos

### Tablas Principales
- `products`: Productos con impacto ambiental embebido
- `certifications`: Certificaciones ambientales
- `producto_certificaciones`: Tabla intermedia para relación many-to-many

### Configuración
- Las tablas se crean automáticamente mediante JPA con `ddl-auto: update`
- En producción, usar `ddl-auto: validate` o migraciones con Flyway/Liquibase
- PostgreSQL 14+ recomendado

### Características
- Códigos de certificaciones normalizados a mayúsculas
- Búsquedas case-insensitive para códigos
- Fechas de creación y actualización automáticas
- Relaciones lazy con carga optimizada mediante `@EntityGraph`


