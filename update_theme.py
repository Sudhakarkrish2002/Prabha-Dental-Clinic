import re

with open('admin.html', 'r') as f:
    content = f.read()

# Isolate the <style> block
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if not style_match:
    print("Style block not found!")
    exit(1)

css = style_match.group(1)

# Variables
css = css.replace('--dark:        #0F172A;', '--dark:        #F8FAFC;\n      --text-main:   #1E293B;')
css = css.replace('--dark-card:   #1E293B;', '--dark-card:   #FFFFFF;')
css = css.replace('--dark-lighter:#334155;', '--dark-lighter:#E2E8F0;')

# Replace white colors
css = css.replace('color: #e2e8f0;', 'color: var(--text-main);')
css = css.replace('color: white;', 'color: var(--text-main);')
css = css.replace('rgba(255,255,255,', 'rgba(0,0,0,')

# Specific fixes for contrast
# Topbar title should remain bold text-main
# Login btn text should be white since background is teal gradient
css = css.replace('.login-btn {\n      width: 100%; padding: 14px;\n      background: linear-gradient(135deg, var(--teal), var(--teal-dark));\n      color: var(--text-main);', '.login-btn {\n      width: 100%; padding: 14px;\n      background: linear-gradient(135deg, var(--teal), var(--teal-dark));\n      color: white;')
css = css.replace('.badge-unread {\n      background: linear-gradient(135deg, var(--teal), var(--teal-dark));\n      color: var(--text-main);', '.badge-unread {\n      background: linear-gradient(135deg, var(--teal), var(--teal-dark));\n      color: white;')

# Selected dropdown option text needs better contrast
css = css.replace('.dropdown-option.selected { background: rgba(13,148,136,0.12); color: var(--teal-light); }', '.dropdown-option.selected { background: rgba(13,148,136,0.12); color: var(--teal-dark); font-weight: 600; }')

# For the badge tags (general, implants etc)
css = css.replace('color: var(--teal-light);', 'color: var(--teal-dark);')
css = css.replace('color: var(--gold-light);', 'color: var(--gold);')
css = css.replace('color: #FCA5A5;', 'color: #DC2626;')
css = css.replace('color: #D8B4FE;', 'color: #7E22CE;')
css = css.replace('color: #93C5FD;', 'color: #2563EB;')
css = css.replace('color: #86EFAC;', 'color: #16A34A;')

# Re-assemble
new_content = content.replace(style_match.group(1), css)

with open('admin.html', 'w') as f:
    f.write(new_content)

print("Theme updated to light mode successfully!")
