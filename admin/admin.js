// ============================================
// PETS LOVE — Admin Panel JavaScript
// ============================================

// Config
const ADMIN_PASSWORD = "petslove2025";
const STORAGE_KEY = "petslove_admin_data";

// Global state
let appData = null;
let editingItemId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  if (sessionStorage.getItem('petslove_admin_logged') === 'true') {
    showAdmin();
  }
  
  // Login on enter key
  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  
  // Sidebar navigation
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });
});

// ===== LOGIN =====
function handleLogin() {
  const pw = document.getElementById('login-password').value;
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem('petslove_admin_logged', 'true');
    showAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function handleLogout() {
  sessionStorage.removeItem('petslove_admin_logged');
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-password').value = '';
}

function showAdmin() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'flex';
  loadData();
}

// ===== DATA LOADING =====
async function loadData() {
  // Try embedded data first (works with file:// protocol)
  if (window.__EMBEDDED_DATA) {
    try {
      appData = {
        site: JSON.parse(window.__EMBEDDED_DATA.site),
        services: JSON.parse(window.__EMBEDDED_DATA.services),
        products: JSON.parse(window.__EMBEDDED_DATA.products),
        loyalty: JSON.parse(window.__EMBEDDED_DATA.loyalty),
        gallery: JSON.parse(window.__EMBEDDED_DATA.gallery)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      renderDashboard();
      renderAllEditors();
      return;
    } catch(e) { console.warn('Admin embedded data failed:', e); }
  }
  
  // Try localStorage second
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appData = JSON.parse(saved);
      renderDashboard();
      renderAllEditors();
      return;
    } catch(e) { /* ignore */ }
  }
  
  // Load from files last
  try {
    const base = window.location.pathname.includes('/peluditos-al-hogar-bogota/admin/')
      ? '../' : '../';
    
    const [site, services, products, loyalty, gallery] = await Promise.all([
      fetch(base + 'data/site.json').then(r => r.json()),
      fetch(base + 'data/services.json').then(r => r.json()),
      fetch(base + 'data/products.json').then(r => r.json()),
      fetch(base + 'data/loyalty.json').then(r => r.json()),
      fetch(base + 'data/gallery.json').then(r => r.json())
    ]);
    
    appData = { site, services, products, loyalty, gallery };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    renderDashboard();
    renderAllEditors();
  } catch(err) {
    console.error('Failed to load data:', err);
    showToast('Error al cargar los datos. Recarga la página.', 'error');
  }
}

// ===== NAVIGATION =====
function navigateTo(section) {
  // Update sidebar
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.querySelector(`.sidebar-nav a[data-section="${section}"]`)?.classList.add('active');
  
  // Show section
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`)?.classList.add('active');
  
  // Update title
  const titles = {
    'dashboard': 'Dashboard',
    'hero': 'Hero / Inicio',
    'about': 'Nosotros',
    'services': 'Servicios',
    'products': 'Productos',
    'gallery': 'Galería',
    'loyalty': 'Planes de Fidelidad',
    'contact': 'Contacto',
    'publish': 'Publicar cambios'
  };
  document.getElementById('section-title').textContent = titles[section] || section;
}

// ===== DASHBOARD =====
function renderDashboard() {
  if (!appData) return;
  const stats = document.getElementById('dashboard-stats');
  
  const servicesCount = appData.services.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const productsCount = appData.products.products.length;
  const galleryCount = appData.gallery.photos.length;
  const loyaltyCount = appData.loyalty.plans.length;
  
  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">🛁</div>
      <h3>Servicios</h3>
      <div class="stat-value">${servicesCount}</div>
      <div class="stat-sub">en ${appData.services.categories.length} categorías</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🧴</div>
      <h3>Productos</h3>
      <div class="stat-value">${productsCount}</div>
      <div class="stat-sub">en ${appData.products.categories.length} categorías</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📸</div>
      <h3>Fotos en galería</h3>
      <div class="stat-value">${galleryCount}</div>
      <div class="stat-sub">${appData.gallery.photos.filter(p => p.featured).length} destacadas</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🎁</div>
      <h3>Planes de fidelidad</h3>
      <div class="stat-value">${loyaltyCount}</div>
      <div class="stat-sub">activos</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📞</div>
      <h3>WhatsApp</h3>
      <div class="stat-value" style="font-size:1.1rem">${appData.site.contact.whatsapp_display}</div>
      <div class="stat-sub">${appData.site.contact.instagram ? 'IG: @' + appData.site.contact.instagram : 'Instagram pendiente'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🏷️</div>
      <h3>Nombre del sitio</h3>
      <div class="stat-value" style="font-size:1.1rem">${appData.site.site.name}</div>
      <div class="stat-sub">${appData.site.site.tagline}</div>
    </div>
  `;
}

