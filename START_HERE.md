# ⚡ COMIENZA AQUÍ - Tu Aplicación Lista ⚡

Hola NpcSnok 👋

Tu **aplicación web está 100% lista**. Aquí está exactamente qué hacer para ponerla en marcha.

---

## 🎯 3 PASOS SIMPLES

### PASO 1️⃣ - Configura Supabase (5 minutos)

**¿Tienes Supabase?** Si, ya vimos que tienes credenciales en `.env`

1. Abre https://app.supabase.com
2. Entra a tu proyecto
3. Ve a **SQL Editor** (en la barra izquierda)
4. **Copia TODO el contenido** del archivo `migrations.sql` (en tu carpeta raíz)
5. **Pégalo** en el SQL Editor
6. **Haz clic en ▶ Run** (o presiona Ctrl+Enter)
7. ✅ ¡Listo! Viste un mensaje de éxito

---

### PASO 2️⃣ - Inicia tu Aplicación (1 minuto)

Abre terminal/consola en tu carpeta del proyecto:

```bash
npm install
npm start
```

Deberías ver:
```
🎨 Servidor de Lista de Espera iniciado
Escuchando en: http://localhost:3000
```

---

### PASO 3️⃣ - Abre en tu Navegador (30 segundos)

**Página Pública (lo que ven tus clientes):**
```
http://localhost:3000
```
→ Verás: "La cola está vacía" (porque no hay datos aún)

**Panel Admin (solo tú):**
```
http://localhost:3000/admin
```
→ Verás: Login  
→ Usuario: `npcsnok`  
→ Contraseña: `admin123`

---

## ✨ PRUEBA RÁPIDA (Para Verificar que Todo Funciona)

1. **Ve a admin** → http://localhost:3000/admin
2. **Login** con npcsnok / admin123
3. **Agrega un request:**
   - Alias: "Mi Primer Request"
   - Descripción: "Fan art increíble"
   - Días: 7
   - Haz clic "Agregar a la Cola"

4. **Ve a página pública** → http://localhost:3000
5. **¡Debería aparecer tu request!** ✅

6. **Prueba el modal:** Haz clic en la tarjeta
7. **Ve al admin:** Cambia el estado a "En Proceso"
8. **Vuelve a la página pública:** El color del badge debe cambiar

---

## 📂 Estructura de tu Proyecto

```
ListaEspera/
├── 🟢 app.js                 ← Tu servidor (LISTO)
├── 🟢 .env                   ← Credenciales Supabase (LISTO)
├── 🟢 package.json           ← Dependencias (LISTO)
│
├── ⚙️  config/
│   └── supabase.js           ← Conexión a Supabase
│
├── 📡 routes/
│   ├── public.js             ← API pública
│   └── admin.js              ← API admin (con login)
│
├── 💾 services/
│   └── queueService.js       ← Lógica de base de datos
│
├── 🌐 public/
│   ├── index.html            ← Página principal (hermosa 🎨)
│   ├── admin.html            ← Panel admin
│   ├── style.css             ← Estilos oscuros (listo)
│   ├── realtime.js           ← Actualización en tiempo real
│   └── admin.js              ← Lógica del panel admin
│
├── 📚 Documentación/
│   ├── README.md             ← Guía técnica completa
│   ├── INICIO_RAPIDO.md      ← Esta guía
│   ├── migrations.sql        ← Para crear tabla en Supabase
│   └── PROYECTO_COMPLETADO.md ← Resumen final
```

---

## 🤔 Dudas Frecuentes

### ¿Qué son esos archivos .md?
Son **documentación en Markdown**. Puedes abrirlos con cualquier editor de texto. Contienen guías útiles.

### ¿Ya tengo Supabase configurado?
Sí, vemos credenciales en `.env`. Solo necesitas ejecutar `migrations.sql`.

### ¿Puedo cambiar "npcsnok"?
Sí, en `.env` cambia:
```
ADMIN_USERNAME=tu_usuario
ADMIN_PASSWORD=tu_contraseña
```

### ¿Y el botón Ko-fi?
En `public/index.html` busca `ko-fi.com/npcsnok` y cambia por tu URL.

### ¿Cómo cambio los colores?
En `public/style.css` línea 7-10, ahí están las variables de color.

---

