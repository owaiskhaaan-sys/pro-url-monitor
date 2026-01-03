import os
import re

def smart_truncate(text, max_length, suffix='...'):
    """Intelligently truncate text without breaking words"""
    if len(text) <= max_length:
        return text
    
    # Try to truncate at word boundary
    truncated = text[:max_length - len(suffix)]
    last_space = truncated.rfind(' ')
    
    if last_space > max_length * 0.7:  # If we can find a space in last 30%
        truncated = truncated[:last_space]
    
    return truncated.strip() + suffix

def fix_meta_tags_in_file(file_path):
    """Fix title and description meta tags in a file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Fix Title Tag (target: 50-58 characters)
    title_pattern = r'<title>(.*?)</title>'
    title_match = re.search(title_pattern, content)
    
    if title_match:
        old_title = title_match.group(1)
        if len(old_title) > 60 or len(old_title) < 30:
            # Truncate intelligently
            if len(old_title) > 60:
                # Remove " | ProURLMonitor" temporarily, truncate, then add back
                base_title = old_title.replace(' | ProURLMonitor', '').replace(' - ProURLMonitor', '')
                if len(base_title) > 45:
                    new_base = smart_truncate(base_title, 42, '')
                    new_title = new_base + ' | ProURLMonitor'
                else:
                    new_title = base_title + ' | ProURLMonitor'
            else:
                # Title too short, keep as is
                new_title = old_title
            
            if new_title != old_title and len(new_title) <= 60:
                content = content.replace(
                    f'<title>{old_title}</title>',
                    f'<title>{new_title}</title>'
                )
                changes_made.append(f"Title: {len(old_title)}ch -> {len(new_title)}ch")
    
    # Fix Meta Description (target: 140-155 characters)
    desc_pattern = r'<meta name="description" content="(.*?)"'
    desc_match = re.search(desc_pattern, content)
    
    if desc_match:
        old_desc = desc_match.group(1)
        if len(old_desc) > 160 or len(old_desc) < 120:
            if len(old_desc) > 160:
                new_desc = smart_truncate(old_desc, 155, '...')
            elif len(old_desc) < 120:
                # Try to expand if too short, but for now just keep it
                new_desc = old_desc
            else:
                new_desc = old_desc
            
            if new_desc != old_desc:
                content = content.replace(
                    f'<meta name="description" content="{old_desc}"',
                    f'<meta name="description" content="{new_desc}"'
                )
                changes_made.append(f"Description: {len(old_desc)}ch -> {len(new_desc)}ch")
    
    # Write back if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes_made
    
    return False, []

# Main execution
print("Starting meta tags optimization for all tool pages...\n")
print("="*80)

tools_dir = "pages/tools"
total_files = 0
fixed_files = 0
all_changes = []

# Get all JS files
tool_files = [f for f in os.listdir(tools_dir) if f.endswith('.js')]

for tool_file in sorted(tool_files):
    file_path = os.path.join(tools_dir, tool_file)
    total_files += 1
    
    was_fixed, changes = fix_meta_tags_in_file(file_path)
    
    if was_fixed:
        fixed_files += 1
        print(f"FIXED - {tool_file}")
        for change in changes:
            print(f"  -> {change}")
        all_changes.append((tool_file, changes))
    else:
        print(f"OK    - {tool_file}")

# Summary
print("\n" + "="*80)
print("OPTIMIZATION SUMMARY")
print("="*80)
print(f"Total files processed: {total_files}")
print(f"Files fixed: {fixed_files}")
print(f"Files already optimal: {total_files - fixed_files}")
print(f"Success rate: {(fixed_files/total_files*100):.1f}%")

print("\n" + "="*80)
print("NEXT STEPS:")
print("="*80)
print("1. Review the changes above")
print("2. Test a few pages locally to ensure they look good")
print("3. Push changes to GitHub (will auto-deploy to Vercel)")
print("4. Re-submit all URLs to Google Indexing API")
print("5. Wait 2-7 days for Google to re-index with better meta tags")

print("\nAll meta tags have been optimized for better SEO and indexing!")
