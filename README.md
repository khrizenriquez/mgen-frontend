# mgen-frontend

Sistema de gestión de donaciones - Frontend React con arquitectura hexagonal.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados (para producción)
- Node.js 18+ y pnpm (para desarrollo)
- Git

### Levantar con Docker (Producción)

```bash
# Clonar el repositorio (si no lo has hecho)
git clone <repository-url>
cd mgen-frontend

# Construir y levantar el contenedor
docker build -t donations-frontend .
docker run -d -p 80:80 --name donations-app donations-frontend

# O usando docker-compose (si tienes uno configurado)
docker-compose up -d

# Detener el contenedor
docker stop donations-app
```

### Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Levantar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Vista previa de build
pnpm preview
```

## 📊 Puertos y URLs

| Modo | Puerto | URL | Descripción |
|------|---------|-----|-------------|
| **Desarrollo** | `5173` | http://localhost:5173 | Vite dev server |
| **Producción (Docker)** | `80` | http://localhost | Nginx serving build |
| **Preview** | `4173` | http://localhost:4173 | Vista previa local |

## 🔗 Enlaces del Sistema

Una vez levantado el backend, el frontend se conectará a:
- **Backend API**: http://localhost:8000/api/v1
- **API Documentation**: http://localhost:8000/docs

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm preview      # Vista previa del build

# Calidad de código
pnpm lint         # Ejecutar ESLint
pnpm lint:fix     # Arreglar errores de ESLint
pnpm format       # Formatear con Prettier
pnpm typecheck    # Verificar tipos TypeScript

# Testing
pnpm test         # Ejecutar tests
pnpm test:ui      # Tests con interfaz visual
pnpm test:coverage # Tests con cobertura
```

## 🏗️ Arquitectura

- **Hexagonal Architecture** (Core/Adapters/UI)
- **React 18** con hooks y context
- **Vite** para development y builds
- **Bootstrap 5** para UI components
- **React Router** para navegación
- **React Query** para server state
- **React Hook Form** para formularios
- **Axios** para HTTP client

## 🎨 Tecnologías UI

- **Bootstrap 5.3.2** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **React Bootstrap** - Componentes React
- **Custom CSS** - Estilos personalizados