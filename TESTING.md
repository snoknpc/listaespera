# ===================================================
# GUÍA: Ejecutar el Proyecto SIN Supabase (Testing Local)
# ===================================================

## Opción 1: Testing Rápido (Sin Crear Tabla)

Si quieres verificar que la interfaz y el código funciona sin configurar Supabase:

### Paso 1: Crear un Mock de Supabase
Crea un archivo `config/supabase-mock.js`:

```javascript
// Mock para desarrollo sin Supabase real
const mockData = {
  requests: [
    { id: '1', position: 1, alias: 'Luna.art', description: 'Fan art anime, estilo cosmic', status: 'waiting', estimated_days: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', position: 2, alias: 'PetroMuñoz', description: 'Illustration commission fullbody', status: 'in_progress', estimated_days: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', position: 3, alias: 'Artix', description: 'Character design sheet', status: 'waiting', estimated_days: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]
};

class MockSupabase {
  from(table) {
    return {
      select: () => ({ neq: () => ({ order: () => ({ data: mockData.requests, error: null }) }) }),
      insert: (data) => ({ select: () => ({ data: data, error: null }) }),
      update: (updates) => ({ eq: () => ({ select: () => ({ data: [{ ...mockData.requests[0], ...updates }], error: null }) }) }),
      delete: () => ({ eq: () => ({ error: null }) })
    };
  }

  channel() {
    return {
      on: () => ({ subscribe: () => ({}) })
    };
  }
}

module.exports = {
  cliente_supabase: new MockSupabase()
};
```

### Paso 2: Cambiar en config/supabase.js
Comentar la inicialización real y usar el mock:

```javascript
// module.exports = { cliente_supabase: cliente }; // <-- Comentar
module.exports = require('./supabase-mock');       // <-- Descomentar
```

### Paso 3: Iniciar
```bash
npm start
```

Ahora visita:
- http://localhost:3000 (página pública con datos de ejemplo)
- http://localhost:3000/admin (admin, usuario: npcsnok, password: admin123)

---

## Opción 2: Testing Completo (Con Supabase)

### Paso 1: Configurar Supabase

1. Ve a https://supabase.com y crea un proyecto gratis
2. Copia tu URL y Clave Anon en `.env`
3. En SQL Editor, ejecuta `migrations.sql`

### Paso 2: Iniciar
```bash
npm start
```

---

## Verificación de Endpoints

Puedes testear los endpoints con `curl`:

```bash
# Obtener lista pública
curl http://localhost:3000/api/queue

# Login admin
curl -X POST http://localhost:3000/admin/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"npcsnok","password":"admin123"}'

# Obtener requests como admin (reemplaza TOKEN con el token del login)
curl http://localhost:3000/admin/api/requests \
  -H "Authorization: Bearer TOKEN"

# Crear nuevo request
curl -X POST http://localhost:3000/admin/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "alias":"TuAlias",
    "description":"Tu descripción",
    "estimatedDays":7
  }'
```