// ===== RENDER ALL EDITORS =====
function renderAllEditors() {
  if (!appData) return;
  
  renderHeroEditor();
  renderAboutEditor();
  renderServicesEditor();
  renderProductsEditor();
  renderGalleryEditor();
  renderLoyaltyEditor();
  renderContactEditor();
}

// ===== HERO =====
function renderHeroEditor() {
  const h = appData.site.hero;
  document.getElementById('hero-title').value = h.title;
  document.getElementById('hero-subtitle').value = h.subtitle;
  document.getElementById('hero-description').value = h.description;
  document.getElementById('hero-cta-text').value = h.cta_text;
  document.getElementById('hero-cta-link').value = h.cta_link;
}

function saveHero() {
  appData.site.hero.title = document.getElementById('hero-title').value;
  appData.site.hero.subtitle = document.getElementById('hero-subtitle').value;
  appData.site.hero.description = document.getElementById('hero-description').value;
  appData.site.hero.cta_text = document.getElementById('hero-cta-text').value;
  appData.site.hero.cta_link = document.getElementById('hero-cta-link').value;
  saveAllData();
  showToast('✅ Hero actualizado correctamente', 'success');
}

// ===== ABOUT =====
function renderAboutEditor() {
  const a = appData.site.about;
  document.getElementById('about-title').value = a.title;
  document.getElementById('about-subtitle').value = a.subtitle;
  document.getElementById('about-description').value = a.description;
  document.getElementById('about-highlights').value = a.highlights.join('\n');
}

function saveAbout() {
  appData.site.about.title = document.getElementById('about-title').value;
  appData.site.about.subtitle = document.getElementById('about-subtitle').value;
  appData.site.about.description = document.getElementById('about-description').value;
  appData.site.about.highlights = document.getElementById('about-highlights').value.split('\n').filter(h => h.trim());
  saveAllData();
  showToast('✅ Sección Nosotros actualizada', 'success');
}

