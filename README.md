<div align="center">
  <img src="./frontend/docs/logo.png" alt="EcoShop Logo" width="250"/>
  <h1>EcoShop - Frontend</h1>
  
  <p>
    <b>Tu plataforma de e-commerce consciente.</b><br>
    Comprar es fácil, pero comprar cuidando el planeta es mejor. En EcoShop calculamos la huella de carbono de tus productos y te ayudamos a tomar decisiones sostenibles.
  </p>

  ![Status](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=flat-square)
  ![NoCountry](https://img.shields.io/badge/Simulación-NoCountry_s11--25-blueviolet?style=flat-square)
  ![NextJS](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)

 • [Ver Demo](https://youtu.be/pYagnsfvRCs) •
</div>

---

## 📖 Descripción del Proyecto

**EcoShop** nace con la misión de transformar el consumo online en una acción consciente. No solo vendemos productos, vendemos transparencia. Nuestra plataforma calcula en tiempo real la **huella de carbono** de cada artículo, permite compararlo con alternativas industriales y ofrece un **Dashboard de Impacto** donde el usuario puede visualizar sus logros (CO₂ evitado, agua ahorrada) y subir de nivel mediante **Eco-Puntos**.

El proyecto es parte de la simulación laboral seleccionada de **NoCountry** (Equipo 58 - Cohorte s11-25).

---

## 📸 Galería del Proyecto

### 🏠 Experiencia de Usuario
Una interfaz limpia diseñada para educar y vender responsablemente.

| **Home & Propuesta de Valor** | **Métricas de Impacto Global** |
|:---:|:---:|
| ![Home](./frontend/docs/hero.png) | ![Métricas](./frontend/docs/metrics.png) |

| **Educación Ambiental** | **Carrusel Destacado** |
|:---:|:---:|
| ![Educación](./frontend/docs/educacion.png) | ![Carrusel](./frontend/docs/carrusel.png) |

### 🛒 Flujo de Compra Sostenible

**1. Catálogo Inteligente:** Filtros por categoría, precio y **Nivel de Impacto**.
![Catálogo](./frontend/docs/catalogo.png)

**2. Transparencia Total:** Cada producto muestra su huella de CO₂, agua y trazabilidad.
![Detalle](./frontend/docs/detalle.png)

**3. Checkout & Recompensas:** Proceso de pago fluido con feedback inmediato.
| **Formulario de Envío** | **Pago Exitoso & Eco-Puntos** |
|:---:|:---:|
| ![Formulario](./frontend/docs/checkout_form.png) | ![Exito](./frontend/docs/checkout_success.png) |

**4. Tu Huella Personal:** Dashboard para visualizar tus logros ecológicos.
![Dashboard](./frontend/docs/dashboard.png)

---

## 🛠️ Stack Tecnológico

Construido con la última tecnología para asegurar velocidad, accesibilidad y DX (Developer Experience).

### **Core & UI**
| Tecnología | Badge | Uso |
| :--- | :---: | :--- |
| **Next.js 16** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | App Router, Server Components. |
| **React 19** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Librería de UI moderna. |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Tipado estático robusto. |
| **Tailwind CSS v4** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Estilos utilitarios de última generación. |
| **Shadcn/UI** | ![Shadcn](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white) | Componentes accesibles. |
| **Framer Motion** | ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | Animaciones fluidas. |

### **Estado & Data**
| Tecnología | Badge | Uso |
| :--- | :---: | :--- |
| **Zustand** | ![Zustand](https://img.shields.io/badge/Zustand-bear?style=flat-square&color=brown) | Estado global ligero (Carrito). |
| **TanStack Query** | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white) | Gestión de datos asíncronos y caché. |
| **Clerk** | ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white) | Autenticación segura. |

---

## 📂 Estructura del Proyecto

Organización modular dentro de `src/` para mantener la escalabilidad.
```bash
ecoshop-frontend/
├── public/              # Activos estáticos (imágenes, fuentes, iconos)
├── src/
│   ├── app/             # Next.js App Router (Rutas y Layouts)
│   │   ├── layout.tsx   # Diseño principal
│   │   └── page.tsx     # Página de inicio
│   │
│   ├── components/      # Biblioteca de componentes UI
│   │   ├── ui/          # Componentes base (Botones, Inputs - Shadcn)
│   │   ├── cards/       # Tarjetas de productos y métricas
│   │   └── sections/    # Secciones grandes (Hero, Carrusel)
│   │
│   ├── contexts/        # Estado global (Zustand)
│   │   └── cart.store.ts
│   │
│   ├── lib/             # Utilidades y funciones auxiliares
│   │   └── utils.ts
│   │
│   ├── providers/       # Proveedores de contexto (Client Components)
│   │
│   ├── services/        # Lógica de conexión con el Backend
│   │   └── api.ts
│   │
│   └── types/           # Definiciones de TypeScript (Interfaces)
│       └── product.ts
│
├── .env.local           # Variables de entorno (No subir al repo)
├── next.config.ts       # Configuración de Next.js
├── package.json         # Dependencias y scripts
└── README.md            # Documentación
```
---

## 👥 Equipo 58 - NoCountry

<table>
  <tr>
  <td align="center" width="200px">
      <a href="https://github.com/NodoLatenteStudio">
        <img src="https://github.com/NodoLatenteStudio.png" width="100px;" alt="Javiera Pulgar"/><br />
        <sub><b>Javiera Pulgar</b></sub>
      </a><br />
      <span title="Backend">⚙️ Backend Dev</span><br/>
      <a href="#" target="_blank">LinkedIn</a>
    </td><tr>
    <td align="center" width="200px">
      <a href="https://github.com/SantyGaliano">
        <img src="https://github.com/SantyGaliano.png" width="100px;" alt="Santiago Galiano"/><br />
        <sub><b>Santiago Galiano</b></sub>
      </a><br />
      <span title="UX/UI">🎨 UX/UI Design</span><br/>
      <a href="https://www.linkedin.com/in/santiagogaliano6/" target="_blank">LinkedIn</a>
    </td>
  </tr>
    <td align="center" width="200px">
      <a href="https://github.com/rretta">
        <img src="https://github.com/rretta.png" width="100px;" alt="Ezequiel Berretta"/><br />
        <sub><b>Ezequiel Berretta</b></sub>
      </a><br />
      <span title="Frontend">💻 Frontend Dev</span><br/>
      <a href="https://www.linkedin.com/in/ezequiel-berretta/" target="_blank">LinkedIn</a>
    </td>
    <td align="center" width="200px">
      <a href="https://github.com/Tommyx66">
        <img src="https://github.com/Tommyx66.png" width="100px;" alt="Tomás Zarriello"/><br />
        <sub><b>Tomás Zarriello</b></sub>
      </a><br />
      <span title="Frontend">💻 Frontend Dev</span><br/>
      <a href="https://www.linkedin.com/in/tomas-zarriello/" target="_blank">LinkedIn</a>
    </td>
    
  </tr>
  
</table>

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Tommyx66/ecoshop-nocountry.git
cd ecoshop-nocountry/frontend
```
### 2. Instalar dependencias
Instala las librerías necesarias para que el proyecto funcione.

```Bash
npm install
# o
yarn install
```
### 3. Configurar Variables de Entorno
Crea un archivo .env.local en la raíz de la carpeta frontend y añade las siguientes claves (solicítalas al equipo si no las tienes):

```bash
# Conexión con el Backend (Render)
NEXT_PUBLIC_API_URL=https://ecoshop-backend-mm8u.onrender.com/api/v1

# Autenticación (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. Ejecutar el servidor de desarrollo
Levanta el proyecto en tu máquina local:
```bash
npm run dev
```
La aplicación estará disponible en http://localhost:3000.

### 🔄 Flujo de Trabajo (Gitflow)
Para mantener el código organizado y evitar conflictos, seguimos estrictamente este flujo:

main: Código de producción estable (lo que ve el usuario final).

develop: Rama de integración principal (donde se juntan los cambios).

feature/nombre-tarea: Ramas temporales para cada nueva funcionalidad (se crean desde develop).

⚠️ Regla de Oro: Todo cambio hacia develop se realiza mediante Pull Request (PR) y requiere la aprobación de al menos un compañero antes de fusionarse.

<div align="center"> <sub>Hecho con 💚 por el <b>Equipo 58</b> para <b>NoCountry</b></sub> </div>
