
(() => {
  'use strict';
  const pageMap = {home:'index.html', products:'products.html', about:'about.html', contact:'contact.html'};
  const current = location.pathname.split('/').pop() || 'index.html';

  // Ensure all original Stitch navigation links point to real pages and active state is accurate.
  document.querySelectorAll('[data-path]').forEach(link => {
    const key = link.getAttribute('data-path');
    if (pageMap[key]) link.href = pageMap[key];
    if (pageMap[key] === current) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });

  const header = document.querySelector('header');
  if (header) {
    const nav = header.querySelector('nav:not(.site-mobile-nav)');
    const actions = header.querySelector('.flex.items-center.gap-3, .flex.items-center.gap-space-sm, .flex.items-center.gap-space-md');
    if (nav && !header.querySelector('.site-mobile-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'site-mobile-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label','باز کردن منو');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
      (actions || header.querySelector('div')).appendChild(toggle);
      const mobile = nav.cloneNode(true);
      mobile.className = 'site-mobile-nav';
      mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mobile.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false');
      }));
      header.appendChild(mobile);
      toggle.addEventListener('click', () => {
        const open = mobile.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.innerHTML = `<span class="material-symbols-outlined">${open?'close':'menu'}</span>`;
      });
      document.addEventListener('click', e => {
        if (!header.contains(e.target)) { mobile.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); }
      });
    }
  }

  // Search overlay searches the visible page content and links to matching pages.
  const searchButtons = [...document.querySelectorAll('button[aria-label*="جستجو"],button[aria-label*="Search"]')];
  if (searchButtons.length) {
    const overlay = document.createElement('div');
    overlay.className = 'site-search-overlay';
    overlay.innerHTML = `<section class="site-search-panel" role="dialog" aria-modal="true" aria-label="جستجو"><button type="button" class="site-search-close">بستن ✕</button><h2 style="margin:8px 0;color:#ffd485">جستجو در فور فارکس</h2><label for="siteSearchInput">عبارت مورد نظر را وارد کنید</label><input class="site-search-field" id="siteSearchInput" type="search" placeholder="مثلاً اندیکاتور، اشتراک، پشتیبانی…" autocomplete="off"><div class="site-search-results" aria-live="polite"></div></section>`;
    document.body.appendChild(overlay);
    const input = overlay.querySelector('input');
    const results = overlay.querySelector('.site-search-results');
    const close = () => { overlay.classList.remove('is-open'); document.body.style.overflow=''; };
    const pages = [
      {title:'خانه',url:'index.html',keywords:'خانه فور فارکس تحلیل هوشمند بازار'},
      {title:'محصولات',url:'products.html',keywords:'محصولات اشتراک اندیکاتور ابزار معاملاتی قیمت'},
      {title:'درباره ما',url:'about.html',keywords:'درباره فور فارکس روش تحلیل'},
      {title:'تماس با ما',url:'contact.html',keywords:'تماس پشتیبانی تلگرام سفارش سوال'}
    ];
    const runSearch = () => {
      const q = input.value.trim().toLocaleLowerCase('fa');
      const pageMatches = pages.filter(p => !q || (p.title+' '+p.keywords).toLocaleLowerCase('fa').includes(q));
      const textMatches = [...document.querySelectorAll('main h1,main h2,main h3,main p,main a')].filter(el => q && el.textContent.toLocaleLowerCase('fa').includes(q)).slice(0,8);
      results.innerHTML = '';
      pageMatches.forEach(p => { const a=document.createElement('a'); a.href=p.url; a.textContent='صفحه: '+p.title; results.appendChild(a); });
      textMatches.forEach(el => { const a=document.createElement('a'); a.href='#'; a.textContent=el.textContent.trim().replace(/\s+/g,' ').slice(0,110); a.addEventListener('click',e=>{e.preventDefault();close();el.scrollIntoView({behavior:'smooth',block:'center'});}); results.appendChild(a); });
      if (!results.children.length) results.innerHTML='<p style="color:#aaa">نتیجه‌ای پیدا نشد؛ عبارت دیگری را امتحان کنید.</p>';
    };
    searchButtons.forEach(btn => btn.addEventListener('click', () => { overlay.classList.add('is-open'); document.body.style.overflow='hidden'; input.value=''; runSearch(); setTimeout(()=>input.focus(),60); }));
    input.addEventListener('input',runSearch);
    overlay.querySelector('.site-search-close').addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close(); if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay.classList.add('is-open');document.body.style.overflow='hidden';input.focus();}});
  }

  // Progressive reveal, while preserving original Stitch layout and animation classes.
  if ('IntersectionObserver' in window) {
    const candidates = document.querySelectorAll('main section, main .group, main .gold-border-glow');
    candidates.forEach(el => { if (!el.closest('header')) el.classList.add('site-reveal'); });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:0.06});
    candidates.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.site-reveal').forEach(el=>el.classList.add('is-visible'));
  }

  // Prevent placeholder links from jumping to the top unexpectedly.
  document.querySelectorAll('a[href="#"]').forEach(a => {
    if (!a.hasAttribute('data-keep-hash')) a.addEventListener('click', e => e.preventDefault());
  });
})();
