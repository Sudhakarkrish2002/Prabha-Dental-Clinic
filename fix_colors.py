import re

with open('admin.html', 'r') as f:
    content = f.read()

# Isolate the <style> block
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if not style_match:
    print("Style block not found!")
    exit(1)

css = style_match.group(1)

# Fix low-contrast text elements
css = css.replace('color: rgba(0,0,0,0.35);', 'color: #64748B;')
css = css.replace('color: rgba(0,0,0,0.3);', 'color: #64748B;')
css = css.replace('color: rgba(0,0,0,0.4);', 'color: #64748B;')
css = css.replace('color: rgba(0,0,0,0.45);', 'color: #475569;')
css = css.replace('color: rgba(0,0,0,0.5);', 'color: #475569;')
css = css.replace('color: rgba(0,0,0,0.55);', 'color: #475569;')
css = css.replace('color: rgba(0,0,0,0.28);', 'color: #94A3B8;') # search icon
css = css.replace('color: rgba(0,0,0,0.25);', 'color: #94A3B8;') # search placeholder / shortcut
css = css.replace('color: rgba(0,0,0,0.75);', 'color: #1E293B;') # general text
css = css.replace('color: rgba(0,0,0,0.18);', 'color: #94A3B8;') # empty state

# Table headers
css = css.replace('.table-title { color: var(--text-main); font-weight: 600; font-size: 0.95rem; }', '.table-title { color: #1E293B; font-weight: 600; font-size: 1rem; }')
# Since it was `color: var(--text-main)` let's ensure it's bold

# Ensure stat values are visible (sometimes they get overridden)
css = css.replace('.stat-value { font-family: \'Playfair Display\', serif; font-size: 2.2rem; font-weight: 700; color: var(--text-main);', '.stat-value { font-family: \'Playfair Display\', serif; font-size: 2.2rem; font-weight: 700; color: #0F172A;')

# Dropdown triggers and options
css = css.replace('.dropdown-trigger:hover { border-color: rgba(0,0,0,0.18); color: var(--text-main); }', '.dropdown-trigger:hover { border-color: rgba(0,0,0,0.2); color: #0F172A; }')

# Fix background hover states that might be too faint
css = css.replace('background: rgba(0,0,0,0.03);', 'background: #F1F5F9;')
css = css.replace('background: rgba(0,0,0,0.05);', 'background: #F1F5F9;')
css = css.replace('background: rgba(0,0,0,0.08);', 'background: #E2E8F0;')

# Apply changes
new_content = content.replace(style_match.group(1), css)
with open('admin.html', 'w') as f:
    f.write(new_content)

print("Colors fixed for light theme!")
