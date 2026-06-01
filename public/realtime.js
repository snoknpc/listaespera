
const queueContainer = document.getElementById('queueContainer');
const totalWaitingEl = document.getElementById('totalWaiting');
const estimatedTimeEl = document.getElementById('estimatedTime');
const detailModal = document.getElementById('detailModal');
const modalClose = document.querySelector('.modal-close');
const postsContainer = document.getElementById('postsContainer');

let currentQueue = [];
let realtimeConnection = null;


if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}
window.addEventListener('click', (e) => {
  if (e.target === detailModal) closeModal();
});


async function loadQueue() {
  try {
    const response = await fetch('/api/queue');
    const data = await response.json();

    if (data.success) {
      currentQueue = data.queue;
      totalWaitingEl.textContent = data.totalWaiting;
      calculateEstimatedTime();
      renderQueue();
    }
  } catch (error) {
    console.error('Error cargando la cola:', error);
    queueContainer.innerHTML = `<div class="loading"><p>${getTranslation('errorLoadingQueue', getCurrentLanguage())}</p></div>`;
  }
}


async function loadPosts() {
  try {
    const response = await fetch('/api/posts');
    const data = await response.json();

    if (data.success && data.posts.length > 0) {
      renderPosts(data.posts);
    } else {
      postsContainer.innerHTML = `<p style="color: var(--text-tertiary); font-size: 0.9rem;">${getTranslation('noNews', getCurrentLanguage())}</p>`;
    }
  } catch (error) {
    console.error('Error cargando posts:', error);
    postsContainer.innerHTML = `<p style="color: var(--text-tertiary); font-size: 0.9rem;">${getTranslation('newsError', getCurrentLanguage())}</p>`;
  }
}


function renderQueue() {
  if (currentQueue.length === 0) {
    queueContainer.innerHTML = `
      <div class="loading">
        <p>${getTranslation('emptyQueue', getCurrentLanguage())}</p>
      </div>
    `;
    return;
  }

  queueContainer.innerHTML = currentQueue.map((request, index) => {
    const accumulatedTime = currentQueue.slice(0, index + 1)
      .reduce((sum, req) => sum + req.estimated_days, 0);
    
    return `
      <div class="queue-card" onclick="openModal('${request.id}')">
        <div class="card-position">#${request.position}</div>
        <div class="card-alias">${escapeHtml(request.alias)}</div>
        <div class="card-description">${escapeHtml(request.description)}</div>
        <div class="card-meta">
          <div class="card-time">
            <span>≈ ${request.estimated_days} ${getTranslation('days', getCurrentLanguage())}</span>
            <span class="info-icon" title="${getTranslation('clickForDetails', getCurrentLanguage())}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </span>
          </div>
          <span class="status-badge status-${request.status}">
            ${getStatusLabel(request.status)}
          </span>
        </div>
        <div class="card-accumulated-info">
          ${getTranslation('estimatedTotal', getCurrentLanguage())}: ${accumulatedTime} ${getTranslation('days', getCurrentLanguage())}
        </div>
      </div>
    `;
  }).join('');
}

function renderPosts(posts) {
  postsContainer.innerHTML = posts.map(post => {
    if (post.post_type === 'image') {
      return `
        <div class="post-card post-image">
          <img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.title)}" class="post-image-img">
          <div class="post-content">
            <h4>${escapeHtml(post.title)}</h4>
            ${post.description ? `<p>${escapeHtml(post.description)}</p>` : ''}
          </div>
        </div>
      `;
    } else {
      return `
        <div class="post-card post-text">
          <div class="post-content">
            <h4>${escapeHtml(post.title)}</h4>
            <p>${escapeHtml(post.content)}</p>
          </div>
        </div>
      `;
    }
  }).join('');
}

async function openModal(requestId) {
  try {
    const response = await fetch(`/api/request/${requestId}`);
    const data = await response.json();

    if (data.success) {
      const req = data.request;
      
      const index = currentQueue.findIndex(r => r.id === requestId);
      const accumulatedTime = index >= 0 
        ? currentQueue.slice(0, index + 1).reduce((sum, r) => sum + r.estimated_days, 0)
        : req.estimated_days;
      
      document.getElementById('modalPosition').textContent = `#${req.position} - ${escapeHtml(req.alias)}`;
      document.getElementById('modalAlias').textContent = escapeHtml(req.alias);
      document.getElementById('modalDescription').textContent = escapeHtml(req.description);
      document.getElementById('modalStatus').textContent = getStatusLabel(req.status);
      document.getElementById('modalEstimated').textContent = `${req.estimated_days} ${getTranslation('approximately', getCurrentLanguage())}`;
      document.getElementById('modalAccumulatedTime').textContent = `${accumulatedTime} ${getTranslation('days', getCurrentLanguage())} (${getTranslation('timeNewPerson', getCurrentLanguage())})`;
      
      const createdDate = new Date(req.created_at).toLocaleDateString(getCurrentLanguage() === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      document.getElementById('modalCreatedAt').textContent = createdDate;

      detailModal.classList.add('active');
    }
  } catch (error) {
    console.error('Error abriendo modal:', error);
  }
}


function closeModal() {
  detailModal.classList.remove('active');
}


function getStatusLabel(status) {
  const lang = getCurrentLanguage();
  const labels = {
    'waiting': getTranslation('waiting', lang),
    'in_progress': getTranslation('in_progress', lang),
    'completed': getTranslation('completed', lang)
  };
  return labels[status] || status;
}


function calculateEstimatedTime() {
  if (currentQueue.length === 0) {
    estimatedTimeEl.textContent = '--';
    return;
  }

  const total = currentQueue.reduce((sum, req) => sum + req.estimated_days, 0);
  estimatedTimeEl.textContent = `${total} ${getTranslation('days', getCurrentLanguage())}`;
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


function connectRealtime() {
  
  
  
  setInterval(async () => {
    try {
      const response = await fetch('/api/queue');
      const data = await response.json();

      if (data.success) {
        const queueChanged = JSON.stringify(currentQueue) !== JSON.stringify(data.queue);
        
        if (queueChanged) {
          currentQueue = data.queue;
          totalWaitingEl.textContent = data.totalWaiting;
          calculateEstimatedTime();
          renderQueue();
        }
      }
    } catch (error) {
      console.error('Error en polling de Realtime:', error);
    }
  }, 2000); 

  
  setInterval(async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();

      if (data.success && data.posts.length > 0) {
        renderPosts(data.posts);
      }
    } catch (error) {
      console.error('Error en polling de posts:', error);
    }
  }, 5000);
}


document.addEventListener('DOMContentLoaded', () => {
  loadQueue();
  loadPosts();
  connectRealtime();
});
