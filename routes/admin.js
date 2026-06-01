const express = require('express');
const router = express.Router();
const path = require('path');
const QueueService = require('../services/queueService');
const PostService = require('../services/postService');


const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'npcsnok';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';


function authMiddleware(req, res, next) {
  const token = req.session?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (token === `admin_token_${ADMIN_USERNAME}`) {
    return next();
  }

  if (req.method === 'GET' && req.path === '/') {
    return next(); 
  }

  
  if (req.method !== 'GET') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  next();
}


router.use((req, res, next) => {
  
  if (req.path === '/' && req.method === 'GET') {
    return next();
  }

  
  if (req.path === '/api/login' && req.method === 'POST') {
    return next();
  }

  
  if (req.path === '/api/logout' && req.method === 'POST') {
    return next();
  }

  
  if (req.path === '/api/status' && req.method === 'GET') {
    return next();
  }

  
  if (req.path === '/api/upload-image' && req.method === 'POST') {
    return next();
  }

  
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Inicia sesión primero.'
    });
  }

  next();
});


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});


router.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 Login attempt:', { username });

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    console.log('✅ Login exitoso!');
    
    req.session.isAdmin = true;
    req.session.username = username;
    req.session.save((err) => {
      if (err) {
        console.error('Error guardando sesión:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno de sesión'
        });
      }
      res.json({
        success: true,
        message: `¡Bienvenido, ${ADMIN_USERNAME}!`
      });
    });
  } else {
    console.log('❌ Credenciales inválidas');
    res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    });
  }
});


router.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});


router.get('/api/status', (req, res) => {
  if (req.session && req.session.isAdmin) {
    res.json({ success: true, isAdmin: true, username: req.session.username });
  } else {
    res.json({ success: false, isAdmin: false });
  }
});


router.get('/api/requests', async (req, res) => {
  try {
    const requests = await QueueService.getAllRequests();
    
    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error en /api/requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las requests'
    });
  }
});


router.post('/api/requests', async (req, res) => {
  try {
    const { alias, description, estimatedDays = 7 } = req.body;

    if (!alias || !description) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos (alias, description)'
      });
    }

    const newRequest = await QueueService.createRequest(alias, description, estimatedDays);

    res.status(201).json({
      success: true,
      request: newRequest,
      message: 'Request creado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /api/requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el request'
    });
  }
});


router.put('/api/requests/:id', async (req, res) => {
  try {
    const { alias, description, estimatedDays, status } = req.body;
    const updates = {};

    if (alias) updates.alias = alias;
    if (description) updates.description = description;
    if (estimatedDays) updates.estimated_days = estimatedDays;
    if (status) updates.status = status;

    updates.updated_at = new Date().toISOString();

    const updated = await QueueService.updateRequest(req.params.id, updates);

    res.json({
      success: true,
      request: updated,
      message: 'Request actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /api/requests/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el request'
    });
  }
});


router.patch('/api/requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['waiting', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Use: waiting, in_progress, completed'
      });
    }

    const updated = await QueueService.updateStatus(req.params.id, status);

    res.json({
      success: true,
      request: updated,
      message: 'Estado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PATCH /api/requests/:id/status:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado'
    });
  }
});


router.delete('/api/requests/:id', async (req, res) => {
  try {
    await QueueService.deleteRequest(req.params.id);

    res.json({
      success: true,
      message: 'Request eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en DELETE /api/requests/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el request'
    });
  }
});




router.get('/api/posts', async (req, res) => {
  try {
    const posts = await PostService.getAllPosts();
    
    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error en /api/posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los posts'
    });
  }
});


router.post('/api/posts', async (req, res) => {
  try {
    const { post_type, title, content, image_url, description } = req.body;

    if (!post_type || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos (post_type, title, content)'
      });
    }

    if (post_type === 'image' && !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Los posts de imagen requieren image_url'
      });
    }

    const newPost = await PostService.createPost(
      post_type,
      title,
      content,
      image_url,
      description
    );

    res.status(201).json({
      success: true,
      post: newPost,
      message: 'Post creado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /api/posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el post'
    });
  }
});


router.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, image_url, description, is_published } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;
    if (image_url) updates.image_url = image_url;
    if (description !== undefined) updates.description = description;
    if (is_published !== undefined) updates.is_published = is_published;

    const updated = await PostService.updatePost(req.params.id, updates);

    res.json({
      success: true,
      post: updated,
      message: 'Post actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /api/posts/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el post'
    });
  }
});


router.delete('/api/posts/:id', async (req, res) => {
  try {
    await PostService.deletePost(req.params.id);

    res.json({
      success: true,
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en DELETE /api/posts/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el post'
    });
  }
});


router.post('/api/posts/reorder', async (req, res) => {
  try {
    const { posts } = req.body;

    if (!Array.isArray(posts)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de posts'
      });
    }

    await PostService.reorderPosts(posts);

    res.json({
      success: true,
      message: 'Posts reordenados exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /api/posts/reorder:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reordenar posts'
    });
  }
});

// Endpoint para subir imágenes a Supabase
router.post('/api/upload-image', async (req, res) => {
  try {
    const { base64Data, fileName } = req.body;

    if (!base64Data || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren base64Data y fileName'
      });
    }

    // Convertir base64 a Buffer
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64String, 'base64');

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const uniqueFileName = `${timestamp}-${randomString}-${fileName}`;

    console.log('📤 Subiendo a Supabase:', uniqueFileName);

    // Inicializar cliente de Supabase (del lado del servidor)
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.URL_SUPABASE;
    const supabaseKey = process.env.CLAVE_SUPABASE;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables de Supabase no configuradas');
      console.error('   URL_SUPABASE:', supabaseUrl ? '✓' : '✗');
      console.error('   CLAVE_SUPABASE:', supabaseKey ? '✓' : '✗');
      return res.status(500).json({
        success: false,
        message: 'Configuración de servidor incompleta'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📨 Conectado a Supabase:', supabaseUrl);

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('posts-images')
      .upload(uniqueFileName, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error subiendo a Supabase:', error);
      return res.status(500).json({
        success: false,
        message: `Error al subir la imagen: ${error.message || error}`
      });
    }

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('posts-images')
      .getPublicUrl(uniqueFileName);

    if (!publicData || !publicData.publicUrl) {
      console.error('❌ Error obteniendo URL pública');
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la URL de la imagen'
      });
    }

    console.log('✅ Imagen subida exitosamente:', publicData.publicUrl);

    res.json({
      success: true,
      imageUrl: publicData.publicUrl,
      message: 'Imagen subida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en POST /api/upload-image:', error);
    res.status(500).json({
      success: false,
      message: `Error al procesar la imagen: ${error.message}`
    });
  }
});

module.exports = router;
