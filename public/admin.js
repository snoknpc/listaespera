
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const addRequestForm = document.getElementById('addRequestForm');
const addPostForm = document.getElementById('addPostForm');
const requestsTable = document.getElementById('requestsTable');
const postsTable = document.getElementById('postsTable');
const logoutBtn = document.getElementById('logoutBtn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editModalClose = editModal?.querySelector('.modal-close');
const filterTabs = document.querySelectorAll('.filter-tab');
const postImageFile = document.getElementById('postImageFile');
const fileName = document.getElementById('fileName');

let authToken = null; 
let currentFilter = 'all';
let allRequests = [];
let allPosts = [];
let selectedImageFile = null;

// Nota: Supabase ya no se inicializa desde el cliente.
// Las imágenes se suben a través del endpoint /admin/api/upload-image del servidor


if (postImageFile) {
  postImageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (file.size > maxSize) {
        fileName.textContent = '❌ Archivo demasiado grande (máx. 5MB)';
        fileName.style.color = 'var(--error)';
        selectedImageFile = null;
        postImageFile.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        fileName.textContent = '❌ El archivo debe ser una imagen';
        fileName.style.color = 'var(--error)';
        selectedImageFile = null;
        postImageFile.value = '';
        return;
      }
      
      selectedImageFile = file;
      fileName.textContent = `✅ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
      fileName.style.color = 'var(--text-secondary)';
      console.log('📁 Archivo seleccionado:', file.name);
    }
  });
}



loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');

  console.log('📤 Enviando login:', { username });
  loginError.textContent = '';

  try {
    const response = await fetch('/admin/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('📥 Response status:', response.status);
    const data = await response.json();
    console.log('📥 Response data:', data);

    if (data.success) {
      console.log('✅ Login exitoso!');
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      showAdminPanel();
    } else {
      console.log('❌ Login fallido:', data.message);
      loginError.textContent = data.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    console.error('❌ Error en login:', error);
    loginError.textContent = 'Error al conectar con el servidor';
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/admin/api/logout', { method: 'POST', credentials: 'include' });
    showLoginPanel();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
});



function showLoginPanel() {
  loginSection.classList.remove('hidden');
  adminSection.classList.add('hidden');
}

function showAdminPanel() {
  loginSection.classList.add('hidden');
  adminSection.classList.remove('hidden');
  loadRequests();
  loadPosts();
}



async function loadRequests() {
  try {
    const response = await fetch('/admin/api/requests', { credentials: 'include' });

    const data = await response.json();

    if (data.success) {
      allRequests = data.requests;
      renderRequests();
    }
  } catch (error) {
    console.error('Error cargando requests:', error);
  }
}



function renderRequests() {
  const filtered = currentFilter === 'all' 
    ? allRequests 
    : allRequests.filter(r => r.status === currentFilter);

  if (filtered.length === 0) {
    requestsTable.innerHTML = '<div class="loading"><p>No hay requests</p></div>';
    return;
  }

  requestsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Alias</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Días</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(req => `
          <tr>
            <td>${req.position}</td>
            <td>${escapeHtml(req.alias)}</td>
            <td>${escapeHtml(req.description.substring(0, 50))}...</td>
            <td>
              <select onchange="updateStatus('${req.id}', this.value)" class="status-select">
                <option value="waiting" ${req.status === 'waiting' ? 'selected' : ''}>En Espera</option>
                <option value="in_progress" ${req.status === 'in_progress' ? 'selected' : ''}>En Proceso</option>
                <option value="completed" ${req.status === 'completed' ? 'selected' : ''}>Completado</option>
              </select>
            </td>
            <td>${req.estimated_days}</td>
            <td>
              <div class="actions">
                <button class="btn btn-edit" onclick="openEditModal('${req.id}')">Editar</button>
                <button class="btn btn-delete" onclick="deleteRequest('${req.id}')">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

addRequestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const alias = document.getElementById('newAlias').value;
  const description = document.getElementById('newDescription').value;
  const estimatedDays = document.getElementById('newEstimatedDays').value;
  const addError = document.getElementById('addError');

  addError.textContent = '';

  try {
    const response = await fetch('/admin/api/requests', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alias,
        description,
        estimatedDays: parseInt(estimatedDays)
      })
    });

    const data = await response.json();

    if (data.success) {
      addRequestForm.reset();
      document.getElementById('newEstimatedDays').value = '7';
      await loadRequests();
    } else {
      addError.textContent = data.message || 'Error al crear el request';
    }
  } catch (error) {
    console.error('Error creando request:', error);
    addError.textContent = 'Error al conectar con el servidor';
  }
});



