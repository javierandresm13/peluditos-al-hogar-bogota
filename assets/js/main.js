// ============================================
// PETS LOVE BOGOTÁ — Main JavaScript
// ============================================

// Application State
let appData = {
  site: null,
  services: null,
  products: null,
  loyalty: null,
  gallery: null
};

// Load all data
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
      renderSite();
      return;
    } catch (err) {
      console.warn('Embedded data failed, trying fetch:', err);
    }
  }
  
  // Fallback: fetch from server (works on GitHub Pages)
  try {
    const [site, services, products, loyalty, gallery] = await Promise.all([
      fetch('./data/site.json').then(r => r.json()),
      fetch('./data/services.json').then(r => r.json()),
      fetch('./data/products.json').then(r => r.json()),
      fetch('./data/loyalty.json').then(r => r.json()),
      fetch('./data/gallery.json').then(r => r.json())
    ]);
    
    appData = { site, services, products, loyalty, gallery };
    renderSite();
  } catch (err) {
    console.error('Error loading data:', err);
    loadFallback();
  }
}

// Fallback for GitHub Pages (absolute paths)
async function loadFallback() {
  try {
    const base = window.location.pathname.includes('/peluditos-al-hogar-bogota/') 
      ? '/peluditos-al-hogar-bogota' 
      : '.';
    const [site, services, products, loyalty, gallery] = await Promise.all([
      fetch(\`\${base}/data/site.json\`).then(r => r.json()),
      fetch(\`\${base}/data/services.json\`).then(r => r.json()),
      fetch(\`\${base}/data/products.json\`).then(r => r.json()),
      fetch(\`\${base}/data/loyalty.json\`).then(r => r.json()),
      fetch(\`\${base}/data/gallery.json\`).then(r => r.json())
    ]);
    
    appData = { site, services, products, loyalty, gallery };
    renderSite();
  } catch (err) {
    console.error('Fallback also failed:', err);
    document.getElementById('app').innerHTML = '<p style="text-align:center;padding:100px 20px;color:var(--gray)">Error cargando el contenido. Intenta recargar la página.<br><br>💡 Si abriste esta página desde tu PC, sírvela con un servidor local o actívala en GitHub Pages.</p>';
  }
}

// Render the full site
function renderSite() {
  if (!appData.site) return;
  
  document.title = appData.site.site.name + ' | ' + appData.site.site.tagline;
  
  renderHero();
  renderAbout();
  renderServices();
  renderProducts();
  renderGallery();
  renderLoyalty();
  renderContact();
  renderFooter();
  renderWhatsAppFloat();
}

// ===== RENDER FUNCTIONS =====

function renderHero() {
  const s = appData.site;
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  hero.querySelector('h1').innerHTML = s.hero.title;
  hero.querySelector('.subtitle').textContent = s.hero.subtitle;
  hero.querySelector('.hero-content p').textContent = s.hero.description;
  hero.querySelector('.hero-buttons .btn-primary').href = s.hero.cta_link;
  hero.querySelector('.hero-buttons .btn-primary').innerHTML = `💬 ${s.hero.cta_text}`;
  hero.querySelector('.hero-badge').innerHTML = `🐾 ${s.site.name} · ${s.site.tagline.split(' ').slice(0,3).join(' ')}`;
  
  // Set hero image
  if (s.hero.image) {
    const imgContainer = hero.querySelector('.hero-image-placeholder');
    if (imgContainer) {
      imgContainer.style.backgroundImage = `url('${s.hero.image}')`;
      imgContainer.style.backgroundSize = 'cover';
      imgContainer.style.backgroundPosition = 'center';
      imgContainer.textContent = '';
    }
  }
}

function renderAbout() {
  const s = appData.site;
  const about = document.getElementById('about');
  if (!about) return;
  
  about.querySelector('h2').innerHTML = s.about.title;
  about.querySelector('.section-header p').textContent = s.about.subtitle;
  about.querySelector('.about-content p').textContent = s.about.description;
  
  const list = about.querySelector('.about-highlights');
  list.innerHTML = s.about.highlights.map(h => `<li>${h}</li>`).join('');
  
  // Set about image
  if (s.about.image) {
    const imgContainer = about.querySelector('.about-image-placeholder');
    if (imgContainer) {
      imgContainer.style.backgroundImage = `url('${s.about.image}')`;
      imgContainer.style.backgroundSize = 'cover';
      imgContainer.style.backgroundPosition = 'center';
      imgContainer.textContent = '';
    }
  }
}

function renderServices() {
  const data = appData.services;
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  let html = '';
  data.categories.forEach(cat => {
    html += `
      <div class="service-category">
        <div class="service-category-header">
          <span class="service-category-icon">${cat.icon}</span>
          <h3>${cat.name}</h3>
        </div>
        <div class="service-items">
          ${cat.items.map(item => `
            <div class="service-card${item.featured ? ' featured' : ''}">
              <h4>${item.name}${item.featured ? ' <span class="service-badge">POPULAR</span>': ''}</h4>
              <p>${item.description}</p>
              <div class="price">${item.price}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += `<div class="services-note">📌 ${data.notes}</div>`;
  container.innerHTML = html;
}

function renderProducts() {
  const data = appData.products;
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  const productIcons = ['🧴', '🧪', '🌸', '🪥', '🪮', '✂️', '🧺', '🎁'];
  
  let html = '';
  data.products.forEach((prod, idx) => {
    const catName = data.categories.find(c => c.id === prod.category)?.name || prod.category;
    const hasImg = prod.image ? true : false;
    const imgStyle = prod.image 
      ? `style="background-image: url('${prod.image}'); background-size: cover; background-position: center;"`
      : '';
    
    html += `
      <div class="product-card${prod.featured ? ' featured' : ''}">
        ${prod.featured ? '<span class="product-badge">⭐ Recomendado</span>' : ''}
        <div class="product-icon" ${imgStyle}>${!hasImg ? productIcons[idx % productIcons.length] : ''}</div>
        <span class="product-category">${catName}</span>
        <h4>${prod.name}</h4>
        <p>${prod.description}</p>
        <div class="product-price">${prod.price}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function renderGallery() {
  const data = appData.gallery;
  const container = document.getElementById('gallery-grid');
  if (!container) return;
  
  const petEmojis = ['🐕', '🐩', '🐕‍🦺', '🐈', '🐈‍⬛', '🦮'];
  
  let html = '';
  data.photos.forEach((photo, idx) => {
    const imgSrc = photo.src ? photo.src : '';
    const imgStyle = imgSrc 
      ? `background-image: url('${imgSrc}'); background-size: cover; background-position: center;`
      : '';
    const emoji = petEmojis[idx % petEmojis.length];
    
    html += `
      <div class="gallery-item" style="${imgStyle}">
        ${!imgSrc ? `<span class="placeholder-icon">${emoji}</span>` : ''}
        <div class="gallery-overlay">
          <h4>${photo.title}</h4>
          <p>${photo.description}</p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function renderLoyalty() {
  const data = appData.loyalty;
  const container = document.getElementById('loyalty-grid');
  if (!container) return;
  
  const checkEmoji = '✅';
  
  let html = '';
  data.plans.forEach(plan => {
    html += `
      <div class="loyalty-card" style="--plan-color: ${plan.color}">
        <div class="plan-icon">${plan.icon}</div>
        <h3>${plan.name}</h3>
        <p class="plan-desc">${plan.description}</p>
        <ul class="plan-benefits">
          ${plan.benefits.map(b => `<li><span>${checkEmoji}</span> ${b}</li>`).join('')}
        </ul>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  const note = document.querySelector('.loyalty-note p');
  if (note) note.textContent = data.note;
}

function renderContact() {
  const s = appData.site.contact;
  const contact = document.getElementById('contact');
  if (!contact) return;
  
  contact.querySelector('.contact-item.whatsapp h4').innerHTML = 
    `WhatsApp <span style="font-weight:400;color:var(--gray)">${s.whatsapp_display}</span>`;
  contact.querySelector('.contact-item.whatsapp').href = `https://wa.me/${s.whatsapp}`;
  
  const instaItem = contact.querySelector('.contact-item.instagram');
  if (s.instagram) {
    instaItem.href = `https://instagram.com/${s.instagram}`;
    instaItem.querySelector('h4').innerHTML = `Instagram <span style="font-weight:400;color:var(--gray)">${s.instagram_display}</span>`;
  } else {
    instaItem.href = '#';
    instaItem.querySelector('h4').innerHTML = `Instagram <span style="font-weight:400;color:var(--gray)">(próximamente)</span>`;
  }
  
  contact.querySelector('.contact-item.email p').textContent = s.email;
  contact.querySelector('.contact-whatsapp-btn').href = `https://wa.me/${s.whatsapp}`;
}

function renderFooter() {
  const s = appData.site;
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  footer.querySelector('.footer-brand').textContent = s.site.name;
  footer.querySelector('.copyright').textContent = s.footer.copyright;
  footer.querySelector('.made-with').textContent = s.footer.made_with;
}

function renderWhatsAppFloat() {
  const wa = document.getElementById('whatsapp-float');
  if (!wa) return;
  wa.href = `https://wa.me/${appData.site.contact.whatsapp}`;
}

// ===== NAVIGATION =====
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
  
  // Nav scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadData();
});
