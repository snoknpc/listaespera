const { cliente_supabase } = require('../config/supabase');

class QueueService {
  
  static async getWaitingQueue() {
    try {
      const { data, error } = await cliente_supabase
        .from('requests')
        .select('*')
        .neq('status', 'completed')
        .order('position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error en getWaitingQueue:', error.message);
      throw error;
    }
  }

  
  static async getAllRequests() {
    try {
      const { data, error } = await cliente_supabase
        .from('requests')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error en getAllRequests:', error.message);
      throw error;
    }
  }

  
  static async getRequestById(id) {
    try {
      const { data, error } = await cliente_supabase
        .from('requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getRequestById:', error.message);
      throw error;
    }
  }

  
  static async createRequest(alias, description, estimatedDays = 7) {
    try {
      
      const { data: maxData, error: maxError } = await cliente_supabase
        .from('requests')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      if (maxError && maxError.code !== 'PGRST116') throw maxError;
      
      const nextPosition = (maxData && maxData.length > 0) ? maxData[0].position + 1 : 1;

      const { data, error } = await cliente_supabase
        .from('requests')
        .insert([
          {
            alias,
            description,
            position: nextPosition,
            status: 'waiting',
            estimated_days: estimatedDays
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en createRequest:', error.message);
      throw error;
    }
  }

  
  static async updateRequest(id, updates) {
    try {
      const { data, error } = await cliente_supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en updateRequest:', error.message);
      throw error;
    }
  }

  
  static async deleteRequest(id) {
    try {
      const { error } = await cliente_supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error en deleteRequest:', error.message);
      throw error;
    }
  }

  
  static async updateStatus(id, newStatus) {
    try {
      const { data, error } = await cliente_supabase
        .from('requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en updateStatus:', error.message);
      throw error;
    }
  }

  
  static async getWaitingCount() {
    try {
      const { count, error } = await cliente_supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'completed');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error en getWaitingCount:', error.message);
      throw error;
    }
  }

  
  static subscribeToQueue(callback) {
    const subscription = cliente_supabase
      .channel('requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  }
}

module.exports = QueueService;