async function openEditModal(requestId) {
  const request = allRequests.find(r => r.id === requestId);
  
  if (!request) return;

  document.getElementById('editId').value = request.id;
  document.getElementById('editAlias').value = request.alias;
  document.getElementById('editDescription').value = request.description;
  document.getElementById('editEstimatedDays').value = request.estimated_days;
  document.getElementById('editStatus').value = request.status;

  editModal.classList.add('active');
}

editForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const alias = document.getElementById('editAlias').value;
  const description = document.getElementById('editDescription').value;
  const estimatedDays = document.getElementById('editEstimatedDays').value;
  const status = document.getElementById('editStatus').value;
  const editError = document.getElementById('editError');

  editError.textContent = '';

  try {
    const response = await fetch(`/admin/api/requests/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alias,
        description,
        estimatedDays: parseInt(estimatedDays),
        status
      })
    });

    const data = await response.json();

    if (data.success) {
      editModal.classList.remove('active');
      await loadRequests();
    } else {
      editError.textContent = data.message || 'Error al actualizar';
    }
  } catch (error) {
    console.error('Error actualizando request:', error);
    editError.textContent = 'Error al conectar';
  }
});


editModalClose?.addEventListener('click', () => {
  editModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.classList.remove('active');
  }
});



async function updateStatus(requestId, newStatus) {
  try {
    const response = await fetch(`/admin/api/requests/${requestId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      await loadRequests();
    }
  } catch (error) {
    console.error('Error actualizando estado:', error);
  }
}