## 🎨 Lo que tu App Hace

### Para tus Clientes
```
┌─────────────────────────────────┐
│  🎨 NpcSnok - Lista de Espera  │
├─────────────────────────────────┤
│  Mi Lista de Espera             │
│  Posiciones actuales             │
│                                  │
│  1 en espera  |  7 días promedio │
├─────────────────────────────────┤
│  ⚡ ¿Quieres saltarte la fila?   │
│  Por $6 USD puedo priorizarte   │
│  ☕ Ir a Ko-fi                  │
├─────────────────────────────────┤
│  #1  Luna.art                    │
│      Fan art anime, estilo cosmic │
│      ≈ 7 días | En Espera       │
│  (Click aquí para más detalles)  │
└─────────────────────────────────┘
```

### Para ti (Admin)
```
┌──────────────────────────────────┐
│  🎨 Panel Admin - Cerrar sesión  │
├──────────────────────────────────┤
│  Agregar Nuevo Request           │
│  [Alias: ________]               │
│  [Descripción: _______]          │
│  [Días: 7] [Agregar]             │
├──────────────────────────────────┤
│  Requests en Administración      │
│  [Todos] [En Espera] [Process]   │
│                                  │
│ # | Alias  | Descripción | Est.  │
│ 1 | Luna   | Fan art ... | Editar│
│ 2 | Artix  | Design ...  | Editar│
└──────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

Antes de empezar:

- [ ] Leí esta guía
- [ ] Abrí https://app.supabase.com
- [ ] Ejecuté `migrations.sql` en mi proyecto Supabase
- [ ] Abrí terminal en la carpeta del proyecto
- [ ] Escribí `npm install` (si es necesario)
- [ ] Escribí `npm start`
- [ ] Veo "Servidor iniciado" en la terminal
- [ ] Abrí http://localhost:3000 en el navegador
- [ ] Abrí http://localhost:3000/admin
- [ ] Agré un request de prueba
- [ ] Vi aparecer el request en la página pública ✅

---

## 🆘 Si Algo No Funciona

### Error: "Faltan credenciales de Supabase"
```
✓ Revisa .env tiene las credenciales correctas
✓ Reinicia el servidor (Ctrl+C y npm start)
```

### La tabla de Supabase no existe
```
✓ Copia migrations.sql completo
✓ Abre SQL Editor en Supabase
✓ Pégalo y haz Run
```

### El login admin no funciona
```
✓ Limpia localStorage: Abre navegador, F12, 
  Application → LocalStorage → Elimina todo
✓ Recarga la página
✓ Intenta login de nuevo
```

### No veo actualizaciones en tiempo real
```
✓ Abre consola del navegador (F12)
✓ Verifica que no hay errores rojos
✓ Recarga la página
✓ Espera 2 segundos
```

---

## 🚀 Cuando Esté Todo Funcionando

### Quiero mostrar a mis clientes
1. Comparte el link: http://localhost:3000
2. Tus clientes verán la lista en tiempo real
3. Cuando agregues un request, lo verán al instante

### Quiero que funcione 24/7
Necesitarás **deploy** en un servidor. Opciones:

**Vercel** (Gratis, fácil):
```bash
npm install -g vercel
vercel
```

**Heroku** (Gratis, pero requiere cuenta):
```bash
heroku create tu-app
git push heroku main
```

**Servidor propio** (VPS, nube, etc)

---

## 📞 Información de Contacto

Si necesitas ayuda:
- Revisa `README.md` para documentación completa
- Revisa `TESTING.md` si quieres probar sin Supabase
- Revisa la consola del navegador (F12) para errores

---

## 🎉 ¡LISTO!

Tu aplicación de **Lista de Espera de Requests está lista**.

**Resumen:**
- ✅ Backend Node.js + Express
- ✅ Base de datos Supabase
- ✅ Frontend oscuro/gamer
- ✅ Panel admin completo
- ✅ Página pública profesional
- ✅ En tiempo real (cada 2 segundos)

**Próximo paso:**
1. Abre Supabase
2. Ejecuta `migrations.sql`
3. Corre `npm start`
4. ¡Disfruta vendiendo tus requests! 🎨

---

**¡Que sea exitoso tu negocio de arte! 🚀**

*Última actualización: 31 de mayo de 2026*
