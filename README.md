# mgen-frontend

Sistema de gestión de donaciones -

## 🚀 Inicio Rápido

### Pre# Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm preview      # Vista previa del build

# Testing
pnpm test         # Ejecutar tests
pnpm test:ui      # Tests con interfaz visual
pnpm test:coverage # Tests con cobertura

# Formateo
pnpm format       # Formatear código con Prettier
pnpm format:check # Verificar formato

# TypeScript
pnpm typecheck    # Verificar tipos
``` y Docker Compose instalados (para producción)
- Node.js 18+ y pnpm (para desarrollo)
- Git

### Levantar con Docker (Producción)

```bash
# Clonar el repositorio
git clone <repository-url>
cd mgen-frontend

# Construir y levantar con Docker Compose
docker-compose up -d

# O construir manualmente
docker build -t donations-frontend .
docker run -d -p 3000:80 --name donations-app donations-frontend

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Desarrollo con Docker (Hot Reload)

```bash
# Levantar en modo desarrollo con hot reload
docker-compose --profile dev up

# Los cambios en el código se reflejarán automáticamente
# Accede en: http://localhost:5173
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
| **Desarrollo (pnpm)** | `5173` | http://localhost:5173 | Vite dev server |
| **Desarrollo (Docker)** | `5173` | http://localhost:5173 | Docker con hot reload |
| **Producción (Docker)** | `3000` | http://localhost:3000 | Nginx serving build |
| **Preview** | `4173` | http://localhost:4173 | Vista previa local |

## 🔗 Enlaces del Sistema

Una vez levantado el backend, el frontend se conectará a:
- **Backend API**: http://localhost:8000/api/v1
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Modo Desarrollo con Mock Data

Si el backend no está disponible, el frontend automáticamente usa **datos mock** para desarrollo:
- **Login**: Funciona con cualquier email (admin@, donor@, user@)
- **Dashboard**: Carga con estadísticas de ejemplo
- **Fallback automático**: Sin configuración adicional necesaria

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm preview      # Vista previa del build

# Formateo
pnpm format       # Formatear código con Prettier
pnpm format:check # Verificar formato

# Testing
pnpm test         # Ejecutar tests
pnpm test:ui      # Tests con interfaz visual
pnpm test:coverage # Tests con cobertura

# TypeScript
pnpm typecheck    # Verificar tipos
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

## 🚀 Despliegue en Producción

### Netlify

1. **Conectar repositorio**: Conecta tu repositorio de GitHub a Netlify
2. **Configurar build**:
   - Build command: `pnpm install --frozen-lockfile && pnpm build`
   - Publish directory: `dist`
3. **Variables de entorno**:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```
4. **Configurar CORS en backend**: En Railway, establece la variable de entorno:
   ```
   ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
   ```

### Railway (Backend)

1. **Desplegar backend**: Conecta tu repositorio backend a Railway
2. **Variables de entorno**: Configura todas las variables del `env.example`
3. **CORS**: Asegúrate de que `ALLOWED_ORIGINS` incluya tu dominio de Netlify

### Verificación

Después del despliegue, verifica:
- ✅ Frontend carga correctamente
- ✅ Login funciona con backend
- ✅ Redirección por roles funciona
- ✅ API calls no tienen errores de CORS