import re

with open('admin.html', 'r') as f:
    content = f.read()

# 1. Add CSS
css_injection = """
    /* Tabs */
    .tab-content { display: none; animation: fadeIn 0.3s ease; }
    .tab-content.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    /* Testimonials Form */
    .tm-grid { display: grid; grid-template-columns: 350px 1fr; gap: 24px; align-items: start; }
    .tm-form-card { background: var(--dark-card); border-radius: 16px; padding: 24px; border: 1px solid rgba(0,0,0,0.06); }
    .tm-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.1); background: #F8FAFC; color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 0.9rem; margin-bottom: 16px; outline: none; transition: all 0.2s; }
    .tm-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.15); }
    .tm-btn { width: 100%; padding: 12px; border-radius: 10px; background: var(--teal); color: white; font-weight: 600; cursor: pointer; border: none; transition: background 0.2s; }
    .tm-btn:hover { background: var(--teal-dark); }
    .tm-label { display: block; color: #475569; font-size: 0.85rem; font-weight: 500; margin-bottom: 6px; }

    /* Testimonials List */
    .tm-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .tm-card { background: var(--dark-card); border-radius: 16px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); position: relative; }
    .tm-card-name { font-weight: 600; color: var(--text-main); font-size: 0.95rem; }
    .tm-card-service { font-size: 0.75rem; color: #64748B; margin-bottom: 12px; }
    .tm-card-msg { font-size: 0.85rem; color: #475569; line-height: 1.5; font-style: italic; margin-bottom: 16px; }
    .tm-card-rating { color: var(--gold); font-size: 1.1rem; margin-bottom: 10px; letter-spacing: 2px; }
    .tm-del-btn { position: absolute; top: 16px; right: 16px; width: 28px; height: 28px; border-radius: 8px; background: rgba(239,68,68,0.1); color: #DC2626; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .tm-del-btn:hover { background: #DC2626; color: white; }
    .tm-del-btn svg { width: 14px; height: 14px; }
    
    @media (max-width: 900px) {
      .tm-grid { grid-template-columns: 1fr; }
    }
"""
content = content.replace('/* Main content */', css_injection + '\n    /* Main content */')

# 2. Modify Sidebar Nav
old_nav = """      <nav class="sidebar-nav">
        <button class="nav-item active">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Contact Submissions
        </button>"""

new_nav = """      <nav class="sidebar-nav">
        <button class="nav-item active tab-link" data-tab="leads">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Contact Submissions
        </button>
        <button class="nav-item tab-link" data-tab="testimonials">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          Testimonials
        </button>"""
content = content.replace(old_nav, new_nav)

# 3. Wrap main content and add Testimonials tab
# Find the start of Topbar
content = content.replace('<!-- Topbar -->', '<div id="leads-tab" class="tab-content active">\n      <!-- Topbar -->')

testimonials_html = """
      </div> <!-- End leads-tab -->

      <!-- Testimonials Tab -->
      <div id="testimonials-tab" class="tab-content">
        <div class="topbar">
          <div>
            <h1 class="topbar-title">Manage Testimonials</h1>
            <p class="topbar-sub">Add or remove patient reviews from the public website</p>
          </div>
        </div>

        <div class="tm-grid">
          <!-- Add Form -->
          <div class="tm-form-card">
            <h3 style="color:var(--text-main);font-weight:600;margin-bottom:20px;font-size:1.05rem;">Add New Review</h3>
            <form id="tm-form">
              <label class="tm-label">Patient Name</label>
              <input type="text" id="tm-name" class="tm-input" placeholder="e.g. Ramya Krishnan" required>
              
              <label class="tm-label">Treatment Service</label>
              <select id="tm-service" class="tm-input" required>
                <option value="" disabled selected>Select a service...</option>
                <option value="General Dentistry">General Dentistry</option>
                <option value="Dental Implants">Dental Implants</option>
                <option value="Root Canal Treatment">Root Canal Treatment</option>
                <option value="Teeth Whitening">Teeth Whitening</option>
                <option value="Braces & Aligners">Braces & Aligners</option>
                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
              </select>

              <label class="tm-label">Rating</label>
              <select id="tm-rating" class="tm-input" required>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
              </select>

              <label class="tm-label">Review Message</label>
              <textarea id="tm-msg" class="tm-input" rows="4" placeholder="Enter patient review..." required></textarea>

              <button type="submit" class="tm-btn">Add Testimonial</button>
            </form>
          </div>

          <!-- List -->
          <div>
            <h3 style="color:var(--text-main);font-weight:600;margin-bottom:20px;font-size:1.05rem;">Published Testimonials</h3>
            <div id="tm-list" class="tm-list">
              <!-- Rendered via JS -->
            </div>
            <div id="tm-empty" class="empty-state" style="display:none;background:var(--dark-card);border-radius:16px;">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <h3>No Custom Testimonials</h3>
              <p>Add one to replace the default website testimonials.</p>
            </div>
          </div>
        </div>
      </div>
"""

content = content.replace('</main>', testimonials_html + '\n    </main>')

# 4. JavaScript Logic for Testimonials and Tabs
js_injection = """
    // ── TABS LOGIC ──
    document.querySelectorAll('.tab-link').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId + '-tab').classList.add('active');
        
        // Close mobile sidebar if open
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
      });
    });

    // ── TESTIMONIALS LOGIC ──
    const TM_STORAGE_KEY = 'PRABHA_TESTIMONIALS_DB';
    
    function getTMs() {
      const data = localStorage.getItem(TM_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    
    function saveTMs(data) {
      localStorage.setItem(TM_STORAGE_KEY, JSON.stringify(data));
      renderTMs();
    }
    
    function renderTMs() {
      const tms = getTMs();
      const list = document.getElementById('tm-list');
      const empty = document.getElementById('tm-empty');
      list.innerHTML = '';
      
      if (tms.length === 0) {
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';
      
      tms.forEach(t => {
        const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
        const card = document.createElement('div');
        card.className = 'tm-card';
        card.innerHTML = `
          <button class="tm-del-btn" title="Delete" onclick="deleteTM(${t.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div class="tm-card-rating">${stars}</div>
          <div class="tm-card-name">${t.name}</div>
          <div class="tm-card-service">${t.service}</div>
          <div class="tm-card-msg">"${t.message}"</div>
        `;
        list.appendChild(card);
      });
    }
    
    window.deleteTM = function(id) {
      showConfirmDialog('Delete Testimonial', 'Are you sure you want to remove this testimonial from the website?', () => {
        const tms = getTMs().filter(t => t.id !== id);
        saveTMs(tms);
        showToast('Testimonial deleted', 'danger');
      });
    };
    
    document.getElementById('tm-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const newTm = {
        id: Date.now(),
        name: document.getElementById('tm-name').value.trim(),
        service: document.getElementById('tm-service').value,
        rating: parseInt(document.getElementById('tm-rating').value),
        message: document.getElementById('tm-msg').value.trim(),
        date: new Date().toISOString()
      };
      
      const tms = getTMs();
      tms.unshift(newTm); // Add to beginning
      saveTMs(tms);
      
      e.target.reset();
      showToast('Testimonial published!', 'success');
    });

    // Initial Render
    renderTMs();
"""
content = content.replace('// Initial render', js_injection + '\n    // Initial render')

with open('admin.html', 'w') as f:
    f.write(content)

print("Admin panel testimonials system added successfully!")
