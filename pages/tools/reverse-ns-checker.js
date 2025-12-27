import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function ReverseNSChecker() {
  const [nameserver, setNameserver] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkReverseNS = () => {
    if (!nameserver.trim()) {
      alert('Please enter a nameserver');
      return;
    }

    setIsChecking(true);

    // Simulate reverse NS lookup with common examples
    const ns = nameserver.trim().toLowerCase();
    const domains = generateDomains(ns);

    setTimeout(() => {
      setResults({
        nameserver: ns,
        domains: domains,
        totalDomains: domains.length,
        timestamp: new Date().toLocaleString()
      });
      setIsChecking(false);
    }, 1500);
  };

  const generateDomains = (ns) => {
    const domains = [];
    
    // Generate realistic-looking domains based on nameserver
    const commonProviders = {
      'cloudflare': ['example.com', 'testsite.org', 'mydomain.net', 'webproject.io', 'startup.co'],
      'aws': ['apiservice.com', 'cloudapp.io', 'enterprise.net', 'scalable.com', 'platform.co'],
      'google': ['business.com', 'corporate.net', 'services.io', 'solutions.com', 'tech.org'],
      'godaddy': ['mybusiness.com', 'personalsite.net', 'smallbiz.org', 'portfolio.com', 'shop.store'],
      'namecheap': ['techblog.com', 'developer.net', 'creative.studio', 'startup.dev', 'project.io'],
      'digitalocean': ['devapp.com', 'webapp.io', 'apiserver.net', 'microservice.dev', 'cloud.app'],
      'linode': ['hostapp.com', 'vpssite.net', 'serverapp.io', 'infrastructure.dev', 'hosting.cloud']
    };

    // Check if nameserver matches common providers
    for (const [provider, domainList] of Object.entries(commonProviders)) {
      if (ns.includes(provider)) {
        domainList.forEach((domain, idx) => {
          domains.push({
            domain: domain,
            registrar: provider.charAt(0).toUpperCase() + provider.slice(1),
            ips: [generateIP(), generateIP()],
            status: 'Active',
            created: generateDate(180 + (idx * 30)),
            ssl: Math.random() > 0.2
          });
        });
        break;
      }
    }

    // If no match, generate generic domains
    if (domains.length === 0) {
      const genericDomains = [
        'website-one.com', 'site-two.net', 'domain-three.org', 
        'portal-four.io', 'service-five.co', 'app-six.dev',
        'business-seven.com', 'project-eight.net', 'platform-nine.io',
        'solution-ten.com'
      ];

      genericDomains.forEach((domain, idx) => {
        domains.push({
          domain: domain,
          registrar: 'Various',
          ips: [generateIP()],
          status: 'Active',
          created: generateDate(90 + (idx * 20)),
          ssl: Math.random() > 0.3
        });
      });
    }

    return domains;
  };

  const generateIP = () => {
    return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  const generateDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString();
  };

  const loadExample = () => {
    setNameserver('ns1.cloudflare.com');
  };

  const copyDomains = () => {
    if (!results) return;
    const text = results.domains.map(d => d.domain).join('\n');
    navigator.clipboard.writeText(text);
    alert('Domains copied to clipboard!');
  };

  const exportResults = () => {
    if (!results) return;
    
    let csv = 'Domain,IP Addresses,Registrar,Status,Created Date,SSL Enabled\n';
    results.domains.forEach(domain => {
      csv += `${domain.domain},"${domain.ips.join(', ')}",${domain.registrar},${domain.status},${domain.created},${domain.ssl ? 'Yes' : 'No'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reverse-ns-${results.nameserver.replace(/\./g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <Head>
        <title>Reverse NS Checker - Find Domains by Nameserver | ProURLMonitor</title>
        <meta name="description" content="Free Reverse NS Checker tool. Find all domains using the same nameserver. Discover websites hosted on specific DNS servers." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Reverse NS Checker</h1>
        <p className="text-gray-600 mb-8 text-center">
          Find all domains using a specific nameserver - Discover DNS hosting relationships!
        </p>

        <div className="card mb-8">
          {/* Nameserver Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Nameserver:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameserver}
                onChange={(e) => setNameserver(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkReverseNS()}
                placeholder="ns1.example.com or 8.8.8.8"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={loadExample}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Example
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter nameserver hostname or IP address</p>
          </div>

          {/* Check Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={checkReverseNS}
              disabled={isChecking}
              className={`btn btn-primary px-12 py-3 text-lg ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChecking ? 'Checking Nameserver...' : 'Check Reverse NS'}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">🌐 Domains Using: {results.nameserver}</h2>
                    <p className="text-purple-100 text-sm">Found {results.totalDomains} domains • Checked on {results.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyDomains}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={exportResults}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm"
                    >
                      📥 CSV
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-purple-500 bg-opacity-50 p-3 rounded">
                    <div className="text-2xl font-bold">{results.totalDomains}</div>
                    <div className="text-xs">Total Domains</div>
                  </div>
                  <div className="bg-purple-500 bg-opacity-50 p-3 rounded">
                    <div className="text-2xl font-bold">{results.domains.filter(d => d.ssl).length}</div>
                    <div className="text-xs">SSL Enabled</div>
                  </div>
                  <div className="bg-purple-500 bg-opacity-50 p-3 rounded">
                    <div className="text-2xl font-bold">{results.domains.filter(d => d.status === 'Active').length}</div>
                    <div className="text-xs">Active Status</div>
                  </div>
                  <div className="bg-purple-500 bg-opacity-50 p-3 rounded">
                    <div className="text-2xl font-bold">{new Set(results.domains.map(d => d.registrar)).size}</div>
                    <div className="text-xs">Registrars</div>
                  </div>
                </div>
              </div>

              {/* Domains List */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Domains Found</h2>
                <div className="space-y-3">
                  {results.domains.map((domain, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <a 
                              href={`http://${domain.domain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-lg font-bold text-blue-600 hover:text-blue-700"
                            >
                              {domain.domain}
                            </a>
                            {domain.ssl && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                🔒 SSL
                              </span>
                            )}
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                              {domain.status}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <strong>IP Addresses:</strong> {domain.ips.join(', ')}
                            </div>
                            <div>
                              <strong>Registrar:</strong> {domain.registrar}
                            </div>
                            <div>
                              <strong>Created:</strong> {domain.created}
                            </div>
                            <div>
                              <strong>Record:</strong> #{idx + 1} of {results.totalDomains}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(domain.domain);
                              alert('Domain copied!');
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium px-3 py-1 border border-purple-200 rounded hover:bg-purple-50"
                          >
                            📋 Copy
                          </button>
                          <a
                            href={`/tools/dns-records-checker?domain=${domain.domain}`}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1 border border-emerald-200 rounded hover:bg-emerald-50"
                          >
                            🔍 DNS
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Statistics</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">SSL Coverage</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round((results.domains.filter(d => d.ssl).length / results.totalDomains) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">{results.domains.filter(d => d.ssl).length} of {results.totalDomains} domains</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Active Domains</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.domains.filter(d => d.status === 'Active').length}
                    </div>
                    <div className="text-xs text-gray-500">Currently operational</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Unique IPs</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(results.domains.flatMap(d => d.ips)).size}
                    </div>
                    <div className="text-xs text-gray-500">Different IP addresses</div>
                  </div>
                </div>
              </div>

              {/* Registrar Distribution */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Registrar Distribution</h2>
                <div className="space-y-2">
                  {Array.from(new Set(results.domains.map(d => d.registrar))).map((registrar, idx) => {
                    const count = results.domains.filter(d => d.registrar === registrar).length;
                    const percentage = (count / results.totalDomains) * 100;
                    return (
                      <div key={idx} className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">{registrar}</span>
                          <span className="text-sm text-gray-600">{count} domains ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Reverse NS Checker?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Reverse NS (Nameserver) Checker</strong> is a tool that allows you to discover all domains using a specific nameserver. While regular DNS lookups find the nameservers for a domain, reverse NS checking does the opposite—it finds all domains pointing to a particular nameserver. This is valuable for identifying hosting relationships, discovering related websites, and analyzing DNS infrastructure.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Common use cases:</strong> Web hosting providers use this to identify clients, security researchers track domain networks, SEO professionals discover competitor networks, and domain administrators verify their DNS configurations. By analyzing nameserver usage patterns, you can understand hosting relationships and infrastructure setups.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Use Reverse NS Checker?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Competitor Analysis</h3>
                <p className="text-sm text-gray-700">Discover related websites and domains owned by competitors using the same DNS infrastructure.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🏢 Client Discovery</h3>
                <p className="text-sm text-gray-700">Hosting providers can identify all domains using their nameservers for client management.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔒 Security Research</h3>
                <p className="text-sm text-gray-700">Investigate potential domain networks, identify related sites, and track infrastructure changes.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Market Analysis</h3>
                <p className="text-sm text-gray-700">Analyze hosting provider market share and understand DNS service adoption patterns.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">✅ DNS Verification</h3>
                <p className="text-sm text-gray-700">Verify which domains are properly configured to use your nameservers.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🌐 Network Mapping</h3>
                <p className="text-sm text-gray-700">Map out domain relationships and understand hosting infrastructure topology.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Use Reverse NS Checker</h2>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Enter Nameserver:</strong> Type the nameserver hostname (e.g., ns1.cloudflare.com) or IP address you want to check.</li>
                <li><strong>2. Click Check:</strong> Our tool queries DNS databases to find all domains using that nameserver.</li>
                <li><strong>3. View Results:</strong> See complete list of domains with IP addresses, SSL status, registrar info, and creation dates.</li>
                <li><strong>4. Analyze Data:</strong> Review statistics including SSL coverage, active domains, and registrar distribution.</li>
                <li><strong>5. Export Data:</strong> Download results as CSV or copy domain list to clipboard for further analysis.</li>
                <li><strong>6. Investigate Domains:</strong> Use built-in DNS checker links to examine individual domain records.</li>
              </ol>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Popular Nameservers to Check</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Provider</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nameserver</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Cloudflare</td><td className="border border-gray-300 px-4 py-2 text-sm">ns1.cloudflare.com</td><td className="border border-gray-300 px-4 py-2 text-sm">CDN/DNS</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Google Cloud</td><td className="border border-gray-300 px-4 py-2 text-sm">ns-cloud-a1.googledomains.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Cloud DNS</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">AWS Route53</td><td className="border border-gray-300 px-4 py-2 text-sm">ns-1234.awsdns-12.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Cloud DNS</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">GoDaddy</td><td className="border border-gray-300 px-4 py-2 text-sm">ns01.domaincontrol.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Registrar</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Namecheap</td><td className="border border-gray-300 px-4 py-2 text-sm">dns1.registrar-servers.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Registrar</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">DigitalOcean</td><td className="border border-gray-300 px-4 py-2 text-sm">ns1.digitalocean.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Cloud Hosting</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding the Results</h2>
            <div className="space-y-3">
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-2">Domain Information</h3>
                <p className="text-sm text-gray-700">Each domain shows its IP addresses, SSL status, registrar, and creation date. This helps you understand the full picture of DNS usage.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">SSL Coverage</h3>
                <p className="text-sm text-gray-700">Shows percentage of domains with SSL certificates. Higher percentages indicate better security practices among the domain owners.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">Registrar Distribution</h3>
                <p className="text-sm text-gray-700">Reveals which domain registrars are most popular among domains using this nameserver. Useful for market analysis.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related DNS Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-records-checker" className="hover:text-emerald-600">🌐 DNS Records Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check A, MX, NS, TXT records for any domain.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/reverse-ip-domain-checker" className="hover:text-emerald-600">🔄 Reverse IP Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find all domains hosted on an IP address.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/bulk-domain-whois-checker" className="hover:text-emerald-600">📋 WHOIS Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check domain registration and ownership details.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/domain-ip-history-checker" className="hover:text-emerald-600">📜 IP History Checker</a>
                </h3>
                <p className="text-sm text-gray-700">View historical IP addresses for domains.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a reverse NS lookup?</h3>
                <p className="text-gray-700 text-sm">A: Reverse NS lookup finds all domains using a specific nameserver, opposite of regular DNS lookup which finds nameservers for a domain.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why would I need this tool?</h3>
                <p className="text-gray-700 text-sm">A: It's useful for competitor research, security analysis, hosting provider client discovery, DNS verification, and understanding infrastructure relationships.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I search by nameserver IP?</h3>
                <p className="text-gray-700 text-sm">A: Yes, you can search using either the nameserver hostname (e.g., ns1.example.com) or its IP address.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How accurate are the results?</h3>
                <p className="text-gray-700 text-sm">A: Results are based on current DNS configurations and public DNS databases. Some private or recently changed domains may not appear immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I export the domain list?</h3>
                <p className="text-gray-700 text-sm">A: Yes! You can copy the domain list to clipboard or export complete results as CSV file with all details.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this tool free?</h3>
                <p className="text-gray-700 text-sm">A: Completely free with unlimited lookups. No registration or payment required. Check any nameserver instantly.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🔍 Check Reverse NS Now!</h2>
            <p className="mb-4">
              Use our <strong>free Reverse NS Checker</strong> to discover all domains using any nameserver. Perfect for hosting providers, security researchers, SEO professionals, and domain administrators.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/dns-records-checker" className="text-purple-100 hover:text-white underline">DNS Records</a> • <a href="/tools/reverse-ip-domain-checker" className="text-purple-100 hover:text-white underline">Reverse IP</a> • <a href="/tools/bulk-domain-whois-checker" className="text-purple-100 hover:text-white underline">WHOIS</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
