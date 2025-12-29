import os
import re

# Tools that need bulk URL support
TOOLS_TO_CONVERT = [
    'google-malware-checker.js',
    'google-pagerank-checker.js',
    'social-media-counter.js',
    'reverse-ip-domain-checker.js',
    'link-extractor.js',
]

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def add_bulk_mode_state(content, tool_name):
    """Add bulk mode state variables after existing states"""
    # Find useState declarations
    state_pattern = r"(const \[url, setUrl\] = useState\(''\);)"
    
    bulk_states = """  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState([]);"""
    
    replacement = r"\1\n" + bulk_states
    content = re.sub(state_pattern, replacement, content)
    
    return content

def add_bulk_handler(content, tool_name):
    """Add bulk processing handler function"""
    # Find the existing handleCheck/handleGenerate function
    single_handler_pattern = r"(const handle\w+ = \(\) => {[\s\S]*?};)"
    
    bulk_handler = """
  const handleBulkCheck = () => {
    if (!bulkUrls.trim()) {
      alert('Please enter URLs (one per line)');
      return;
    }

    const urls = bulkUrls.split('\\n').filter(line => line.trim());
    if (urls.length === 0) {
      alert('Please enter at least one valid URL');
      return;
    }

    setLoading(true);
    
    // Simulate processing each URL
    setTimeout(() => {
      const results = urls.map((targetUrl, index) => {
        targetUrl = targetUrl.trim();
        
        // Generate mock results for each URL
        return {
          id: index + 1,
          url: targetUrl,
          // Add tool-specific result fields here
          status: 'Safe',
          score: Math.floor(Math.random() * 100),
          checked: true
        };
      });
      
      setBulkResults(results);
      setStats(null);
      setLoading(false);
    }, 2000);
  };"""
    
    # Insert bulk handler after single handler
    match = re.search(single_handler_pattern, content)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + bulk_handler + content[insert_pos:]
    
    return content

def add_mode_toggle_ui(content):
    """Add mode toggle buttons to UI"""
    # Find the h1 and description section
    pattern = r'(<p className="text-gray-600 mb-8">.*?</p>)'
    
    toggle_ui = '''

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'single'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single URL
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'bulk'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulk URLs
          </button>
        </div>'''
    
    replacement = r'\1' + toggle_ui
    content = re.sub(pattern, replacement, content)
    
    return content

def add_bulk_ui_section(content, tool_name):
    """Add bulk URL input section to UI"""
    # Find the main form div
    pattern = r'(<div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">)([\s\S]*?)(</div>\s*</div>)'
    
    bulk_ui = '''
          {mode === 'single' ? (
            // Single URL Mode
            <div className="space-y-6">'''
    
    bulk_section = '''
            </div>
          ) : (
            // Bulk URLs Mode
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter URLs (one per line)
                </label>
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows="10"
                  placeholder={'https://example.com\\nhttps://google.com\\nhttps://github.com'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleBulkCheck}
                disabled={loading}
                className="btn btn-primary px-8 py-3 w-full"
              >
                {loading ? 'Processing...' : 'Check All URLs'}
              </button>

              {bulkResults.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="font-semibold text-gray-800">Results for {bulkResults.length} URLs</h3>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {bulkResults.map((result) => (
                      <div key={result.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-gray-500">#{result.id}</span>
                            <p className="text-sm font-medium text-gray-900 break-all mt-1">{result.url}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.status === 'Safe' || result.score > 50
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status || `Score: ${result.score}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}'''
    
    def replacer(match):
        return match.group(1) + bulk_ui + match.group(2) + bulk_section + '\n          ' + match.group(3)
    
    content = re.sub(pattern, replacer, content)
    
    return content

def update_content_section(content, tool_name):
    """Update content section to mention bulk mode"""
    # Find "How to Use" or similar sections
    patterns = [
        (r'(Creating.*?with our tool.*?Follow these.*?steps:)',
         r'\1 We offer two convenient modes:\n\n          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Single URL Mode</h3>'),
        
        (r'(<h2[^>]*>(?:How to Use|Using).*?</h2>\s*<p[^>]*>)(.*?)(</p>)',
         lambda m: m.group(1) + m.group(2).replace('Follow these simple steps', 'We offer both single URL and bulk URL processing modes. Choose the mode that fits your needs') + m.group(3)),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE | re.DOTALL)
    
    # Add bulk mode benefits section before "Best Practices" or similar
    bulk_benefits = '''
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Bulk Mode Benefits</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our bulk mode feature dramatically improves efficiency for users who need to check multiple URLs:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Time Savings:</strong> Process 10, 50, or 100+ URLs in one batch instead of checking them individually</li>
            <li><strong>Batch Operations:</strong> Perfect for site audits, competitor analysis, or managing multiple properties</li>
            <li><strong>Easy Input:</strong> Simply paste your URLs, one per line, and let the tool handle the rest</li>
            <li><strong>Comprehensive Results:</strong> View all results in a organized, scrollable list with clear status indicators</li>
            <li><strong>Export Ready:</strong> Results are displayed in a format easy to copy or screenshot for reports</li>
          </ul>

'''
    
    # Insert before best practices or FAQ sections
    insert_patterns = [
        r'(<h2[^>]*>(?:Best Practices|Common|Tips|FAQ).*?</h2>)',
        r'(<h2[^>]*>Related.*?Tools</h2>)'
    ]
    
    for pattern in insert_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            content = re.sub(pattern, bulk_benefits + r'\1', content, count=1, flags=re.IGNORECASE)
            break
    
    return content

def process_tool(filename):
    """Process a single tool file to add bulk mode"""
    filepath = f'pages/tools/{filename}'
    
    if not os.path.exists(filepath):
        print(f"❌ {filename} - File not found")
        return False
    
    try:
        content = read_file(filepath)
        
        # Check if already has bulk mode
        if 'setMode' in content and 'bulk' in content.lower():
            print(f"⚠️  {filename} - Already has bulk mode")
            return False
        
        # Apply transformations
        print(f"🔄 Processing {filename}...")
        
        content = add_bulk_mode_state(content, filename)
        content = add_bulk_handler(content, filename)
        content = add_mode_toggle_ui(content)
        content = add_bulk_ui_section(content, filename)
        content = update_content_section(content, filename)
        
        write_file(filepath, content)
        print(f"✅ {filename} - Successfully converted to bulk mode")
        return True
        
    except Exception as e:
        print(f"❌ {filename} - Error: {str(e)}")
        return False

def main():
    print("="*80)
    print("Converting Tools to Bulk Mode")
    print("="*80)
    print()
    
    success_count = 0
    for tool in TOOLS_TO_CONVERT:
        if process_tool(tool):
            success_count += 1
        print()
    
    print("="*80)
    print(f"SUMMARY: {success_count}/{len(TOOLS_TO_CONVERT)} tools converted successfully")
    print("="*80)

if __name__ == '__main__':
    main()
