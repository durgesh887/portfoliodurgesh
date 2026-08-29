// theme: remembers the visitor's choice; falls back to system preference on first visit
(function(){
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('ds-theme'); } catch(e){}
  const initial = saved || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);
  const btn = document.getElementById('theme-toggle');
  if(btn){
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ds-theme', next); } catch(e){}
    });
  }
})();

// footer year
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

// mobile nav toggle
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('nav.links');
if(toggle && links){
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// scroll reveal
const items = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  items.forEach(el=>io.observe(el));
} else {
  items.forEach(el=>el.classList.add('in'));
}

// animated counters
(function(){
  const counters = document.querySelectorAll('[data-counter]');
  if(!counters.length) return;

  function animateCounter(el){
    const target = parseInt(el.dataset.counter, 10);
    const duration = 2000;
    const start = performance.now();

    function easeOutQuart(t){ return 1 - Math.pow(1 - t, 4); }

    function tick(now){
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.round(easeOutQuart(progress) * target);
      el.textContent = val.toLocaleString();
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if('IntersectionObserver' in window){
    const cio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, {threshold:0.3});
    counters.forEach(el=>cio.observe(el));
  } else {
    counters.forEach(el=>{ el.textContent = parseInt(el.dataset.counter, 10).toLocaleString(); });
  }
})();

// contact form -> mailto (static site, no backend)
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fd = new FormData(form);
    const first = fd.get('first') || '';
    const last = fd.get('last') || '';
    const email = fd.get('email') || '';
    const subject = fd.get('subject') || 'Project inquiry';
    const message = fd.get('message') || '';
    const body = `Name: ${first} ${last}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:durgeshsharma96100@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const msg = document.getElementById('form-msg');
    if(msg){ msg.classList.add('show'); msg.textContent = 'Opening your email app…'; }
  });
}