// ===== SERVICES =====
function renderServicesEditor() {
  const container = document.getElementById('services-editor');
  if (!container || !appData.services) return;
  
  let html = '';
  appData.services.categories.forEach((cat, ci) => {
    html += `
      <div class="editor-card" style="margin-bottom:15px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="font-size:1rem">${cat.icon} ${cat.name}</h3>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="removeServiceCategory(${ci})">🗑️</button>
        </div>
        <div style="margin-bottom:10px">
          <input type="text" value="${escapeHtml(cat.name)}" onchange="updateServiceCategory(${ci}, 'name', this.value)" placeholder="Nombre categoría" style="padding:8px 12px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem;width:200px">
          <input type="text" value="${escapeHtml(cat.icon)}" onchange="updateServiceCategory(${ci}, 'icon', this.value)" placeholder="Icono" style="padding:8px 12px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem;width:60px;margin-left:8px">
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${cat.items.map((item, ii) => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--admin-bg);border-radius:6px">
              <input type="text" value="${escapeHtml(item.name)}" onchange="updateService(${ci}, ${ii}, 'name', this.value)" placeholder="Nombre" style="flex:2;padding:6px 10px;border:1px solid var(--admin-border);border-radius:4px;font-size:0.8rem">
              <input type="text" value="${escapeHtml(item.price)}" onchange="updateService(${ci}, ${ii}, 'price', this.value)" placeholder="Precio" style="width:100px;padding:6px 10px;border:1px solid var(--admin-border);border-radius:4px;font-size:0.8rem">
              <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="removeService(${ci}, ${ii})" style="padding:4px 8px;font-size:0.8rem">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="btn-admin btn-admin-sm btn-admin-success" onclick="addService(${ci})" style="margin-top:10px;font-size:0.8rem">➕ Agregar servicio</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addServiceCategory() {
  const cat = {
    id: 'cat-' + Date.now(),
    name: 'Nueva categoría',
    icon: '🐾',
    items: []
  };
  appData.services.categories.push(cat);
  renderServicesEditor();
  saveAllData();
}

function removeServiceCategory(index) {
  if (!confirm('¿Eliminar esta categoría y todos sus servicios?')) return;
  appData.services.categories.splice(index, 1);
  renderServicesEditor();
  saveAllData();
  showToast('Categoría eliminada', 'info');
}

function updateServiceCategory(index, field, value) {
  appData.services.categories[index][field] = value;
  saveAllData();
}

function addService(catIndex) {
  appData.services.categories[catIndex].items.push({
    id: 'svc-' + Date.now(),
    name: 'Nuevo servicio',
    description: 'Descripción del servicio',
    price: '$0',
    image: '',
    featured: false
  });
  renderServicesEditor();
  saveAllData();
}

function updateService(catIndex, itemIndex, field, value) {
  appData.services.categories[catIndex].items[itemIndex][field] = value;
  saveAllData();
}

function removeService(catIndex, itemIndex) {
  if (!confirm('¿Eliminar este servicio?')) return;
  appData.services.categories[catIndex].items.splice(itemIndex, 1);
  renderServicesEditor();
  saveAllData();
}

// ===== PRODUCTS =====
function renderProductsEditor() {
  const container = document.getElementById('products-editor');
  if (!container) return;
  
  const icons = ['🧴', '🧪', '🌸', '🪥', '🪮', '✂️', '🧺', '🎁'];
  const catOptions = appData.products.categories.map(c => 
    `<option value="${c.id}">${c.icon} ${c.name}</option>`
  ).join('');
  
  let html = '';
  appData.products.products.forEach((prod, i) => {
    html += `
      <div class="editor-card" style="margin-bottom:10px;padding:15px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="font-size:1.5rem">${icons[i % icons.length]}</span>
          <input type="text" value="${escapeHtml(prod.name)}" onchange="updateProduct(${i}, 'name', this.value)" placeholder="Nombre" style="flex:2;min-width:150px;padding:8px 12px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem">
          <input type="text" value="${escapeHtml(prod.price)}" onchange="updateProduct(${i}, 'price', this.value)" placeholder="Precio" style="width:100px;padding:8px 12px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem">
          <select onchange="updateProduct(${i}, 'category', this.value)" style="padding:8px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem">
            ${catOptions.replace(`value="${prod.category}"`, `value="${prod.category}" selected`)}
          </select>
          <label style="display:flex;align-items:center;gap:5px;font-size:0.85rem;cursor:pointer">
            <input type="checkbox" ${prod.featured ? 'checked' : ''} onchange="updateProduct(${i}, 'featured', this.checked)"> Destacado
          </label>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="removeProduct(${i})" style="padding:4px 8px">✕</button>
        </div>
        <div style="margin-top:8px">
          <input type="text" value="${escapeHtml(prod.description)}" onchange="updateProduct(${i}, 'description', this.value)" placeholder="Descripción" style="width:100%;padding:6px 12px;border:1px solid var(--admin-border);border-radius:6px;font-size:0.8rem">
        </div>
        <div style="margin-top:5px">
          <input type="text" value="${escapeHtml(prod.image || '')}" onchange="updateProduct(${i}, 'image', this.value)" placeholder="URL de imagen (opcional)" style="width:100%;padding:6px 12px;border:1px solid var(--admin-border);border-radius:6px;font-size:0.8rem;color:var(--admin-text-light)">
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addProduct() {
  appData.products.products.push({
    id: 'prod-' + Date.now(),
    name: 'Nuevo producto',
    description: 'Descripción del producto',
    price: '$0',
    category: appData.products.categories[0]?.id || 'shampoos',
    image: '',
    featured: false
  });
  renderProductsEditor();
  saveAllData();
}

function updateProduct(index, field, value) {
  appData.products.products[index][field] = value;
  saveAllData();
}

function removeProduct(index) {
  if (!confirm('¿Eliminar este producto?')) return;
  appData.products.products.splice(index, 1);
  renderProductsEditor();
  saveAllData();
}

// ===== GALLERY =====
function renderGalleryEditor() {
  const container = document.getElementById('gallery-editor');
  if (!container) return;
  
  let html = '';
  appData.gallery.photos.forEach((photo, i) => {
    html += `
      <div class="editor-card" style="margin-bottom:10px;padding:15px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div style="width:50px;height:50px;border-radius:8px;background:${photo.src ? `url('${escapeHtml(photo.src)}') center/cover` : 'linear-gradient(135deg, #f0faf7, #fce4d6)'};flex-shrink:0"></div>
          <input type="text" value="${escapeHtml(photo.title)}" onchange="updateGallery(${i}, 'title', this.value)" placeholder="Título" style="flex:1;min-width:120px;padding:8px 10px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem">
          <input type="text" value="${escapeHtml(photo.src)}" onchange="updateGallery(${i}, 'src', this.value)" placeholder="URL de imagen" style="flex:2;min-width:150px;padding:8px 10px;border:2px solid var(--admin-border);border-radius:8px;font-size:0.85rem;color:var(--admin-text-light)">
          <label style="display:flex;align-items:center;gap:5px;font-size:0.85rem;cursor:pointer">
            <input type="checkbox" ${photo.featured ? 'checked' : ''} onchange="updateGallery(${i}, 'featured', this.checked)"> Destacada
          </label>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="removeGallery(${i})" style="padding:4px 8px">✕</button>
        </div>
        <div style="margin-top:6px">
          <input type="text" value="${escapeHtml(photo.description)}" onchange="updateGallery(${i}, 'description', this.value)" placeholder="Descripción" style="width:100%;padding:6px 10px;border:1px solid var(--admin-border);border-radius:6px;font-size:0.8rem">
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function addGalleryItem() {
  appData.gallery.photos.push({
    id: 'gallery-' + Date.now(),
    title: 'Nueva foto',
    description: 'Descripción',
    src: '',
    featured: false
  });
  renderGalleryEditor();
  saveAllData();
}

function updateGallery(index, field, value) {
  appData.gallery.photos[index][field] = value;
  saveAllData();
}

function removeGallery(index) {
  if (!confirm('¿Eliminar esta foto?')) return;
  appData.gallery.photos.splice(index, 1);
  renderGalleryEditor();
  saveAllData();
}

// ===== LOYALTY =====
function renderLoyaltyEditor() {
  const container = document.getElementById('loyalty-editor');
  if (!container) return;
  
  let html = '';
  appData.loyalty.plans.forEach((plan, i) => {
    html += `
      <div class="editor-card" style="margin-bottom:15px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <h3 style="font-size:1rem">${plan.icon} ${plan.name}</h3>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="removeLoyaltyPlan(${i})">🗑️</button>
        </div>
        <div class="form-row" style="margin-bottom:8px">
          <div class="form-group">
            <label>Nombre del plan</label>
            <input type="text" value="${escapeHtml(plan.name)}" onchange="updateLoyaltyPlan(${i}, 'name', this.value)">
          </div>
          <div class="form-group">
            <label>Icono</label>
            <input type="text" value="${escapeHtml(plan.icon)}" onchange="updateLoyaltyPlan(${i}, 'icon', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <input type="text" value="${escapeHtml(plan.description)}" onchange="updateLoyaltyPlan(${i}, 'description', this.value)">
        </div>
        <div class="form-group">
          <label>Beneficios <span class="hint">(uno por línea)</span></label>
          <textarea rows="4" onchange="updateLoyaltyBenefits(${i}, this.value)">${escapeHtml(plan.benefits.join('\n'))}</textarea>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  
  // Note
  document.getElementById('loyalty-note').value = appData.loyalty.note;
}

function addLoyaltyPlan() {
  appData.loyalty.plans.push({
    id: 'plan-' + Date.now(),
    name: 'Nuevo plan',
    icon: '⭐',
    description: 'Descripción del plan',
    benefits: ['Beneficio 1', 'Beneficio 2', 'Beneficio 3'],
    color: '#e88d5a'
  });
  renderLoyaltyEditor();
  saveAllData();
}

function updateLoyaltyPlan(index, field, value) {
  appData.loyalty.plans[index][field] = value;
  saveAllData();
}

function updateLoyaltyBenefits(index, value) {
  appData.loyalty.plans[index].benefits = value.split('\n').filter(b => b.trim());
  saveAllData();
}

function removeLoyaltyPlan(index) {
  if (!confirm('¿Eliminar este plan de fidelidad?')) return;
  appData.loyalty.plans.splice(index, 1);
  renderLoyaltyEditor();
  saveAllData();
}

function saveLoyaltyNote() {
  appData.loyalty.note = document.getElementById('loyalty-note').value;
  saveAllData();
  showToast('✅ Nota de planes guardada', 'success');
}

// ===== CONTACT =====
function renderContactEditor() {
  const c = appData.site.contact;
  document.getElementById('contact-whatsapp').value = c.whatsapp;
  document.getElementById('contact-whatsapp-display').value = c.whatsapp_display;
  document.getElementById('contact-instagram').value = c.instagram || '';
  document.getElementById('contact-instagram-display').value = c.instagram_display || '';
  document.getElementById('contact-email').value = c.email;
}

function saveContact() {
  appData.site.contact.whatsapp = document.getElementById('contact-whatsapp').value;
  appData.site.contact.whatsapp_display = document.getElementById('contact-whatsapp-display').value;
  appData.site.contact.instagram = document.getElementById('contact-instagram').value;
  appData.site.contact.instagram_display = document.getElementById('contact-instagram-display').value;
  appData.site.contact.email = document.getElementById('contact-email').value;
  saveAllData();
  showToast('✅ Contacto actualizado', 'success');
}

// ===== SAVE / LOAD =====
function saveAllData() {
  if (!appData) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  renderDashboard();
}

// ===== PUBLISH =====
function downloadAllData() {
  if (!appData) return;
  
  const files = {
    'site.json': appData.site,
    'services.json': appData.services,
    'products.json': appData.products,
    'gallery.json': appData.gallery,
    'loyalty.json': appData.loyalty
  };
  
  Object.entries(files).forEach(([name, data]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  showToast('📥 Datos descargados. Súbelos a GitHub para publicar.', 'success');
}

function previewChanges() {
  const area = document.getElementById('json-preview-area');
  const content = document.getElementById('json-preview-content');
  
  if (area.style.display === 'block') {
    area.style.display = 'none';
    return;
  }
  
  const preview = {
    site: appData.site,
    services_count: appData.services.categories.reduce((a, c) => a + c.items.length, 0),
    products_count: appData.products.products.length,
    gallery_count: appData.gallery.photos.length,
    loyalty_plans: appData.loyalty.plans.length
  };
  
  content.textContent = JSON.stringify(preview, null, 2);
  area.style.display = 'block';
}

// ===== UTILITIES =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
