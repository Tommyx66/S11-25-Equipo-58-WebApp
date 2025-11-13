# EcoShop Backend

E-commerce sostenible con métricas de impacto ambiental - Backend API

## Requisitos

- Java 21
- Maven 3.8+
- PostgreSQL 14+

## Configuración Inicial

### Opción 1: Usando Docker Compose (Recomendado)

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

# En Linux/Mac
cp .env.example .env
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

O usar Maven Wrapper:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

### Compilar

```bash
mvn clean install
```

O con Maven Wrapper:

```bash
# Windows
.\mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

### Ejecutar Tests

```bash
mvn test
```

O con Maven Wrapper:

```bash
# Windows
.\mvnw.cmd test

# Linux/Mac
./mvnw test
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

## Ejemplo de Request

### Crear Producto

```json
POST /api/v1/products
Content-Type: application/json

{
  "nombre": "Botella reutilizable EcoLife",
  "marca": "EcoLife",
  "precio": 14990,
  "impactoAmbiental": {
    "huellaCarbono": "0.8kg CO₂",
    "materialesReciclables": true,
    "nivel": "Bajo impacto ambiental"
  },
  "imagen": "url-del-producto",
  "certificaciones": ["Fair Trade", "Carbon Neutral"]
}
```

### Respuesta

```json
{
  "id": 1,
  "nombre": "Botella reutilizable EcoLife",
  "marca": "EcoLife",
  "precio": 14990,
  "impactoAmbiental": {
    "huellaCarbono": "0.8kg CO₂",
    "materialesReciclables": true,
    "nivel": "Bajo impacto ambiental"
  },
  "imagen": "url-del-producto",
  "certificaciones": ["Fair Trade", "Carbon Neutral"]
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
├── domain/          # Entidades JPA
├── dto/             # Data Transfer Objects
├── exception/       # Manejo de excepciones
├── mapper/          # Mappers entre DTOs y Entidades
├── repository/      # Repositorios JPA
└── service/         # Lógica de negocio
```

## Base de Datos

Las tablas se crean automáticamente mediante JPA con `ddl-auto: update`. En producción, usar `ddl-auto: validate` o migraciones con Flyway/Liquibase.