async function deleteRequest(requestId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este request?')) {
    return;
  }

  try {
    const response = await fetch(`/admin/api/requests/${requestId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      await loadRequests();
    } else {
      alert(data.message || 'Error al eliminar');
    }
  } catch (error) {
    console.error('Error eliminando:', error);
    alert('Error al conectar');
  }
}



filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.status;
    renderRequests();
  });
});



function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



document.addEventListener('DOMContentLoaded', async () => {
  
  try {
    const response = await fetch('/admin/api/status', { credentials: 'include' });
    const data = await response.json();
    
    if (data.success && data.isAdmin) {
      showAdminPanel();
    } else {
      showLoginPanel();
    }
  } catch (error) {
    console.error('Error verificando sesión:', error);
    showLoginPanel();
  }
});


const style = document.createElement('style');
style.textContent = `
  .status-select {
    padding: 0.5rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;
document.head.appendChild(style);




async function loadPosts() {
  try {
    const response = await fetch('/admin/api/posts', { credentials: 'include' });

    const data = await response.json();

    if (data.success) {
      allPosts = data.posts;
      renderPosts();
    }
  } catch (error) {
    console.error('Error cargando posts:', error);
  }
}


function renderPosts() {
  if (allPosts.length === 0) {
    postsTable.innerHTML = '<div class="loading"><p>No hay posts aún</p></div>';
    return;
  }

  postsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Tipo</th>
          <th>Publicado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${allPosts.map(post => `
          <tr>
            <td>${escapeHtml(post.title)}</td>
            <td>
              <span class="post-type-badge post-type-${post.post_type}">
                ${post.post_type === 'image' ? '🖼️ Imagen' : '📝 Texto'}
              </span>
            </td>
            <td>
              <input type="checkbox" ${post.is_published ? 'checked' : ''} 
                onchange="togglePostPublished('${post.id}', ${!post.is_published})"
                class="publish-toggle">
            </td>
            <td>
              <div class="actions">
                <button class="btn btn-delete" onclick="deletePost('${post.id}')">Eliminar</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

addPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const postType = document.getElementById('postType').value;
  const postTitle = document.getElementById('postTitle').value;
  const postContent = document.getElementById('postContent').value;
  const postDescription = document.getElementById('postDescription').value;
  const addPostError = document.getElementById('addPostError');

  addPostError.textContent = '';

  if (!postType || !postTitle) {
    addPostError.textContent = 'Completa todos los campos obligatorios';
    return;
  }

  if (postType === 'image' && !selectedImageFile) {
    addPostError.textContent = 'Los posts de imagen requieren una imagen';
    return;
  }

  if (postType === 'text' && !postContent) {
    addPostError.textContent = 'Los posts de texto requieren contenido';
    return;
  }

  try {
    let imageUrl = null;

    
    if (postType === 'image' && selectedImageFile) {
      console.log('🖼️ Iniciando carga de imagen:', selectedImageFile.name);
      try {
        imageUrl = await uploadImageToServer(selectedImageFile);
        if (!imageUrl) {
          addPostError.textContent = 'Error al subir la imagen. Verifica tu conexión e intenta de nuevo.';
          console.error('❌ No se obtuvo URL de la imagen');
          return;
        }
        console.log('✅ Imagen cargada exitosamente:', imageUrl);
      } catch (uploadError) {
        addPostError.textContent = uploadError.message || 'Error al subir la imagen. Intenta de nuevo.';
        console.error('❌ Error en carga de imagen:', uploadError.message);
        return;
      }
    }

    const response = await fetch('/admin/api/posts', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_type: postType,
        title: postTitle,
        content: postType === 'text' ? postContent : postDescription || postTitle,
        image_url: imageUrl,
        description: postDescription || undefined
      })
    });

    const data = await response.json();

    if (data.success) {
      addPostForm.reset();
      document.getElementById('postType').value = '';
      selectedImageFile = null;
      fileName.textContent = '';
      updatePostTypeFields();
      await loadPosts();
      console.log('✅ Post creado exitosamente');
    } else {
      addPostError.textContent = data.message || 'Error al crear el post';
      console.error('❌ Error en respuesta del servidor:', data.message);
    }
  } catch (error) {
    console.error('❌ Error creando post:', error);
    addPostError.textContent = 'Error al conectar con el servidor: ' + error.message;
  }
});


async function uploadImageToServer(file) {
  return new Promise((resolve, reject) => {
    console.log('📤 Convirtiendo imagen a base64...');
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const base64Data = e.target.result;
        console.log('✅ Conversión completada:', (base64Data.length / 1024).toFixed(2), 'KB');
        
        console.log('📨 Enviando a servidor...');
        const response = await fetch('/admin/api/upload-image', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            base64Data,
            fileName: file.name,
            fileType: file.type
          })
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', response.headers.get('content-type'));
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          const text = await response.text();
          console.error('❌ Error HTTP:', response.status, response.statusText);
          console.error('📄 Respuesta del servidor:', text.substring(0, 500));
          reject(new Error(`Error HTTP ${response.status}: ${response.statusText}`));
          return;
        }
        
        // Intentar parsear como JSON
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('❌ Error al parsear JSON');
          const text = await response.text();
          console.error('📄 Contenido de respuesta:', text.substring(0, 500));
          reject(new Error('Respuesta inválida del servidor'));
          return;
        }
        
        if (data.success && data.imageUrl) {
          console.log('✅ Imagen subida exitosamente:', data.imageUrl);
          resolve(data.imageUrl);
        } else {
          console.error('❌ Error en respuesta del servidor:', data.message);
          reject(new Error(data.message || 'Error al subir la imagen'));
        }
      } catch (error) {
        console.error('❌ Error en uploadImageToServer:', error.message);
        console.error('📍 Stack:', error.stack);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('❌ Error al leer el archivo:', error);
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}


function updatePostTypeFields() {
  const postType = document.getElementById('postType').value;
  const contentGroup = document.getElementById('postContentGroup');
  const imageGroup = document.getElementById('postImageGroup');
  const descriptionGroup = document.getElementById('postDescriptionGroup');

  if (postType === 'text') {
    contentGroup.style.display = 'block';
    imageGroup.style.display = 'none';
    descriptionGroup.style.display = 'none';
    document.getElementById('postContent').required = true;
    selectedImageFile = null;
    fileName.textContent = '';
  } else if (postType === 'image') {
    contentGroup.style.display = 'none';
    imageGroup.style.display = 'block';
    descriptionGroup.style.display = 'block';
    document.getElementById('postContent').required = false;
  } else {
    contentGroup.style.display = 'block';
    imageGroup.style.display = 'none';
    descriptionGroup.style.display = 'none';
    document.getElementById('postContent').required = false;
    selectedImageFile = null;
    fileName.textContent = '';
  }
}

async function togglePostPublished(postId, newStatus) {
  try {
    const response = await fetch(`/admin/api/posts/${postId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        is_published: newStatus
      })
    });

    const data = await response.json();

    if (data.success) {
      await loadPosts();
    }
  } catch (error) {
    console.error('Error actualizando estado de publicación:', error);
  }
}


async function deletePost(postId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
    return;
  }

  try {
    const response = await fetch(`/admin/api/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      await loadPosts();
    } else {
      alert(data.message || 'Error al eliminar el post');
    }
  } catch (error) {
    console.error('Error eliminando post:', error);
    alert('Error al conectar');
  }
}
