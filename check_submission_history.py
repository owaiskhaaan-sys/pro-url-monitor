"""
Check When URLs Were Last Submitted
====================================
"""

import os
from datetime import datetime

print("=" * 80)
print("📅 CHECKING INDEXING SUBMISSION HISTORY")
print("=" * 80)
print()

# Check for logs or timestamp files
files_to_check = [
    'indexing_api.py',
    'failed-urls.txt',
    'sitemap-urls.txt',
    'service-account.json'
]

print("📂 File modification dates:")
print("-" * 80)

for filename in files_to_check:
    if os.path.exists(filename):
        mod_time = os.path.getmtime(filename)
        mod_date = datetime.fromtimestamp(mod_time)
        days_ago = (datetime.now() - mod_date).days
        
        print(f"   {filename}")
        print(f"      Last modified: {mod_date.strftime('%d %B %Y, %I:%M %p')}")
        print(f"      ({days_ago} days ago)")
        print()

print("=" * 80)
print()
print("❓ MAIN QUESTION: Kab last time indexing_api.py run ki thi?")
print()
print("Agar 29 December (5 days ago) ko run ki thi aur API working hai,")
print("to abhi tak KAFIsaare pages index ho jane chahiye the.")
print()
print("🔍 Current status check karo:")
print("   Google search: site:www.prourlmonitor.com")
print("   Link: https://www.google.com/search?q=site:www.prourlmonitor.com")
print()
print("Agar bahut kam pages indexed hain (e.g., < 20), to possible reasons:")
print()
print("1️⃣  Service account TAB add nahi tha (abhi recently add kiya)")
print("    → Solution: Abhi indexing_api.py dobara run karo")
print()
print("2️⃣  Content quality issues kuch pages pe")
print("    → Google thin content ko skip kar deta hai")
print()
print("3️⃣  Pages pe noindex meta tags hain")
print("    → Check karo page source code")
print()
print("4️⃣  Internal linking missing hai")
print("    → Pages ko discover karne mein Google ko time lagta hai")
print()
print("💡 RECOMMENDATION:")
print("   Since API ab working hai, ek baar aur run karo:")
print("   → python indexing_api.py")
print()
print("   Phir 2-3 din mein dekhna, significant improvement honi chahiye!")
print()
print("=" * 80)
