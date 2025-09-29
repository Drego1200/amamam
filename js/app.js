// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',(e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}) }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target) } })
},{threshold:.15});

function mountReveals(){ document.querySelectorAll('.reveal').forEach(el=> io.observe(el)); }

// Render from JSON
async function render(){
  try{
    const res = await fetch('data/content.json', {cache:'no-store'});
    const data = await res.json();

    // Meta
    document.querySelector('.brand-title').textContent = data.meta?.projectName || 'Проект';
    document.getElementById('footerSlogan').textContent = `“${data.meta?.slogan || ''}”`;
    document.getElementById('year').textContent = new Date().getFullYear();
    const dLink = document.getElementById('discordLink'); if(dLink && data.meta?.discord){ dLink.href = data.meta.discord; dLink.textContent = data.meta.discord.replace('https://','') }
    const eLink = document.getElementById('emailLink'); if(eLink && data.meta?.email){ eLink.href = `mailto:${data.meta.email}`; eLink.textContent = data.meta.email }
    const banner = document.querySelector('.banner');
    if (banner && data.meta?.bannerImage) {
      banner.style.setProperty('--banner-img', `url('${data.meta.bannerImage}')`);
    }

    // News
    const newsList = document.getElementById('newsList'); newsList.innerHTML = '';
    (data.news||[]).forEach(n =>{
      const el = document.createElement('article'); el.className='card reveal';
      el.innerHTML = `<div class="eyebrow">${n.date||''}</div><h3>${n.title||''}</h3><p>${n.t||''}</p>`;
      newsList.appendChild(el);
    });

    // Memes
    const memes = document.getElementById('memesList'); memes.innerHTML = '';
    (data.memes||[]).forEach(m =>{
      const el = document.createElement('article'); el.className='card reveal';
      el.innerHTML = `
        <div class="img-wrap" style="border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.06);margin-bottom:10px;cursor:zoom-in">
          <img src="${m.img||''}" alt="${m.title||'meme'}" loading="lazy" data-lightbox="${m.img||''}"/>
        </div>
        <h3>${m.title||''}</h3>
        <p>${m.t||''}</p>
      `;
      memes.appendChild(el);
    });

    // Gallery
    const gal = document.getElementById('galleryGrid'); gal.innerHTML = '';
    (data.gallery||[]).forEach(g =>{
      const el = document.createElement('figure'); el.className='tile reveal';
      el.innerHTML = `<img src="${g.img||''}" alt="${g.cap||'image'}" loading="lazy" data-lightbox="${g.img||''}"/><figcaption class="cap">${g.cap||''}</figcaption>`;
      gal.appendChild(el);
    });

    // Videos
    const vids = document.getElementById('videosList'); vids.innerHTML = '';
    (data.videos||[]).forEach(v =>{
      const el = document.createElement('article'); el.className='card video-card reveal';
      el.innerHTML = `
        <div class="eyebrow">Видео</div><h3>${v.title||''}</h3>
        <video controls preload="metadata" ${v.poster?`poster="${v.poster}"`:''}>
          ${v.src?`<source src="${v.src}" type="video/mp4"/>`:''}
          Ваш браузер не поддерживает видео.
        </video>`;
      vids.appendChild(el);
    });

    // Lightbox bind
    setupLightbox();

    // Animate in
    mountReveals();
  }catch(err){
    console.error('Render error:', err);
    showToast('Ошибка загрузки контента');
  }
}

// Minimal toast
function showToast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t) }
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 2200);
}

// Lightbox
function setupLightbox(){
  const lb = document.querySelector('.lightbox');
  document.querySelectorAll('[data-lightbox]').forEach(img =>{
    img.addEventListener('click', ()=>{
      const src = img.getAttribute('data-lightbox');
      const t = lb.querySelector('img'); t.src = src;
      lb.classList.add('show');
    });
  });
  lb.querySelector('.close').addEventListener('click', ()=> lb.classList.remove('show'));
  lb.addEventListener('click', (e)=>{
    if(e.target === lb) lb.classList.remove('show');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
});