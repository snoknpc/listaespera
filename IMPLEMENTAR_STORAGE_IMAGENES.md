# 📸 Implementación de Storage para Imágenes en Posts

## Estado Actual ✅
El código **ya está implementado** en tu proyecto. Solo necesitas crear el bucket en Supabase.

## Pasos a Seguir

### 1. Crear el Bucket en Supabase

1. **Accede a tu proyecto Supabase**
   - URL: https://cuhquvatvieomyacohsa.supabase.co
   - Ve a **Storage** en el menú izquierdo

2. **Crear nuevo bucket**
   - Clic en **"Create a new bucket"**
   - Nombre: `posts-images`
   - Marcas **"Public bucket"** (importante para que las URLs sean públicas)
   - Clic en **"Create bucket"**

### 2. Configurar Políticas de Seguridad (RLS)

Ve a la sección **SQL Editor** en Supabase y ejecuta:

```sql
-- Permitir lectura pública
CREATE POLICY "Enable public read" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'posts-images');

-- Permitir uploads (opcional, si quieres restricciones)
CREATE POLICY "Enable authenticated uploads" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'posts-images');

-- Permitir eliminación
CREATE POLICY "Enable delete" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'posts-images');
```

### 3. Cómo Funciona en tu App

#### Flujo en Frontend (admin.js):
1. Admin selecciona una imagen en el formulario
2. Sistema valida:
   - Tipo de archivo (debe ser imagen)
   - Tamaño máximo (5MB)
3. Convierte a Base64
4. Envía a `/admin/api/upload-image`

#### Flujo en Backend (routes/admin.js):
1. Recibe Base64 + nombre de archivo
2. Convierte a Buffer
3. Genera nombre único: `{timestamp}-{random}-{originalName}`
4. Sube a Supabase Storage bucket `posts-images`
5. Devuelve URL pública

#### Almacenamiento en BD:
- URL se guarda en `posts.image_url`
- Post se crea con tipo `'image'`

## Estructura de Base de Datos

La tabla `posts` tiene estos campos:
```sql
- id: UUID (generado automáticamente)
- post_type: 'image' o 'text'
- title: Título del post
- content: Contenido (para texto o descripción)
- image_url: URL de la imagen en Supabase Storage
- description: Descripción adicional
- order_index: Orden de aparición
- is_published: Booleano (visible o no)
- created_at: Timestamp
- updated_at: Timestamp
```

## Endpoints Disponibles

### Subir Imagen
```
POST /admin/api/upload-image
Content-Type: application/json

Body:
{
  "base64Data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "fileName": "foto.jpg",
  "fileType": "image/jpeg"
}

Response:
{
  "success": true,
  "imageUrl": "https://..../posts-images/1234567890-abc123-foto.jpg",
  "message": "Imagen subida exitosamente"
}
```

### Crear Post con Imagen
```
POST /admin/api/posts
Content-Type: application/json

Body:
{
  "post_type": "image",
  "title": "Mi primera foto",
  "content": "Descripción opcional",
  "image_url": "https://..../posts-images/...",
  "description": "Detalles de la imagen"
}

Response:
{
  "success": true,
  "post": { ... },
  "message": "Post creado exitosamente"
}
```

### Obtener Posts Públicos
```
GET /api/posts
Response:
[
  {
    "id": "uuid",
    "post_type": "image",
    "title": "Mi primera foto",
    "image_url": "https://...",
    "is_published": true,
    ...
  }
]
```

## Archivos Modificados

- ✅ `routes/admin.js` - Endpoint `/api/upload-image` (línea 379-466)
- ✅ `public/admin.js` - Función `uploadImageToServer()` (línea 539-609)
- ✅ `public/admin.html` - Formulario de imagen (línea 82-94)
- ✅ `services/postService.js` - Métodos CRUD para posts
- ✅ `migrations_posts.sql` - Schema de tabla posts

## Validaciones Implementadas

### Frontend:
- ✅ Máximo 5MB de tamaño
- ✅ Solo archivos de imagen
- ✅ Feedback visual (nombre archivo + peso)
- ✅ Mostrar/ocultar campos según tipo post

### Backend:
- ✅ Validar Base64 válido
- ✅ Generar nombre único
- ✅ Error handling
- ✅ Logs de debug

## Pruebas en el Admin

1. Abre http://localhost:3000/admin
2. Login: `srsnok` / `elmapale`
3. Sección "Agregar Nuevo Post":
   - Tipo Post: **Imagen**
   - Título: Escribe un título
   - Imagen: Sube una foto
   - Descripción: Opcional
   - Botón: "Agregar Post"

## Troubleshooting

| Problema | Solución |
|----------|----------|
| ❌ "Configuración de servidor incompleta" | Verifica `URL_SUPABASE` y `CLAVE_SUPABASE` en `.env` |
| ❌ "Error al subir la imagen" | Verifica que el bucket `posts-images` existe en Supabase |
| ❌ "Error 403 Forbidden" | Revisa políticas RLS del bucket en Supabase |
| ❌ "Imagen muy grande" | Comprime la imagen (máximo 5MB) |
| ❌ "Tipo de archivo inválido" | Solo admite: jpg, png, gif, webp, etc. |

## Variable de Entorno en .env

```env
URL_SUPABASE=https://cuhquvatvieomyacohsa.supabase.co
CLAVE_SUPABASE=sb_publishable_UG4gFf6w-lQM9xRPaaMy_w_2To5L1nB
```

⚠️ **Nota:** Esta es la clave `publishable` que es segura en el cliente. Para operaciones en el servidor, se usa esta misma clave en el .env.

## Próximos Pasos

1. ✅ Crear bucket `posts-images` en Supabase
2. ✅ Configurar políticas RLS
3. ✅ Reiniciar el servidor: `npm start` o `npm run dev`
4. ✅ Probar subir una imagen desde admin
5. ✅ Ver la imagen publicada en el sitio público
