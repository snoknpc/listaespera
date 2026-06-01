# 🎨 NpcSnok - Lista de Espera de Requests

Sistema web moderno para gestionar tu lista de espera de requests con diseño oscuro y estética gamer.

## ⚡ Inicio Rápido

### 1. **Setup de la Base de Datos en Supabase**

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Abre tu proyecto
3. Ve a SQL Editor y copia-pega el contenido de `migrations.sql`
4. Ejecuta la migración

Esto creará:
- Tabla `requests` con campos: id, position, alias, description, status, estimated_days, created_at, updated_at
- Índices para optimización
- Políticas de acceso

### 2. **Configurar Variables de Entorno**

El archivo `.env` ya debe tener:
```
URL_SUPABASE=https://tu-supabase-url.supabase.co
CLAVE_SUPABASE=tu-supabase-key
PUERTO_SERVIDOR=3000
```

**Opcionales:**
```
ADMIN_USERNAME=npcsnok
ADMIN_PASSWORD=admin123
```

### 3. **Instalar Dependencias**

```bash
npm install
```

### 4. **Iniciar el Servidor**

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 📍 URLs Principales

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000/` | Página pública (lista de espera) |
| `http://localhost:3000/admin` | Panel de administración (con login) |

## 🔐 Credenciales de Admin (por defecto)

**Usuario:** `npcsnok`  
**Contraseña:** `admin123`

*Cambiar en el archivo `.env` con las variables `ADMIN_USERNAME` y `ADMIN_PASSWORD`*

## 🎨 Características

### Página Pública
- ✅ Vista en tiempo real de la cola (actualización cada 2 segundos)
- ✅ Cards con posición, alias, descripción, tiempo estimado
- ✅ Modal con detalles completos al hacer clic
- ✅ Contador de personas en espera
- ✅ Botón destacado para Ko-fi ($6 USD para pasar a cola prioritaria)
- ✅ Diseño oscuro responsivo

### Panel Admin
- ✅ Login con usuario/contraseña
- ✅ Agregar nuevos requests
- ✅ Editar requests existentes
- ✅ Cambiar estado (En Espera → En Proceso → Completado)
- ✅ Eliminar requests
- ✅ Filtrar por estado
- ✅ Tabla actualizable

## 📊 API Endpoints

### Públicos
```
GET  /api/queue              - Obtener lista de espera actual
GET  /api/request/:id        - Obtener detalles de un request
```

### Admin (requieren autenticación)
```
POST   /admin/api/login               - Iniciar sesión
GET    /admin/api/requests            - Obtener todos los requests
POST   /admin/api/requests            - Crear nuevo request
PUT    /admin/api/requests/:id        - Actualizar request
PATCH  /admin/api/requests/:id/status - Cambiar estado
DELETE /admin/api/requests/:id        - Eliminar request
```

## 🛠️ Estructura del Proyecto

```
ListaEspera/
├── app.js                    # Configuración principal de Express
├── .env                      # Variables de entorno
├── package.json              # Dependencias
├── migrations.sql            # Script para crear tabla en Supabase
├── config/
│   └── supabase.js          # Cliente de Supabase
├── routes/
│   ├── public.js            # Rutas públicas
│   └── admin.js             # Rutas admin (con autenticación)
├── services/
│   └── queueService.js      # Lógica de base de datos
├── public/
│   ├── index.html           # Página pública
│   ├── admin.html           # Panel admin
│   ├── style.css            # Estilos (oscuro/gamer)
│   ├── realtime.js          # JavaScript página pública
│   └── admin.js             # JavaScript panel admin
```

## 🎨 Customización

### Cambiar Colores
Edita las variables CSS en `public/style.css`:
```css
:root {
    --primary: #6366f1;        /* Color primario */
    --secondary: #ec4899;      /* Color secundario */
    --accent: #06b6d4;         /* Color de acento */
    --bg-dark: #0f172a;        /* Fondo oscuro */
    /* ... más variables */
}
```

### Cambiar Logo y Links Ko-fi
- En `public/index.html` línea 11: Logo (cambiar emoji 🎨)
- En `public/index.html` línea 41: URL Ko-fi
- En `public/admin.html` línea 6: Logo admin

### Cambiar Textos
Busca en los archivos HTML y personaliza:
- Tagline (línea 14 en index.html)
- Textos de botones
- Mensajes de carga

## 🚀 Deployment

### Opción 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Opción 2: Heroku
```bash
heroku create tu-app
git push heroku main
```

### Opción 3: Servidor Personal
- Instala Node.js
- Clona el proyecto
- `npm install`
- `npm start`

## 📝 Notas

- **Tiempo Real:** Las actualizaciones ocurren cada 2 segundos (polling). Para una mejor experiencia, considera implementar WebSockets o usar el listener de Realtime de Supabase.
- **Autenticación Admin:** Actualmente usa credenciales hardcodeadas. Para producción, considera usar Supabase Auth.
- **CORS:** Si accedes desde otro dominio, configura CORS en `app.js`.

## 🐛 Troubleshooting

**Error: "Faltan las credenciales de Supabase"**
- Verifica que `.env` tenga `URL_SUPABASE` y `CLAVE_SUPABASE`

**La tabla no existe**
- Ejecuta `migrations.sql` en Supabase SQL Editor

**Admin login no funciona**
- Verifica el usuario y contraseña en `.env` (o usa `npcsnok` / `admin123`)
- Limpia el localStorage del navegador

**Página pública no se actualiza en tiempo real**
- Asegúrate de que el servidor esté corriendo
- Revisa la consola del navegador (F12) para errores

## 📧 Soporte

Si tienes dudas o problemas, contacta a NpcSnok.

---

**Hecho con ❤️ para artistas digitales**
