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

## Deploy en Render

Este proyecto está configurado para desplegarse fácilmente en Render usando el archivo `render.yaml`.

### Prerrequisitos

1. Tener una cuenta en [Render](https://render.com) (gratuita)
2. Tener el proyecto en un repositorio Git (GitHub, GitLab o Bitbucket)

### Pasos para el Deploy

#### 1. Preparar el Repositorio

Asegúrate de que todos los cambios estén commiteados y pusheados a tu repositorio:

```bash
git add .
git commit -m "Configuración para deploy en Render"
git push origin main
```

#### 2. Conectar el Repositorio en Render

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"New +"** y selecciona **"Blueprint"**
3. Conecta tu repositorio de Git
4. Render detectará automáticamente el archivo `render.yaml` y configurará:
   - Un **Web Service** para el backend Spring Boot
   - Una **Base de datos PostgreSQL**

#### 3. Configuración Automática

El archivo `render.yaml` ya está configurado con:
- **Build Command**: `./mvnw clean install -DskipTests`
- **Start Command**: `java -jar target/ecoshop-0.0.1-SNAPSHOT.jar`
- **Variables de entorno**: Configuradas automáticamente
- **Perfil de Spring**: `prod` (producción)

#### 4. Variables de Entorno (Opcional)

Si necesitas ajustar alguna configuración, puedes hacerlo desde el Dashboard de Render:
- Ve a tu servicio web
- Selecciona **"Environment"**
- Agrega o modifica variables según sea necesario

#### 5. Esperar el Deploy

Render construirá y desplegará tu aplicación automáticamente. El proceso puede tardar 5-10 minutos la primera vez.

### URL de la API

Una vez desplegado, Render te proporcionará una URL como:
```
https://ecoshop-backend.onrender.com
```

**Importante**: 
- La URL base será algo como `https://tu-servicio.onrender.com`
- Los endpoints estarán disponibles en: `https://tu-servicio.onrender.com/api/v1/...`
- Ejemplo: `https://tu-servicio.onrender.com/api/v1/health`

### Configuración del Frontend

Para que el frontend pueda consumir el backend:

1. **Obtén la URL de tu backend** desde el Dashboard de Render
2. **Actualiza la configuración del frontend** para usar esta URL en lugar de `localhost:3000`
3. **CORS ya está configurado** para permitir solicitudes desde cualquier origen (puedes restringirlo después si es necesario)

### Notas Importantes

- **Plan Gratuito**: Render ofrece un plan gratuito, pero el servicio se "duerme" después de 15 minutos de inactividad. La primera petición después de dormir puede tardar ~30 segundos en responder.
- **Base de Datos**: La base de datos PostgreSQL se crea automáticamente y las tablas se generan con `ddl-auto: update` al iniciar la aplicación.
- **Logs**: Puedes ver los logs en tiempo real desde el Dashboard de Render.
- **Puerto**: Render asigna automáticamente el puerto usando la variable `PORT`, que ya está configurada en el proyecto.

### Solución de Problemas

#### El servicio no inicia
- Revisa los logs en el Dashboard de Render
- Verifica que todas las variables de entorno estén configuradas correctamente
- Asegúrate de que el build se complete sin errores

#### Error de conexión a la base de datos
- Verifica que la base de datos esté creada y en estado "Available"
- Revisa que las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` estén configuradas

#### CORS errors en el frontend
- Verifica que la URL del backend sea correcta
- Revisa la configuración de CORS en `SecurityConfig.java` si necesitas restringir orígenes específicos


