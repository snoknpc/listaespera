const express = require('express');
const router = express.Router();
const path = require('path');
const QueueService = require('../services/queueService');
const PostService = require('../services/postService');


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


router.get('/api/queue', async (req, res) => {
  try {
    const queue = await QueueService.getWaitingQueue();
    const count = await QueueService.getWaitingCount();
    
    res.json({
      success: true,
      queue,
      totalWaiting: count
    });
  } catch (error) {
    console.error('Error en /api/queue:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cola'
    });
  }
});


router.get('/api/request/:id', async (req, res) => {
  try {
    const request = await QueueService.getRequestById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request no encontrado'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Error en /api/request/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el request'
    });
  }
});


router.get('/api/posts', async (req, res) => {
  try {
    const posts = await PostService.getPublishedPosts();
    
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

module.exports = router;
