# 🐾 PETS LOVE BOGOTÁ — Documentación del Proyecto

**Fecha:** 2026-06-21 15:34
**Repositorio:** https://github.com/javierandresm13/peluditos-al-hogar-bogota
**Sitio web:** https://javierandresm13.github.io/peluditos-al-hogar-bogota/
**Admin:** https://javierandresm13.github.io/peluditos-al-hogar-bogota/admin/

---

## 📋 ÍNDICE

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Arquitectura técnica](#2-arquitectura-técnica)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Cómo funciona](#4-cómo-funciona)
5. [Panel de administración](#5-panel-de-administración)
6. [Publicación de cambios](#6-publicación-de-cambios)
7. [Imágenes utilizadas](#7-imágenes-utilizadas)
8. [Configuración inicial](#8-configuración-inicial)
9. [Estadísticas del proyecto](#9-estadísticas-del-proyecto)
10. [Contacto](#10-contacto)

---

## 1. Resumen del proyecto

Sitio web profesional para **Pets Love**, servicio de peluquería canina y mascotas a domicilio en Bogotá, Colombia.

### Características principales:
- ✅ Landing page moderna y responsive
- ✅ Panel de administración para el dueño (edición sin código)
- ✅ Publicación con 1 clic a GitHub Pages
- ✅ Whatsapp integrado para contacto inmediato
- ✅ Galería de fotos de mascotas
- ✅ Catálogo de servicios con precios
- ✅ Tienda de productos de aseo canino
- ✅ Planes de fidelidad
- ✅ Funciona desde cualquier dispositivo (celular, tablet, PC)
- ✅ 100% gratuito (sin costos de hosting)

---

## 2. Arquitectura técnica

| Componente | Tecnología | Costo |
|------------|-----------|-------|
| Frontend | HTML5 + CSS3 + JavaScript vanilla | $0 |
| Panel admin | JavaScript + GitHub API | $0 |
| Hosting | GitHub Pages | $0 |
| Repositorio | GitHub | $0 |
| Imágenes | Unsplash (gratis) + ImgBB (para fotos del dueño) | $0 |
| Fuentes | Sistema (Segoe UI / system-ui) | $0 |

### Flujo de datos:

```
Usuario abre página web
        │
        ▼
  index.html ───► Carga datos desde:
                   ├── Datos embebidos (file://)
                   └── data/*.json (GitHub Pages)
        │
        ▼
  Panel admin (/admin/)
        │
        ├── Edita contenido (localStorage)
        │
        └── Publica ► GitHub API ► Repositorio ► GitHub Pages ► Página web
```

---

## 3. Estructura de archivos

📁 peluditos-al-hogar-bogota/
  📄 .gitignore (165 bytes)
  📄 GUIA_DUENO.md (5,468 bytes)
  📄 GUIA_WHATSAPP.txt (3,126 bytes)
  📄 README.md (2,449 bytes)
  📄 _test_images.html (1,925 bytes)
  📄 index.html (27,462 bytes)
  📁 admin/
    📄 admin.css (11,184 bytes)
    📄 admin.js (30,563 bytes)
    📄 index.html (30,087 bytes)
  📁 assets/
    📁 css/
      📄 styles.css (18,647 bytes)
    📁 images/
    📁 js/
      📄 main.js (11,367 bytes)
  📁 data/
    📄 gallery.json (1,573 bytes)
    📄 loyalty.json (1,448 bytes)
    📄 products.json (3,225 bytes)
    📄 services.json (3,263 bytes)
    📄 site.json (1,835 bytes)

### Descripción de archivos clave:

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Landing page principal del sitio |
| `admin/index.html` | Panel de administración con login |
| `admin/admin.js` | Lógica del panel: edición, GitHub sync, publicación |
| `admin/admin.css` | Estilos del panel admin |
| `assets/css/styles.css` | Estilos del sitio web |
| `assets/js/main.js` | Interactividad del sitio: carga de datos, renderizado |
| `data/site.json` | Contenido textual del sitio (hero, about, contacto) |
| `data/services.json` | Servicios ofrecidos con precios |
| `data/products.json` | Productos de aseo canino |
| `data/gallery.json` | Galería de fotos de mascotas |
| `data/loyalty.json` | Planes de fidelidad |
| `GUIA_DUENO.md` | Guía completa para el dueño |
| `GUIA_WHATSAPP.txt` | Guía rápida para enviar por WhatsApp |

---

## 4. Cómo funciona

### 4.1 Carga del sitio
- El sitio carga datos desde archivos JSON en `data/`
- Cuando se abre desde `file://` (local), usa datos embebidos en el HTML
- Cuando se sirve desde GitHub Pages, usa `fetch()` para cargar los JSON
- El JavaScript renderiza cada sección del sitio dinámicamente

### 4.2 Navegación
- Menú fijo en la parte superior con scroll suave
- Secciones: Inicio → Nosotros → Servicios → Productos → Galería → Planes → Contacto
- Botón flotante de WhatsApp en todas las páginas
- Diseño responsive (se adapta a celular y escritorio)

---

## 5. Panel de administración

### Acceso
```
URL: https://javierandresm13.github.io/peluditos-al-hogar-bogota/admin/
Contraseña: petslove2025
```

### Secciones editables

| Sección | Qué se puede editar |
|---------|-------------------|
| 🏠 Hero | Título, subtítulo, descripción, texto y link del botón CTA |
| 📖 Nosotros | Título, subtítulo, descripción, destacados |
| 🛁 Servicios | Categorías, nombres, descripciones, precios (agregar/eliminar) |
| 🧴 Productos | Nombre, descripción, precio, categoría, imagen, destacado |
| 📸 Galería | Título, descripción, URL de imagen, destacada |
| 🎁 Planes | Nombre, icono, descripción, beneficios |
| 📞 Contacto | WhatsApp, Instagram, email |

### Seguridad
- Login con contraseña (`petslove2025`)
- Token de GitHub guardado en localStorage del navegador
- Solo el scope `repo` es necesario para el token

---

## 6. Publicación de cambios

### Método 1: Publicación con 1 clic (recomendado)
1. Conectar GitHub token una sola vez (ver sección 8)
2. Editar contenido en el admin
3. Ir a "Publicar cambios"
4. Tocar "🚀 Publicar ahora en GitHub"
5. Esperar 1-2 minutos
6. Los cambios se ven en la página web

### Método 2: Manual (respaldo)
1. En "Publicar cambios", tocar "📥 Descargar respaldo"
2. Ir a https://github.com/javierandresm13/peluditos-al-hogar-bogota/tree/main/data
3. Arrastrar los archivos descargados a la carpeta `data/`
4. Tocar "Commit changes"
5. Esperar 1-2 minutos

---

## 7. Imágenes utilizadas

**Hero:** https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80
**About:** https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80

**Galería:**
- Luna después del baño: https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80
- Max con su nuevo corte: https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80
- Pelusa relajada: https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=80
- Rocky feliz: https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80
- Nala consentida: https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80
- Tobby renovado: https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80

**Productos:**
- Shampoo Hipoalergénico 250ml: https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80
- Acondicionador Reparador 250ml: https://images.unsplash.com/photo-1532710093739-9470acff878f?w=400&q=80
- Perfume Canino Fresh 120ml: https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80
- Cepillo Cerdas Suaves: https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80
- Peine Desenredante Profesional: https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80
- Cortauñas Profesional: https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80
- Toalla Microfibra Secado Rápido: https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80
- Kit Viaje: Shampoo + Acondicionador: https://images.unsplash.com/photo-1532710093739-9470acff878f?w=400&q=80

*Todas las imágenes son de Unsplash (licencia gratuita) y Pexels.*

### Para agregar fotos del negocio:
1. Subir a https://imgbb.com (gratis)
2. Copiar "Direct link"
3. Pegar en el admin (galería o productos)
4. Publicar cambios

---

## 8. Configuración inicial

### 8.1 Token de GitHub (una sola vez)
1. Ir a https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Nombre: `petslove-admin`
4. Scope: `repo`
5. Generar y copiar el token
6. En el admin → "Publicar cambios" → pegar token → "Conectar"

### 8.2 GitHub Pages
Ya activado. La página se sirve desde:
```
https://javierandresm13.github.io/peluditos-al-hogar-bogota/
```

---

## 9. Estadísticas del proyecto

- **Total archivos:** 16
- **Peso total:** 153,787 bytes (150.2 KB)
- **Tecnologías:** HTML, CSS, JavaScript, JSON
- **Líneas de código:** (ver archivos individuales)

**Distribución por tipo:**
- .json: 5 archivos
- .html: 3 archivos
- .md: 2 archivos
- .css: 2 archivos
- .js: 2 archivos
- Archivos sin extensión: 1 archivos
- .txt: 1 archivos

**Commits en Git:**
- 634f8c8 Add WhatsApp-friendly owner guide
9033441 Add owner guide for managing the site from any device
6e94ef4 Admin: GitHub 1-click publish - connect with token, publish directly
f3bacc1 Admin: save status bar + clear publish workflow instructions
d95111c Fix all image URLs - replace pexels 403 and broken unsplash 404
9d2789c Debug: hardcode images in HTML, add image test page
e8303c0 Fix images with img tags + embedded data in admin
d438f1f Add real images gallery products hero about
afb137a ðŸ› Fix: datos embebidos para soporte local (file://)
744cefd 🚀 Primer lanzamiento: Pets Love Bogotá - Peluquería canina a domicilio

---

## 10. Contacto

- **WhatsApp:** 319 428 2637
- **Email:** javierandresm13@hotmail.es
- **GitHub:** [@javierandresm13](https://github.com/javierandresm13)
- **Propietario del proyecto:** Javier Andrés Moreno

---

*Documentación generada el 2026-06-21 15:34*
*🐾 Pets Love Bogotá — Cuidamos y queremos a tu mascota*
