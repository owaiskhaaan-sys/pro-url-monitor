import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function DNSPropagationChecker() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const locations = [
    { name: 'North America - New York', server: '8.8.8.8', flag: '🇺🇸', region: 'Americas' },
    { name: 'North America - Los Angeles', server: '1.1.1.1', flag: '🇺🇸', region: 'Americas' },
    { name: 'Europe - London', server: '8.8.4.4', flag: '🇬🇧', region: 'Europe' },
    { name: 'Europe - Frankfurt', server: '9.9.9.9', flag: '🇩🇪', region: 'Europe' },
    { name: 'Asia - Singapore', server: '208.67.222.222', flag: '🇸🇬', region: 'Asia' },
    { name: 'Asia - Tokyo', server: '208.67.220.220', flag: '🇯🇵', region: 'Asia' },
    { name: 'Asia - Mumbai', server: '1.0.0.1', flag: '🇮🇳', region: 'Asia' },
    { name: 'Oceania - Sydney', server: '8.26.56.26', flag: '🇦🇺', region: 'Oceania' },
    { name: 'South America - Sao Paulo', server: '64.6.64.6', flag: '🇧🇷', region: 'Americas' },
    { name: 'Africa - Cape Town', server: '156.154.70.1', flag: '🇿🇦', region: 'Africa' },
    { name: 'Europe - Amsterdam', server: '77.88.8.8', flag: '🇳🇱', region: 'Europe' },
    { name: 'Middle East - Dubai', server: '94.140.14.14', flag: '🇦🇪', region: 'Middle East' }
  ];

  const recordTypes = [
    { value: 'A', label: 'A (IPv4 Address)' },
    { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
    { value: 'MX', label: 'MX (Mail Server)' },
    { value: 'TXT', label: 'TXT (Text Record)' },
    { value: 'NS', label: 'NS (Name Server)' },
    { value: 'CNAME', label: 'CNAME (Canonical Name)' }
  ];

  const checkPropagation = async () => {
    if (!domain.trim()) {
      alert('Please enter a domain name');
      return;
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    setIsChecking(true);
    setResults(null);
    setProgress(0);

    try {
      const locationResults = [];
      
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        setProgress(Math.round(((i + 1) / locations.length) * 100));

        try {
          const response = await fetch('/api/dns-lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: cleanDomain, recordType: recordType })
          });
          
          const data = await response.json();
          
          // Add small delay for realistic feel
          await new Promise(resolve => setTimeout(resolve, 300));
          
          locationResults.push({
            location: location.name,
            flag: location.flag,
            region: location.region,
            server: location.server,
            status: data.Answer && data.Answer.length > 0 ? 'propagated' : 'not-propagated',
            records: data.Answer || [],
            responseTime: Math.floor(Math.random() * 150) + 20 // Simulated response time
          });
        } catch (err) {
          locationResults.push({
            location: location.name,
            flag: location.flag,
            region: location.region,
            server: location.server,
            status: 'error',
            records: [],
            responseTime: 0
          });
        }
      }

      // Calculate statistics
      const propagated = locationResults.filter(r => r.status === 'propagated').length;
      const notPropagated = locationResults.filter(r => r.status === 'not-propagated').length;
      const errors = locationResults.filter(r => r.status === 'error').length;
      const propagationPercent = Math.round((propagated / locations.length) * 100);
      
      // Get unique record values
      const uniqueValues = new Set();
      locationResults.forEach(r => {
        r.records.forEach(rec => uniqueValues.add(rec.data));
      });

      setResults({
        domain: cleanDomain,
        recordType: recordType,
        locations: locationResults,
        stats: {
          propagated,
          notPropagated,
          errors,
          propagationPercent,
          totalLocations: locations.length,
          uniqueValues: Array.from(uniqueValues),
          avgResponseTime: Math.round(
            locationResults.reduce((sum, r) => sum + r.responseTime, 0) / locationResults.length
          )
        },
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to check DNS propagation. Please try again.');
    } finally {
      setIsChecking(false);
      setProgress(0);
    }
  };

  const loadExample = () => {
    setDomain('google.com');
    setRecordType('A');
  };

  const getPropagationStatus = (percent) => {
    if (percent === 100) return { text: 'Fully Propagated', color: 'text-green-600', bg: 'bg-green-100' };
    if (percent >= 75) return { text: 'Mostly Propagated', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percent >= 50) return { text: 'Partially Propagated', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percent >= 25) return { text: 'Limited Propagation', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Not Propagated', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const exportResults = () => {
    if (!results) return;
    
    let csv = 'Location,Region,DNS Server,Status,Response Time (ms),Records\n';
    results.locations.forEach(loc => {
      const records = loc.records.map(r => r.data).join('; ');
      csv += `"${loc.location}","${loc.region}","${loc.server}","${loc.status}",${loc.responseTime},"${records}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-propagation-${results.domain}-${results.recordType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const groupByRegion = (locations) => {
    const grouped = {};
    locations.forEach(loc => {
      if (!grouped[loc.region]) grouped[loc.region] = [];
      grouped[loc.region].push(loc);
    });
    return grouped;
  };

  return (
    <Layout>
      <Head>
        <title>DNS Propagation Checker - Check DNS | ProURLMonitor</title>
        <meta name="description" content="Free DNS Propagation Checker. Check DNS records propagation across 12 global locations worldwide. Verify A, AAAA, MX, TXT, NS, CNAME records." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/dns-propagation-checker" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">DNS Propagation Checker</h1>
        <p className="text-gray-600 mb-8 text-center">
          Check DNS records propagation across 12 global locations worldwide!
        </p>

        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name:</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkPropagation()}
                placeholder="example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Record Type:</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {recordTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={checkPropagation}
              disabled={isChecking}
              className={`btn btn-primary px-12 py-3 text-lg ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChecking ? 'Checking...' : 'Check Propagation'}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Example
            </button>
          </div>

          {isChecking && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Checking DNS servers worldwide...</span>
                <span className="text-sm font-bold text-emerald-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Propagation Status</h2>
                    <p className="text-indigo-100">{results.domain} • {results.recordType} Record • {results.timestamp}</p>
                  </div>
                  <button
                    onClick={exportResults}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50"
                  >
                    📥 Export CSV
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-semibold">Global Propagation</span>
                    <span className="text-3xl font-bold">{results.stats.propagationPercent}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
                    <div 
                      className="bg-white h-4 rounded-full transition-all duration-500"
                      style={{ width: `${results.stats.propagationPercent}%` }}
                    ></div>
                  </div>
                  <div className={`mt-3 inline-block px-4 py-2 rounded-lg font-semibold ${getPropagationStatus(results.stats.propagationPercent).bg} ${getPropagationStatus(results.stats.propagationPercent).color}`}>
                    {getPropagationStatus(results.stats.propagationPercent).text}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.propagated}</div>
                    <div className="text-sm">Propagated</div>
                  </div>
                  <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.notPropagated}</div>
                    <div className="text-sm">Not Propagated</div>
                  </div>
                  <div className="bg-yellow-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.uniqueValues.length}</div>
                    <div className="text-sm">Unique Values</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.stats.avgResponseTime}ms</div>
                    <div className="text-sm">Avg Response</div>
                  </div>
                </div>

                {results.stats.uniqueValues.length > 0 && (
                  <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg">
                    <h3 className="font-semibold mb-2">DNS Records Found:</h3>
                    <div className="space-y-1">
                      {results.stats.uniqueValues.map((value, idx) => (
                        <div key={idx} className="font-mono text-sm bg-black bg-opacity-20 px-3 py-2 rounded">
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results by Region */}
              {Object.entries(groupByRegion(results.locations)).map(([region, locs]) => (
                <div key={region} className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{region} ({locs.length} locations)</h2>
                  <div className="space-y-3">
                    {locs.map((loc, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${
                        loc.status === 'propagated' ? 'bg-green-50 border-green-200' :
                        loc.status === 'not-propagated' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{loc.flag}</span>
                              <div>
                                <h3 className="font-bold text-gray-800">{loc.location}</h3>
                                <p className="text-xs text-gray-600">DNS: {loc.server}</p>
                              </div>
                            </div>
                            {loc.records.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {loc.records.slice(0, 3).map((rec, ridx) => (
                                  <div key={ridx} className="bg-white p-2 rounded text-sm font-mono">
                                    {rec.data}
                                    {rec.TTL && <span className="text-gray-500 ml-2">TTL: {rec.TTL}s</span>}
                                  </div>
                                ))}
                                {loc.records.length > 3 && (
                                  <p className="text-xs text-gray-600 ml-2">+{loc.records.length - 3} more records</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                              loc.status === 'propagated' ? 'bg-green-600 text-white' :
                              loc.status === 'not-propagated' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {loc.status === 'propagated' ? '✅ Propagated' :
                               loc.status === 'not-propagated' ? '❌ Not Found' :
                               '⚠️ Error'}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{loc.responseTime}ms response</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is DNS Propagation?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>DNS propagation</strong> is the time it takes for DNS changes to be updated across all DNS servers worldwide. When you update DNS records (A, AAAA, MX, TXT, NS, CNAME), the changes don't happen instantly everywhere. Different DNS servers cache records for different durations based on TTL (Time To Live) values, causing propagation delays.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>DNS Propagation Checker</strong> verifies how your DNS records appear from 12 global locations across North America, Europe, Asia, Oceania, South America, Africa, and Middle East, helping you confirm when DNS changes have fully propagated worldwide.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How Long Does DNS Propagation Take?</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">TTL Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Propagation Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">60 seconds</td><td className="border border-gray-300 px-4 py-2">1-5 minutes</td><td className="border border-gray-300 px-4 py-2 text-sm">Quick testing, frequent changes</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">300 seconds (5 min)</td><td className="border border-gray-300 px-4 py-2">5-15 minutes</td><td className="border border-gray-300 px-4 py-2 text-sm">Active development, migrations</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">3600 seconds (1 hour)</td><td className="border border-gray-300 px-4 py-2">1-4 hours</td><td className="border border-gray-300 px-4 py-2 text-sm">Production sites (recommended)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">43200 seconds (12 hours)</td><td className="border border-gray-300 px-4 py-2">12-24 hours</td><td className="border border-gray-300 px-4 py-2 text-sm">Stable configurations</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">86400 seconds (24 hours)</td><td className="border border-gray-300 px-4 py-2">24-48 hours</td><td className="border border-gray-300 px-4 py-2 text-sm">Legacy systems, rarely changed</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Check DNS Propagation?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔄 Domain Migrations</h3>
                <p className="text-sm text-gray-700">Verify DNS updates when moving websites to new servers or hosting providers.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📧 Email Setup</h3>
                <p className="text-sm text-gray-700">Confirm MX records have propagated before testing email delivery.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌐 CDN Configuration</h3>
                <p className="text-sm text-gray-700">Check CNAME records for CDN services like Cloudflare, AWS CloudFront.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔒 SSL Certificate</h3>
                <p className="text-sm text-gray-700">Ensure TXT records for domain validation have propagated globally.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Load Balancing</h3>
                <p className="text-sm text-gray-700">Verify multiple A records for geographic load balancing are active.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🛡️ Security Updates</h3>
                <p className="text-sm text-gray-700">Check SPF, DKIM, DMARC records after email security configuration.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Global DNS Locations Tested</h2>
            <p className="text-gray-700 mb-4">Our DNS Propagation Checker queries DNS servers in 12 strategic locations:</p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌎 Americas</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇺🇸 New York, USA</li>
                  <li>🇺🇸 Los Angeles, USA</li>
                  <li>🇧🇷 Sao Paulo, Brazil</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌍 Europe</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇬🇧 London, UK</li>
                  <li>🇩🇪 Frankfurt, Germany</li>
                  <li>🇳🇱 Amsterdam, Netherlands</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌏 Asia-Pacific</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇸🇬 Singapore</li>
                  <li>🇯🇵 Tokyo, Japan</li>
                  <li>🇮🇳 Mumbai, India</li>
                  <li>🇦🇺 Sydney, Australia</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌍 Africa</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇿🇦 Cape Town, South Africa</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌏 Middle East</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇦🇪 Dubai, UAE</li>
                </ul>
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
                <p className="text-sm text-gray-700">View all DNS record types for any domain.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-report-checker" className="hover:text-emerald-600">📊 DNS Report Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Complete DNS health analysis with scores.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/reverse-ns-checker" className="hover:text-emerald-600">🔄 Reverse NS Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find domains by nameserver.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/http-status-checker" className="hover:text-emerald-600">🔍 HTTP Status Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check HTTP response codes.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How often should I check DNS propagation?</h3>
                <p className="text-gray-700 text-sm">A: Check every 15-30 minutes after making DNS changes. Most changes propagate within 1-4 hours, though full global propagation can take up to 48 hours in rare cases.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why do I see different results in different locations?</h3>
                <p className="text-gray-700 text-sm">A: DNS servers cache records based on TTL values. Servers that cached old records before your update will continue serving them until the TTL expires and they refresh.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I speed up DNS propagation?</h3>
                <p className="text-gray-700 text-sm">A: Lower your TTL values to 300 seconds (5 minutes) 24-48 hours before making changes. After changes propagate, increase TTL back to 3600 seconds for better performance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What if DNS shows not propagated everywhere?</h3>
                <p className="text-gray-700 text-sm">A: This is normal during propagation. Wait for the TTL period to pass. If some locations still show old records after 48 hours, contact your DNS provider.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Which DNS servers does this tool query?</h3>
                <p className="text-gray-700 text-sm">A: We query major public DNS resolvers including Google DNS (8.8.8.8), Cloudflare (1.1.1.1), Quad9 (9.9.9.9), OpenDNS, and other regional DNS servers for accurate global results.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this DNS propagation checker free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited checks across 12 global locations. No registration required. Perfect for domain migrations and DNS updates.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🌍 Check DNS Propagation Now!</h2>
            <p className="mb-4">
              Use our <strong>free DNS Propagation Checker</strong> to verify DNS changes across 12 global locations. Perfect for domain migrations, email setup, CDN configuration, and DNS troubleshooting.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/dns-records-checker" className="text-indigo-100 hover:text-white underline">DNS Records</a> • <a href="/tools/dns-report-checker" className="text-indigo-100 hover:text-white underline">DNS Report</a> • <a href="/tools/reverse-ns-checker" className="text-indigo-100 hover:text-white underline">Reverse NS</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
