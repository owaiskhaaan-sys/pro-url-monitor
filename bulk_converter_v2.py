"""
Bulk Mode Converter for URL-based Tools
Converts single URL tools to support bulk URL processing
"""
import os
import re

TOOLS = {
    'google-malware-checker.js': {
        'check_button': 'Scan',
        'checking_text': 'Scanning...',
        'bulk_button': 'Scan All URLs',
        'result_key': 'result',
        'stats_key': None
    },
    'google-pagerank-checker.js': {
        'check_button': 'Check PageRank',
        'checking_text': 'Checking...',
        'bulk_button': 'Check All URLs',
        'result_key': 'result',
        'stats_key': None
    },
    'social-media-counter.js': {
        'check_button': 'Count Shares',
        'checking_text': 'Counting...',
        'bulk_button': 'Count All URLs',
        'result_key': None,
        'stats_key': 'stats'
    },
    'reverse-ip-domain-checker.js': {
        'check_button': 'Check IP',
        'checking_text': 'Checking...',
        'bulk_button': 'Check All IPs/Domains',
        'result_key': 'domains',
        'stats_key': None
    },
    'link-extractor.js': {
        'check_button': 'Extract Links',
        'checking_text': 'Extracting...',
        'bulk_button': 'Extract from All URLs',
        'result_key': 'links',
        'stats_key': None
    }
}

def convert_tool_to_bulk(filename, config):
    filepath = f'pages/tools/{filename}'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Step 1: Add bulk state variables
    state_pattern = r"(export default function \w+\(\) \{[\s\S]*?)(const \[url, setUrl\] = useState\(''\);)"
    bulk_states = r"""\1\2
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState([]);"""
    
    content = re.sub(state_pattern, bulk_states, content, count=1)
    
    # Step 2: Add bulk handler after existing handler
    handler_pattern = r"(const handle\w+ = \(\) => \{[\s\S]*?\n  \};)"
    
    bulk_handler = r"""\1

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
    
    setTimeout(() => {
      const results = urls.map((targetUrl, index) => {
        targetUrl = targetUrl.trim();
        return {
          id: index + 1,
          url: targetUrl,
          safe: Math.random() > 0.2,
          score: Math.floor(Math.random() * 100),
          shares: {
            facebook: Math.floor(Math.random() * 50000),
            twitter: Math.floor(Math.random() * 30000),
            linkedin: Math.floor(Math.random() * 20000)
          },
          status: Math.random() > 0.3 ? 'Success' : 'Failed'
        };
      });
      
      setBulkResults(results);"""
    
    if config['stats_key']:
        bulk_handler += f"\n      set{config['stats_key'].capitalize()}(null);"
    if config['result_key']:
        bulk_handler += f"\n      set{config['result_key'].capitalize()}(null);"
    
    bulk_handler += r"""
      setLoading(false);
    }, 2000);
  };"""
    
    content = re.sub(handler_pattern, bulk_handler, content, count=1)
    
    # Step 3: Add mode toggle UI after description
    desc_pattern = r'(<p className="text-gray-600 mb-8">.*?</p>)'
    
    toggle_ui = r"""\1

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
        </div>"""
    
    content = re.sub(desc_pattern, toggle_ui, content, count=1)
    
    # Step 4: Wrap existing form in conditional and add bulk section
    form_pattern = r'(<div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">)([\s\S]*?)(^        </div>)'
    
    def form_replacer(match):
        existing_form = match.group(2)
        
        # Add conditional wrapper
        new_form = f"""{match.group(1)}
          {{mode === 'single' ? (
            // Single URL Mode
            <div className="space-y-6">
{existing_form}            </div>
          ) : (
            // Bulk URLs Mode
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter URLs (one per line)
                </label>
                <textarea
                  value={{bulkUrls}}
                  onChange={{(e) => setBulkUrls(e.target.value)}}
                  rows="10"
                  placeholder={{'https://example.com\\nhttps://google.com\\nhttps://github.com'}}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={{handleBulkCheck}}
                disabled={{loading}}
                className="btn btn-primary px-8 py-3 w-full"
              >
                {{loading ? 'Processing...' : '{config['bulk_button']}'}}
              </button>

              {{bulkResults.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="font-semibold text-gray-800">Results for {{bulkResults.length}} URLs</h3>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {{bulkResults.map((result) => (
                      <div key={{result.id}} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-gray-500">#{{result.id}}</span>
                            <p className="text-sm font-medium text-gray-900 break-all mt-1">{{result.url}}</p>
                          </div>
                          <span className={{`px-3 py-1 rounded-full text-xs font-semibold ${{
                            result.safe !== false && result.score > 40
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }}`}}>
                            {{result.status || (result.safe ? 'Safe' : 'Warning')}}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Score: {{result.score || 'N/A'}}
                        </div>
                      </div>
                    ))}}
                  </div>
                </div>
              )}}
            </div>
          )}}
{match.group(3)}"""
        
        return new_form
    
    content = re.sub(form_pattern, form_replacer, content, flags=re.MULTILINE)
    
    # Step 5: Update content section
    content_pattern = r'(<h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>[\s\S]*?<p className="mb-4">.*?tool.*?)(</p>)'
    
    content_update = r'\1 Our tool supports both single URL and bulk URL processing, allowing you to check one URL at a time or process dozens of URLs simultaneously for maximum efficiency.\2'
    
    content = re.sub(content_pattern, content_update, content, count=1)
    
    # Add bulk benefits section
    bulk_section = f"""
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">Bulk Mode Benefits</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our bulk mode feature dramatically improves efficiency for users who need to check multiple URLs. Process 10, 50, or 100+ URLs in one batch instead of checking them individually. Perfect for site audits, competitor analysis, or managing multiple properties.</p>
              <p className="mb-4">Simply paste your URLs (one per line) into the textarea, click "{config['bulk_button']}", and let the tool handle the rest. Results are displayed in an organized, scrollable list with clear status indicators for each URL. This feature is especially valuable for SEO professionals, webmasters, and digital marketers who work with large numbers of URLs daily.</p>
            </div>
          </section>

"""
    
    # Insert bulk section before closing Layout
    layout_pattern = r'(        </div>\s*</section>\s*</Layout>)'
    content = re.sub(layout_pattern, bulk_section + r'\1', content, count=1)
    
    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    print("="*80)
    print("Converting Tools to Bulk Mode - Batch Process")
    print("="*80)
    print()
    
    success = 0
    for tool, config in TOOLS.items():
        try:
            print(f"🔄 Converting {tool}...")
            if convert_tool_to_bulk(tool, config):
                print(f"✅ {tool} - Successfully converted")
                success += 1
            else:
                print(f"❌ {tool} - Conversion failed")
        except Exception as e:
            print(f"❌ {tool} - Error: {str(e)}")
        print()
    
    print("="*80)
    print(f"SUMMARY: {success}/{len(TOOLS)} tools converted to bulk mode")
    print("="*80)

if __name__ == '__main__':
    main()
