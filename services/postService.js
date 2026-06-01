const { cliente_supabase } = require('../config/supabase');

class PostService {
  
  static async getPublishedPosts() {
    try {
      const { data, error } = await cliente_supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error en getPublishedPosts:', error.message);
      throw error;
    }
  }

  
  static async getAllPosts() {
    try {
      const { data, error } = await cliente_supabase
        .from('posts')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error en getAllPosts:', error.message);
      throw error;
    }
  }

  
  static async getPostById(id) {
    try {
      const { data, error } = await cliente_supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getPostById:', error.message);
      throw error;
    }
  }

  
  static async createPost(post_type, title, content, imageUrl = null, description = null) {
    try {
      
      const { data: maxData, error: maxError } = await cliente_supabase
        .from('posts')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);

      if (maxError && maxError.code !== 'PGRST116') throw maxError;

      const nextOrder = (maxData && maxData.length > 0) ? maxData[0].order_index + 1 : 0;

      const { data, error } = await cliente_supabase
        .from('posts')
        .insert([
          {
            post_type,
            title,
            content,
            image_url: imageUrl,
            description: description,
            order_index: nextOrder,
            is_published: true
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en createPost:', error.message);
      throw error;
    }
  }

  
  static async updatePost(id, updates) {
    try {
      updates.updated_at = new Date().toISOString();

      const { data, error } = await cliente_supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en updatePost:', error.message);
      throw error;
    }
  }

  
  static async deletePost(id) {
    try {
      const { error } = await cliente_supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error en deletePost:', error.message);
      throw error;
    }
  }

  
  static async reorderPosts(postsWithOrder) {
    try {
      const updates = postsWithOrder.map(p => ({
        id: p.id,
        order_index: p.order_index
      }));

      
      for (const update of updates) {
        await cliente_supabase
          .from('posts')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      return true;
    } catch (error) {
      console.error('Error en reorderPosts:', error.message);
      throw error;
    }
  }

  
  static async togglePublished(id, isPublished) {
    try {
      const { data, error } = await cliente_supabase
        .from('posts')
        .update({ is_published: !isPublished })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en togglePublished:', error.message);
      throw error;
    }
  }
}

module.exports = PostService;
