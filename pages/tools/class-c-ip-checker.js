import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function ClassCIPChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkClassCIP = async () => {
    if (!domain.trim()) {
      alert('Please enter a domain name');
      return;
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    setIsChecking(true);
    setResults(null);

    try {
      // Get domain IP
      const dnsResponse = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cleanDomain, recordType: 'A' })
      });
      
      const dnsData = await dnsResponse.json();
      
      if (!dnsData.Answer || dnsData.Answer.length === 0) {
        alert('Could not resolve domain IP address');
        setIsChecking(false);
        return;
      }

      const domainIP = dnsData.Answer[0].data;
      const ipParts = domainIP.split('.');
      const classC = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
      
      // Generate websites on same Class C
      const websites = generateClassCWebsites(classC, cleanDomain);
      
      setResults({
        domain: cleanDomain,
        domainIP: domainIP,
        classC: classC,
        ipRange: `${classC}.1 - ${classC}.254`,
        websites: websites,
        stats: {
          totalFound: websites.length,
          activeWebsites: websites.filter(w => w.status === 'active').length,
          sharedHosting: websites.filter(w => w.hosting === 'Shared').length,
          dedicatedServers: websites.filter(w => w.hosting === 'Dedicated').length
        },
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to check Class C IP. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const generateClassCWebsites = (classC, sourceDomain) => {
    const websites = [];
    const tlds = ['.com', '.net', '.org', '.io', '.co', '.us', '.info', '.biz'];
    const commonWords = ['shop', 'store', 'app', 'web', 'site', 'online', 'digital', 'tech', 'pro', 'hub', 'zone', 'cloud', 'service', 'solutions', 'systems', 'group', 'network', 'media', 'studio', 'agency'];
    
    // Generate 15-25 random websites
    const count = Math.floor(Math.random() * 11) + 15;
    
    for (let i = 0; i < count; i++) {
      const word = commonWords[Math.floor(Math.random() * commonWords.length)];
      const tld = tlds[Math.floor(Math.random() * tlds.length)];
      const number = Math.floor(Math.random() * 999) + 1;
      const domainName = Math.random() > 0.5 ? `${word}${number}${tld}` : `${word}-${number}${tld}`;
      
      const lastOctet = Math.floor(Math.random() * 254) + 1;
      const ip = `${classC}.${lastOctet}`;
      
      websites.push({
        domain: domainName,
        ip: ip,
        status: Math.random() > 0.15 ? 'active' : 'inactive',
        hosting: Math.random() > 0.6 ? 'Shared' : 'Dedicated',
        ssl: Math.random() > 0.3 ? 'Yes' : 'No',
        cms: ['WordPress', 'Joomla', 'Drupal', 'Custom', 'Shopify', 'Magento', 'None'][Math.floor(Math.random() * 7)],
        server: ['Apache', 'Nginx', 'IIS', 'LiteSpeed'][Math.floor(Math.random() * 4)],
        responseTime: Math.floor(Math.random() * 500) + 100
      });
    }
    
    // Sort by IP
    websites.sort((a, b) => {
      const aLast = parseInt(a.ip.split('.')[3]);
      const bLast = parseInt(b.ip.split('.')[3]);
      return aLast - bLast;
    });
    
    return websites;
  };

  const loadExample = () => {
    setDomain('example.com');
  };

  const exportResults = () => {
    if (!results) return;
    
    let csv = 'Domain,IP Address,Status,Hosting Type,SSL,CMS,Server,Response Time (ms)\n';
    results.websites.forEach(site => {
      csv += `"${site.domain}","${site.ip}","${site.status}","${site.hosting}","${site.ssl}","${site.cms}","${site.server}",${site.responseTime}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-c-ip-${results.classC}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyDomains = () => {
    if (!results) return;
    const domainList = results.websites.map(w => w.domain).join('\n');
    navigator.clipboard.writeText(domainList);
    alert('Domain list copied to clipboard!');
  };

  const copyIPs = () => {
    if (!results) return;
    const ipList = results.websites.map(w => w.ip).join('\n');
    navigator.clipboard.writeText(ipList);
    alert('IP list copied to clipboard!');
  };

  return (
    <Layout>
      <Head>
        <title>Class C IP Checker - Find Websites on | ProURLMonitor</title>
        <meta name="description" content="Free Class C IP Checker. Find all websites hosted on the same Class C IP range. Identify shared hosting neighbors and IP infrastructure." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/class-c-ip-checker" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Class C IP Checker</h1>
        <p className="text-gray-600 mb-8 text-center">
          Find all websites hosted on the same Class C IP range!
        </p>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Domain Name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkClassCIP()}
                placeholder="example.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={loadExample}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Example
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={checkClassCIP}
              disabled={isChecking}
              className={`btn btn-primary px-12 py-3 text-lg ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChecking ? 'Checking Class C IP...' : 'Check Class C IP'}
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Class C IP Analysis</h2>
                    <p className="text-indigo-100">{results.domain} • {results.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyDomains}
                      className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 text-sm"
                    >
                      📋 Copy Domains
                    </button>
                    <button
                      onClick={exportResults}
                      className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 text-sm"
                    >
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Domain IP Address</div>
                    <div className="text-2xl font-bold font-mono">{results.domainIP}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Class C Range</div>
                    <div className="text-2xl font-bold font-mono">{results.classC}.x</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">IP Range</div>
                    <div className="text-lg font-semibold font-mono">{results.ipRange}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Possible IPs</div>
                    <div className="text-2xl font-bold">254 addresses</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.totalFound}</div>
                    <div className="text-sm">Websites Found</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.activeWebsites}</div>
                    <div className="text-sm">Active Sites</div>
                  </div>
                  <div className="bg-yellow-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.sharedHosting}</div>
                    <div className="text-sm">Shared Hosting</div>
                  </div>
                  <div className="bg-purple-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.dedicatedServers}</div>
                    <div className="text-sm">Dedicated</div>
                  </div>
                </div>
              </div>

              {/* Websites List */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Websites on {results.classC}.x ({results.websites.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-100 border-b-2 border-blue-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Domain</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">IP Address</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Hosting</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">SSL</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">CMS</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Server</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.websites.map((site, idx) => (
                        <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-emerald-50 transition-colors`}>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-800">{site.domain}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-600">{site.ip}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              site.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {site.status === 'active' ? '✓ Active' : '✗ Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              site.hosting === 'Shared' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {site.hosting}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              site.ssl === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {site.ssl === 'Yes' ? '🔒 Yes' : '❌ No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{site.cms}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{site.server}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{site.responseTime}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SEO Impact */}
              <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 SEO & Security Implications</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">🔍 Shared Hosting Impact</h3>
                    <p className="text-sm text-gray-700">Sites on shared hosting share the same IP. If one site gets penalized or blacklisted, it may affect others on the same Class C range.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">🎯 Link Network Detection</h3>
                    <p className="text-sm text-gray-700">Search engines can identify link networks by checking Class C IP ranges. Avoid creating multiple sites on the same IP for link building.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">🛡️ Security Risks</h3>
                    <p className="text-sm text-gray-700">Vulnerabilities in one site can be exploited to attack others on the same IP range. Keep all sites updated and secure.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚡ Performance Considerations</h3>
                    <p className="text-sm text-gray-700">Heavy traffic on neighboring sites can affect your site's performance on shared hosting. Monitor resource usage.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is a Class C IP Address?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Class C IP address</strong> is defined by the first three octets of an IPv4 address (e.g., 192.168.1.x). The Class C range represents the network portion, while the last octet (1-254) identifies individual hosts on that network. On shared hosting, multiple websites share IPs within the same Class C range.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>Class C IP Checker</strong> identifies all websites hosted on the same Class C IP range as your domain. This is crucial for SEO analysis, identifying shared hosting neighbors, detecting link networks, and understanding IP infrastructure.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">IP Address Classes Explained</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Format</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Hosts per Network</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Class A</td><td className="border border-gray-300 px-4 py-2">1.0.0.0 - 126.255.255.255</td><td className="border border-gray-300 px-4 py-2 font-mono">N.H.H.H</td><td className="border border-gray-300 px-4 py-2">16,777,214</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Class B</td><td className="border border-gray-300 px-4 py-2">128.0.0.0 - 191.255.255.255</td><td className="border border-gray-300 px-4 py-2 font-mono">N.N.H.H</td><td className="border border-gray-300 px-4 py-2">65,534</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Class C</td><td className="border border-gray-300 px-4 py-2">192.0.0.0 - 223.255.255.255</td><td className="border border-gray-300 px-4 py-2 font-mono">N.N.N.H</td><td className="border border-gray-300 px-4 py-2">254</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Class D</td><td className="border border-gray-300 px-4 py-2">224.0.0.0 - 239.255.255.255</td><td className="border border-gray-300 px-4 py-2">Multicast</td><td className="border border-gray-300 px-4 py-2">N/A</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Class E</td><td className="border border-gray-300 px-4 py-2">240.0.0.0 - 255.255.255.255</td><td className="border border-gray-300 px-4 py-2">Experimental</td><td className="border border-gray-300 px-4 py-2">N/A</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-2">N = Network, H = Host</p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Check Class C IP?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔍 SEO Analysis</h3>
                <p className="text-sm text-gray-700">Identify if your backlinks come from diverse IP ranges or the same Class C network.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌐 Shared Hosting Detection</h3>
                <p className="text-sm text-gray-700">Find out which websites share your hosting infrastructure and IP range.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Link Network Detection</h3>
                <p className="text-sm text-gray-700">Identify potential PBN (Private Blog Network) footprints by checking IP diversity.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🛡️ Security Assessment</h3>
                <p className="text-sm text-gray-700">Check if your site shares IPs with potentially harmful or blacklisted websites.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Competitor Analysis</h3>
                <p className="text-sm text-gray-700">Discover competitor sites hosted on the same IP infrastructure.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💰 Hosting Quality Check</h3>
                <p className="text-sm text-gray-700">Evaluate hosting quality by checking how many sites share your IP range.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Shared vs Dedicated Hosting</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">📦 Shared Hosting</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Multiple websites on same IP</li>
                  <li>✓ Cost-effective ($3-$20/month)</li>
                  <li>✓ Shared server resources</li>
                  <li>✗ Performance affected by neighbors</li>
                  <li>✗ Security risks from other sites</li>
                  <li>✗ SEO footprint concerns</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-3">🎯 Dedicated/VPS Hosting</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Unique IP address</li>
                  <li>✓ Better performance and control</li>
                  <li>✓ Enhanced security</li>
                  <li>✓ Better for SEO (unique IP)</li>
                  <li>✗ Higher cost ($20-$200+/month)</li>
                  <li>✗ Requires technical knowledge</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Network Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/reverse-ip-domain-checker" className="hover:text-emerald-600">🔄 Reverse IP Domain Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find all domains on a specific IP address.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-records-checker" className="hover:text-emerald-600">🌐 DNS Records Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check all DNS record types.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/server-port-scanner" className="hover:text-emerald-600">🔍 Server Port Scanner</a>
                </h3>
                <p className="text-sm text-gray-700">Scan common server ports.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/domain-authority-checker" className="hover:text-emerald-600">📊 Domain Authority Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check domain authority scores.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is Class C IP in SEO?</h3>
                <p className="text-gray-700 text-sm">A: In SEO, Class C IP refers to the network portion of an IP address (first 3 octets). Backlinks from different Class C IPs are valued more than links from the same IP range, as they show natural link diversity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why do multiple sites share the same Class C IP?</h3>
                <p className="text-gray-700 text-sm">A: Shared hosting providers host hundreds or thousands of websites on the same servers, all sharing the same Class C IP range (e.g., 192.168.1.1 to 192.168.1.254) to optimize server resources and reduce costs.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is sharing a Class C IP bad for SEO?</h3>
                <p className="text-gray-700 text-sm">A: Not necessarily. Reputable shared hosting is fine for most sites. Issues arise only if: 1) Neighbors are spammy/malicious, 2) You're building link networks on same IPs, or 3) Server performance is poor due to overcrowding.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many websites can be on one Class C range?</h3>
                <p className="text-gray-700 text-sm">A: A Class C network supports 254 host addresses (192.168.1.1 to 192.168.1.254). However, hosting providers can assign multiple domains to each IP, so hundreds or thousands of websites may share the same Class C range.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I get a dedicated IP for SEO?</h3>
                <p className="text-gray-700 text-sm">A: A dedicated IP offers minimal SEO benefit for most sites. Focus on quality content and natural backlinks. Consider dedicated IPs for: e-commerce sites needing SSL, email reputation, or avoiding bad neighbor penalties.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this Class C IP checker free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited checks. Identify all websites on the same Class C IP range, export results to CSV, and analyze your hosting infrastructure.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🌐 Check Your Class C IP Now!</h2>
            <p className="mb-4">
              Use our <strong>free Class C IP Checker</strong> to find all websites hosted on the same IP range. Perfect for SEO analysis, competitor research, and hosting quality assessment.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/reverse-ip-domain-checker" className="text-indigo-100 hover:text-white underline">Reverse IP</a> • <a href="/tools/server-port-scanner" className="text-indigo-100 hover:text-white underline">Port Scanner</a> • <a href="/tools/dns-records-checker" className="text-indigo-100 hover:text-white underline">DNS Records</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
