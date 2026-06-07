import re

with open('admin.html', 'r') as f:
    content = f.read()

# 1. Update Rating Dropdown
old_rating = """              <select id="tm-rating" class="tm-input" required>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
              </select>"""

new_rating = """              <select id="tm-rating" class="tm-input" required>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
                <option value="3">3 Stars ★★★☆☆</option>
                <option value="2">2 Stars ★★☆☆☆</option>
                <option value="1">1 Star ★☆☆☆☆</option>
              </select>"""
content = content.replace(old_rating, new_rating)

# 2. Add Edit button CSS
edit_css = """    .tm-edit-btn { position: absolute; top: 16px; right: 52px; width: 28px; height: 28px; border-radius: 8px; background: rgba(59,130,246,0.1); color: #3B82F6; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .tm-edit-btn:hover { background: #3B82F6; color: white; }
    .tm-edit-btn svg { width: 14px; height: 14px; }
"""
content = content.replace('    .tm-del-btn:hover { background: #DC2626; color: white; }', '    .tm-del-btn:hover { background: #DC2626; color: white; }\n' + edit_css)

# 3. Add Edit Button HTML to renderTMs
old_card_html = """        card.innerHTML = `
          <button class="tm-del-btn" title="Delete" onclick="deleteTM(${t.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>"""

new_card_html = """        card.innerHTML = `
          <button class="tm-edit-btn" title="Edit" onclick="editTM(${t.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button class="tm-del-btn" title="Delete" onclick="deleteTM(${t.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>"""
content = content.replace(old_card_html, new_card_html)

# 4. Add Edit TM JS Logic
old_delete_tm = """    window.deleteTM = function(id) {
      showConfirmDialog('Delete Testimonial', 'Are you sure you want to remove this testimonial from the website?', () => {
        const tms = getTMs().filter(t => t.id !== id);
        saveTMs(tms);
        showToast('Testimonial deleted', 'danger');
      });
    };"""

new_delete_and_edit = """    window.deleteTM = function(id) {
      showConfirmDialog('Delete Testimonial', 'Are you sure you want to remove this testimonial from the website?', () => {
        const tms = getTMs().filter(t => t.id !== id);
        saveTMs(tms);
        showToast('Testimonial deleted', 'danger');
      });
    };

    let editingTMId = null;
    window.editTM = function(id) {
      const tms = getTMs();
      const tm = tms.find(t => t.id === id);
      if (!tm) return;
      
      document.getElementById('tm-name').value = tm.name;
      document.getElementById('tm-service').value = tm.service;
      document.getElementById('tm-rating').value = tm.rating;
      document.getElementById('tm-msg').value = tm.message;
      
      editingTMId = id;
      document.querySelector('#tm-form button[type="submit"]').textContent = 'Update Testimonial';
    };"""
content = content.replace(old_delete_tm, new_delete_and_edit)

# 5. Update Submit Handler
old_submit = """    document.getElementById('tm-form').addEventListener('submit', (e) => {
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
    });"""

new_submit = """    document.getElementById('tm-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const tms = getTMs();
      
      if (editingTMId) {
        const index = tms.findIndex(t => t.id === editingTMId);
        if (index !== -1) {
          tms[index].name = document.getElementById('tm-name').value.trim();
          tms[index].service = document.getElementById('tm-service').value;
          tms[index].rating = parseInt(document.getElementById('tm-rating').value);
          tms[index].message = document.getElementById('tm-msg').value.trim();
        }
        editingTMId = null;
        document.querySelector('#tm-form button[type="submit"]').textContent = 'Add Testimonial';
        showToast('Testimonial updated!', 'success');
      } else {
        const newTm = {
          id: Date.now(),
          name: document.getElementById('tm-name').value.trim(),
          service: document.getElementById('tm-service').value,
          rating: parseInt(document.getElementById('tm-rating').value),
          message: document.getElementById('tm-msg').value.trim(),
          date: new Date().toISOString()
        };
        tms.unshift(newTm); // Add to beginning
        showToast('Testimonial published!', 'success');
      }
      
      saveTMs(tms);
      e.target.reset();
    });"""
content = content.replace(old_submit, new_submit)

with open('admin.html', 'w') as f:
    f.write(content)

print("Edit functionality and 1-5 stars added successfully!")
