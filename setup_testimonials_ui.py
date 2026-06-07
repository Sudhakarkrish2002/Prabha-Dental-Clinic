import re

with open('index.html', 'r') as f:
    content = f.read()

# Add ID to testimonials grid
content = content.replace('testimonials-grid">', 'testimonials-grid" id="testimonials-grid">')

with open('index.html', 'w') as f:
    f.write(content)

# Now modify script.js to load them
with open('script.js', 'a') as f:
    js_code = """

// ==========================================
// DYNAMIC TESTIMONIALS SYSTEM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const TM_STORAGE_KEY = 'PRABHA_TESTIMONIALS_DB';
  const tmGrid = document.getElementById('testimonials-grid');
  
  if (!tmGrid) return;

  const data = localStorage.getItem(TM_STORAGE_KEY);
  if (!data) return; // If no custom testimonials, leave defaults

  const tms = JSON.parse(data);
  if (tms.length === 0) return; // If array is empty, leave defaults

  // We have custom testimonials! Replace the grid contents.
  tmGrid.innerHTML = '';

  const colors = [
    { bg: 'bg-teal/10', text: 'text-teal' },
    { bg: 'bg-gold/10', text: 'text-gold-dark' },
    { bg: 'bg-green-500/10', text: 'text-green-600' },
    { bg: 'bg-purple-500/10', text: 'text-purple-600' },
    { bg: 'bg-blue-500/10', text: 'text-blue-600' }
  ];

  tms.forEach((t, i) => {
    // Generate Initials (e.g. Ramya Krishnan -> RK)
    const initials = t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    
    // Pick a deterministic color based on index
    const color = colors[i % colors.length];

    // Generate Stars SVG
    const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
    const starsHtml = starSvg.repeat(t.rating) + `<span class="opacity-30">` + starSvg.repeat(5 - t.rating) + `</span>`;

    const delay = (i * 0.1).toFixed(1);

    const card = document.createElement('div');
    card.className = `reveal glass-card-light p-6 md:p-8 relative flex flex-col h-full`;
    card.style.transitionDelay = `${delay}s`;
    // We remove .reveal's starting state by adding 'active' immediately since DOMContentLoaded might run after ScrollReveal, or we just let ScrollReveal handle it.
    // To be safe, we just let it be styled normally. Actually scrollreveal library will pick it up if we re-trigger it, or we just remove 'reveal' class so it shows immediately.
    card.classList.remove('reveal'); 
    
    card.innerHTML = `
      <span class="absolute top-4 right-6 text-6xl text-teal/10 font-serif leading-none">&ldquo;</span>
      <div class="flex gap-1 text-gold text-sm mb-4">
        ${starsHtml}
      </div>
      <p class="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">"${t.message}"</p>
      <div class="flex items-center gap-4 mt-auto">
        <div class="w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-bold text-sm">${initials}</div>
        <div>
          <p class="font-semibold text-dark text-sm">${t.name}</p>
          <p class="text-gray-400 text-xs">${t.service}</p>
        </div>
      </div>
    `;
    
    tmGrid.appendChild(card);
  });
});
"""
    f.write(js_code)

print("UI integration successful!")
