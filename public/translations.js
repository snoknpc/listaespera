const translations = {
  en: {
    // Header
    tagline: 'Requests • Digital Art • Animation',
    
    // Hero section
    myQueue: 'My Waiting List',
    currentPositions: 'Current positions for new requests',
    waitingFor: 'Waiting',
    newClientTime: 'Time for new customer',
    
    // Ko-fi section
    skipQueue: 'Want to skip the line?',
    priorityDescription: 'For just $6 USD I can prioritize your request',
    kofiButton: ' Go to Ko-fi',
    
    // Queue section
    currentQueue: 'Current Queue',
    emptyQueue: ' The queue is empty! I can still take more requests.',
    noNews: 'No posts yet',
    newsError: 'Error loading posts',
    estimatedTotal: 'Estimated total time',
    clickForDetails: 'Click for more details',
    days: 'days',
    
    // Status labels
    waiting: 'Waiting',
    in_progress: 'In Progress',
    completed: 'Completed',
    
    // Modal
    description: 'Description',
    status: 'Status',
    estimatedTimeFor: 'Estimated time for this request',
    accumulatedTime: 'Accumulated time (including previous requests)',
    createdDate: 'Creation date',
    passToQueue: 'Move to priority queue',
    timeNewPerson: 'time it would take a new person to reach here',
    approximately: 'approximately',
    
    // Footer
    copyright: 'Send me a private message to add you',
    
    
    news: ' News',
    
    
    errorLoadingQueue: 'Error loading queue',
    loadingQueue: 'Loading list...',
  },
  es: {
    
    tagline: 'Requests • Digital Art • Animation',
    
    
    myQueue: 'Mi Lista de Espera',
    currentPositions: 'Posiciones actuales para nuevos requests',
    waitingFor: 'en espera',
    newClientTime: 'tiempo nuevo cliente',
    
    
    skipQueue: '¿Quieres saltarte la fila?',
    priorityDescription: 'Por solo $6 USD puedo priorizar tu request',
    kofiButton: ' Ir a Ko-fi',
    
    
    currentQueue: 'Cola Actual',
    emptyQueue: ' ¡La cola está vacía! Aún puedo tomar más requests.',
    noNews: 'Aún no hay posts',
    newsError: 'Error al cargar posts',
    estimatedTotal: 'Tiempo estimado total',
    clickForDetails: 'Click para más detalles',
    days: 'días',
    
    
    waiting: 'En Espera',
    in_progress: 'En Proceso',
    completed: 'Completado',
    
    
    description: 'Descripción',
    status: 'Estado',
    estimatedTimeFor: 'Tiempo estimado para esta request',
    accumulatedTime: 'Tiempo acumulado (incluyendo requests anteriores)',
    createdDate: 'Fecha de creación',
    passToQueue: 'Pasar a cola prioritaria',
    timeNewPerson: 'tiempo que tardaria una persona nueva en llegar aqui',
    approximately: 'aproximadamente',
    
   
    copyright: 'Enviame mensaje privado para añadirte',
    
    
    news: ' Novedades',
    
    // Error messages
    errorLoadingQueue: 'Error al cargar la cola',
    loadingQueue: 'Cargando lista...',
  }
};

function getTranslation(key, lang = getCurrentLanguage()) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    return true;
  }
  return false;
}
