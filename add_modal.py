import re

with open('admin.html', 'r') as f:
    content = f.read()

# 1. Insert CSS
css_code = """
    /* Confirm Modal */
    .confirm-overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px);
      z-index: 10000; display: none; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
    }
    .confirm-overlay.show { display: flex; opacity: 1; }
    .confirm-modal {
      background: var(--dark-card); border-radius: 16px; padding: 28px;
      width: 90%; max-width: 360px; text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .confirm-overlay.show .confirm-modal { transform: scale(1); }
    .confirm-icon {
      width: 54px; height: 54px; border-radius: 50%; background: rgba(239,68,68,0.1);
      color: var(--danger); display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .confirm-icon svg { width: 28px; height: 28px; }
    .confirm-title { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px; font-family: 'Playfair Display', serif; }
    .confirm-text { font-size: 0.88rem; color: #64748B; margin-bottom: 24px; line-height: 1.5; }
    .confirm-actions { display: flex; gap: 12px; }
    .btn-cancel, .btn-confirm {
      flex: 1; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: all 0.2s ease; border: none;
    }
    .btn-cancel { background: #E2E8F0; color: #475569; }
    .btn-cancel:hover { background: #CBD5E1; color: var(--text-main); }
    .btn-confirm { background: var(--danger); color: white; }
    .btn-confirm:hover { background: #DC2626; box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
  </style>
"""
content = content.replace('</style>', css_code)

# 2. Insert HTML and JS at the end
modal_html = """
  <!-- Custom Confirm Modal -->
  <div class="confirm-overlay" id="confirm-overlay">
    <div class="confirm-modal">
      <div class="confirm-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <h3 class="confirm-title" id="confirm-title">Are you sure?</h3>
      <p class="confirm-text" id="confirm-text">This action cannot be undone.</p>
      <div class="confirm-actions">
        <button class="btn-cancel" id="confirm-cancel">Cancel</button>
        <button class="btn-confirm" id="confirm-yes">Delete</button>
      </div>
    </div>
  </div>

  <script>
    // Confirm Dialog Logic
    let confirmCallback = null;
    function showConfirmDialog(title, text, onConfirm) {
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-text').textContent = text;
      document.getElementById('confirm-overlay').classList.add('show');
      confirmCallback = onConfirm;
    }
    document.getElementById('confirm-cancel').addEventListener('click', () => {
      document.getElementById('confirm-overlay').classList.remove('show');
      confirmCallback = null;
    });
    document.getElementById('confirm-yes').addEventListener('click', () => {
      document.getElementById('confirm-overlay').classList.remove('show');
      if (confirmCallback) confirmCallback();
      confirmCallback = null;
    });
  </script>
</body>
"""
content = content.replace('</body>', modal_html)

# 3. Replace single delete logic
old_single_delete = """      if (action === 'delete') {
        if (!confirm('Delete this submission?')) return;
        subs = subs.filter(s => s.id !== id);
        saveSubmissions(subs);
        showToast('Submission deleted', 'danger');
        renderAll();
      }"""

new_single_delete = """      if (action === 'delete') {
        showConfirmDialog('Delete Submission', 'Are you sure you want to delete this lead? This action cannot be undone.', () => {
          let updatedSubs = getSubmissions().filter(s => s.id !== id);
          saveSubmissions(updatedSubs);
          showToast('Submission deleted', 'danger');
          renderAll();
        });
        return;
      }"""
content = content.replace(old_single_delete, new_single_delete)

# 4. Replace clear all logic
old_clear_all = """    // ── CLEAR ALL ──
    document.getElementById('clear-all-btn').addEventListener('click', () => {
      if (!confirm('Delete ALL submissions? This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      showToast('All submissions cleared', 'danger');
      renderAll();
    });"""

new_clear_all = """    // ── CLEAR ALL ──
    document.getElementById('clear-all-btn').addEventListener('click', () => {
      showConfirmDialog('Clear All Leads', 'Are you sure you want to permanently delete ALL submissions? This cannot be undone.', () => {
        localStorage.removeItem(STORAGE_KEY);
        showToast('All submissions cleared', 'danger');
        renderAll();
      });
    });"""
content = content.replace(old_clear_all, new_clear_all)

with open('admin.html', 'w') as f:
    f.write(content)

print("Modal added successfully!")
