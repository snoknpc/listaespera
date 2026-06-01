# 🚀 GUÍA FINAL: Poner en Marcha tu Lista de Espera

Hola NpcSnok, aquí está todo lo que necesitas hacer para que tu aplicación funcione perfectamente.

---

## ✅ PASO 1: Configurar la Base de Datos (Supabase)

### 1.1 Acceder a Supabase
- Ve a https://app.supabase.com y abre tu proyecto
- En la barra lateral, ve a **SQL Editor**

### 1.2 Crear la Tabla
- Copia todo el contenido del archivo `migrations.sql` (en la raíz del proyecto)
- Pégalo en Supabase SQL Editor
- Haz clic en **▶ Run** (o presiona Ctrl+Enter)

**Resultado esperado:** Verás un mensaje de éxito. ✅

---

## ✅ PASO 2: Verificar Variables de Entorno

Abre el archivo `.env` en la raíz. Debe verse así:

```
URL_SUPABASE=https://imgxoiksrpspnzqmdrxr.supabase.co
CLAVE_SUPABASE=sb_publishable_4IqXBw3RpP95eWG7ZABnzw__v-oLj5a
PUERTO_SERVIDOR=3000
ADMIN_USERNAME=npcsnok
ADMIN_PASSWORD=admin123
```

⚠️ **IMPORTANTE:** 
- Usa tus propias credenciales de Supabase
- Puedes cambiar `ADMIN_USERNAME` y `ADMIN_PASSWORD` si lo deseas

---

## ✅ PASO 3: Instalar Dependencias

En tu terminal, dentro de la carpeta del proyecto:

```bash
npm install
```

Espera a que termine. Verás un mensaje como "added X packages".

---

## ✅ PASO 4: Iniciar el Servidor

En la misma terminal:

```bash
npm start
```

**Resultado esperado:**
```
🎨 Servidor de Lista de Espera iniciado
Escuchando en: http://localhost:3000
```

---

## 🌐 PASO 5: Acceder a la Aplicación

Abre tu navegador y ve a:

### Página Pública
```
http://localhost:3000
```

Verás:
- Diseño oscuro con título "NpcSnok"
- Sección "Mi Lista de Espera"
- Botón Ko-fi
- Si no hay datos aún: "¡La cola está vacía!"

### Panel Admin
```
http://localhost:3000/admin
```

Verás:
- Formulario de login
- **Usuario:** `npcsnok`
- **Contraseña:** `admin123`

Después de loguearte:
- Formulario para agregar requests
- Tabla con todos los requests
- Botones para editar y eliminar

---

## 🧪 PASO 6: Probar la Funcionalidad

### 6.1 Agregar un Request desde Admin

1. Ve a http://localhost:3000/admin
2. Login: `npcsnok` / `admin123`
3. En "Agregar Nuevo Request":
   - Alias: `Mi Primer Request`
   - Descripción: `Fan art de mi OC favorito`
   - Días estimados: `7`
4. Haz clic en "Agregar a la Cola"

### 6.2 Ver en Página Pública

1. Ve a http://localhost:3000
2. Deberías ver una tarjeta con:
   - Número: `#1`
   - Alias: `Mi Primer Request`
   - Descripción
   - Tiempo: `≈ 7 días`
   - Contador: `1 en espera`

### 6.3 Probar Modal de Detalles

1. En la página pública, haz clic en la tarjeta
2. Se abre un modal con más detalles
3. Haz clic en "Pasar a cola prioritaria" (lleva a Ko-fi)

### 6.4 Probar Cambios de Estado

1. Ve a admin
2. En la tabla, cambia el estado a "En Proceso"
3. Vuelve a la página pública
4. El badge debajo debería cambiar de color

---

## 📱 Personalización

### Cambiar Colores
Edita `public/style.css` línea 7-15:
```css
:root {
    --primary: #6366f1;        /* Cambia a tu color favorito */
    --secondary: #ec4899;
    ...
}
```

### Cambiar Links Ko-fi
En `public/index.html`, busca `https://ko-fi.com/npcsnok` y reemplaza con tu URL.

### Cambiar Credenciales Admin
En `.env`, cambia:
```
ADMIN_USERNAME=tu_usuario
ADMIN_PASSWORD=tu_contraseña
```

---

## 🚀 Próximos Pasos

### Cuando esté listo para producción:

1. **Deploy a Vercel** (recomendado):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy a Heroku**:
   ```bash
   heroku create mi-app
   git push heroku main
   ```

3. **Servidor personal**:
   - Instala Node.js en tu servidor
   - Clona el proyecto
   - `npm install` y `npm start`

---

## 🐛 Si Algo No Funciona

### Error: "Faltan credenciales de Supabase"
- Verifica que `.env` tenga las credenciales correctas
- Reinicia el servidor

### La tabla no se crea en Supabase
- Copia de nuevo `migrations.sql`
- Asegúrate de que esté completamente pegado
- Haz clic en Run

### Login admin no funciona
- Limpia el localStorage del navegador (F12 → Application → Clear)
- Recarga la página
- Verifica usuario y contraseña

### Página pública no se actualiza
- Asegúrate de que el servidor esté corriendo
- Abre la consola (F12) para ver errores
- Recarga la página

---

## 📞 Contacto

Si tienes preguntas o problemas, contacta a tu desarrollador o revisa:
- `README.md` - Documentación completa
- `TESTING.md` - Guía para testing sin Supabase

---

## ✨ ¡Listo!

Tu aplicación está lista. Ahora puedes:
- ✅ Mostrar tu lista de espera públicamente
- ✅ Agregar/editar/eliminar requests
- ✅ Cambiar estados en tiempo real
- ✅ Enviar clientes a Ko-fi para prioritarios

**¡Que disfrutes vendiendo tus requests!** 🎨
