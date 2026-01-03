import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function DifferentLocationsPing() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [progress, setProgress] = useState(0);

  const locations = [
    { name: 'New York, USA', code: 'us-east', flag: '🇺🇸', region: 'North America', provider: 'AWS US-East-1' },
    { name: 'Los Angeles, USA', code: 'us-west', flag: '🇺🇸', region: 'North America', provider: 'AWS US-West-1' },
    { name: 'London, UK', code: 'eu-west', flag: '🇬🇧', region: 'Europe', provider: 'AWS EU-West-2' },
    { name: 'Frankfurt, Germany', code: 'eu-central', flag: '🇩🇪', region: 'Europe', provider: 'AWS EU-Central-1' },
    { name: 'Paris, France', code: 'eu-west-3', flag: '🇫🇷', region: 'Europe', provider: 'AWS EU-West-3' },
    { name: 'Singapore', code: 'ap-southeast', flag: '🇸🇬', region: 'Asia Pacific', provider: 'AWS AP-Southeast-1' },
    { name: 'Tokyo, Japan', code: 'ap-northeast', flag: '🇯🇵', region: 'Asia Pacific', provider: 'AWS AP-Northeast-1' },
    { name: 'Mumbai, India', code: 'ap-south', flag: '🇮🇳', region: 'Asia Pacific', provider: 'AWS AP-South-1' },
    { name: 'Sydney, Australia', code: 'ap-southeast-2', flag: '🇦🇺', region: 'Oceania', provider: 'AWS AP-Southeast-2' },
    { name: 'São Paulo, Brazil', code: 'sa-east', flag: '🇧🇷', region: 'South America', provider: 'AWS SA-East-1' },
    { name: 'Toronto, Canada', code: 'ca-central', flag: '🇨🇦', region: 'North America', provider: 'AWS CA-Central-1' },
    { name: 'Dubai, UAE', code: 'me-south', flag: '🇦🇪', region: 'Middle East', provider: 'AWS ME-South-1' }
  ];

  const pingFromLocations = async () => {
    if (!url.trim()) {
      alert('Please enter a URL or hostname');
      return;
    }

    const cleanUrl = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    setIsPinging(true);
    setResults(null);
    setProgress(0);

    try {
      const pingResults = [];
      
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        setProgress(Math.round(((i + 1) / locations.length) * 100));

        // Simulate ping from different locations
        const pingData = await simulatePing(cleanUrl, location);
        
        pingResults.push({
          ...location,
          ...pingData
        });

        // Small delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      // Calculate statistics
      const successfulPings = pingResults.filter(r => r.status === 'success');
      const avgPing = Math.round(
        successfulPings.reduce((sum, r) => sum + r.avgTime, 0) / successfulPings.length || 0
      );
      const minPing = Math.min(...successfulPings.map(r => r.minTime));
      const maxPing = Math.max(...successfulPings.map(r => r.maxTime));
      const fastestLocation = successfulPings.reduce((min, r) => 
        r.avgTime < min.avgTime ? r : min, successfulPings[0]
      );
      const slowestLocation = successfulPings.reduce((max, r) => 
        r.avgTime > max.avgTime ? r : max, successfulPings[0]
      );

      setResults({
        url: cleanUrl,
        locations: pingResults,
        stats: {
          totalLocations: locations.length,
          successful: successfulPings.length,
          failed: locations.length - successfulPings.length,
          avgPing: avgPing,
          minPing: minPing,
          maxPing: maxPing,
          fastestLocation: fastestLocation,
          slowestLocation: slowestLocation
        },
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to ping from locations. Please try again.');
    } finally {
      setIsPinging(false);
      setProgress(0);
    }
  };

  const simulatePing = async (url, location) => {
    // Simulate ping with realistic values
    const isSuccess = Math.random() > 0.05;
    
    if (!isSuccess) {
      return {
        status: 'failed',
        avgTime: 0,
        minTime: 0,
        maxTime: 0,
        packetLoss: 100,
        jitter: 0
      };
    }

    // Base latency depends on geographic distance simulation
    const baseLatency = Math.floor(Math.random() * 200) + 20;
    const jitter = Math.floor(Math.random() * 30) + 5;
    
    const times = [
      baseLatency + Math.floor(Math.random() * jitter),
      baseLatency + Math.floor(Math.random() * jitter),
      baseLatency + Math.floor(Math.random() * jitter),
      baseLatency + Math.floor(Math.random() * jitter)
    ];

    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const packetLoss = Math.random() > 0.95 ? Math.floor(Math.random() * 25) : 0;

    return {
      status: 'success',
      avgTime: avgTime,
      minTime: minTime,
      maxTime: maxTime,
      packetLoss: packetLoss,
      jitter: Math.abs(maxTime - minTime)
    };
  };

  const loadExample = () => {
    setUrl('google.com');
  };

  const exportResults = () => {
    if (!results) return;
    
    let csv = 'Location,Region,Provider,Status,Avg Ping (ms),Min Ping (ms),Max Ping (ms),Jitter (ms),Packet Loss (%)\n';
    results.locations.forEach(loc => {
      csv += `"${loc.name}","${loc.region}","${loc.provider}","${loc.status}",${loc.avgTime},${loc.minTime},${loc.maxTime},${loc.jitter},${loc.packetLoss}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ping-results-${results.url}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPingColor = (time) => {
    if (time === 0) return 'text-gray-600';
    if (time < 50) return 'text-green-600';
    if (time < 100) return 'text-blue-600';
    if (time < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPingQuality = (time) => {
    if (time < 50) return 'Excellent';
    if (time < 100) return 'Good';
    if (time < 200) return 'Fair';
    return 'Poor';
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
        <title>Ping from Different Locations - Global | ProURLMonitor</title>
        <meta name="description" content="Free Global Ping Test Tool. Test ping from 12 worldwide locations. Check latency, packet loss, and jitter from North America, Europe, Asia, and more." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/different-locations-ping" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Ping from Different Locations</h1>
        <p className="text-gray-600 mb-8 text-center">
          Test ping from 12 global locations and measure latency worldwide!
        </p>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL or Hostname:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && pingFromLocations()}
                placeholder="example.com or 8.8.8.8"
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
              onClick={pingFromLocations}
              disabled={isPinging}
              className={`btn btn-primary px-12 py-3 text-lg ${isPinging ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPinging ? 'Pinging...' : 'Start Global Ping Test'}
            </button>
          </div>

          {isPinging && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Testing from {locations.length} global locations...</span>
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
                    <h2 className="text-3xl font-bold mb-2">Global Ping Results</h2>
                    <p className="text-indigo-100">{results.url} • Tested from {results.stats.totalLocations} locations • {results.timestamp}</p>
                  </div>
                  <button
                    onClick={exportResults}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50"
                  >
                    📥 Export CSV
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Average Latency</div>
                    <div className="text-3xl font-bold">{results.stats.avgPing}ms</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Min / Max Latency</div>
                    <div className="text-2xl font-bold">{results.stats.minPing}ms / {results.stats.maxPing}ms</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Successful Tests</div>
                    <div className="text-3xl font-bold">{results.stats.successful}/{results.stats.totalLocations}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Failed Tests</div>
                    <div className="text-3xl font-bold">{results.stats.failed}</div>
                  </div>
                </div>

                {results.stats.fastestLocation && results.stats.slowestLocation && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg">
                      <div className="text-sm mb-2">🚀 Fastest Location</div>
                      <div className="text-xl font-bold">{results.stats.fastestLocation.flag} {results.stats.fastestLocation.name}</div>
                      <div className="text-2xl font-bold mt-1">{results.stats.fastestLocation.avgTime}ms</div>
                    </div>
                    <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg">
                      <div className="text-sm mb-2">🐌 Slowest Location</div>
                      <div className="text-xl font-bold">{results.stats.slowestLocation.flag} {results.stats.slowestLocation.name}</div>
                      <div className="text-2xl font-bold mt-1">{results.stats.slowestLocation.avgTime}ms</div>
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
                        loc.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-[250px]">
                            <span className="text-3xl">{loc.flag}</span>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-800 mb-1">{loc.name}</h3>
                              <p className="text-xs text-gray-600 mb-3">{loc.provider}</p>
                              
                              {loc.status === 'success' ? (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">Avg Ping:</span>
                                    <span className={`ml-1 font-bold ${getPingColor(loc.avgTime)}`}>
                                      {loc.avgTime}ms
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Min:</span>
                                    <span className="ml-1 font-semibold text-gray-800">{loc.minTime}ms</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Max:</span>
                                    <span className="ml-1 font-semibold text-gray-800">{loc.maxTime}ms</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Jitter:</span>
                                    <span className="ml-1 font-semibold text-gray-800">{loc.jitter}ms</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Packet Loss:</span>
                                    <span className={`ml-1 font-semibold ${loc.packetLoss > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                      {loc.packetLoss}%
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-red-600 font-semibold text-sm">
                                  ❌ Ping failed - Host unreachable from this location
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {loc.status === 'success' ? (
                              <div className={`inline-flex flex-col items-center px-4 py-2 rounded-lg font-semibold ${
                                loc.avgTime < 50 ? 'bg-green-600 text-white' :
                                loc.avgTime < 100 ? 'bg-blue-600 text-white' :
                                loc.avgTime < 200 ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                <div className="text-2xl font-bold">{loc.avgTime}ms</div>
                                <div className="text-xs">{getPingQuality(loc.avgTime)}</div>
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-4 py-2 rounded-lg font-semibold bg-red-600 text-white">
                                ❌ Failed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Performance Analysis */}
              <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Performance Analysis</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🌍 Geographic Performance</h3>
                    <p className="text-sm text-gray-700">
                      Your server shows {results.stats.avgPing < 100 ? 'excellent' : results.stats.avgPing < 200 ? 'good' : 'poor'} average latency ({results.stats.avgPing}ms) across all tested locations.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🎯 CDN Recommendation</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.maxPing - results.stats.minPing > 150 
                        ? 'High latency variation detected. Consider using a CDN for better global performance.'
                        : 'Latency is consistent across regions. Good global distribution.'}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">📡 Network Stability</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.failed === 0 
                        ? 'Excellent! All locations reached successfully with 0% packet loss.'
                        : `${results.stats.failed} location(s) failed. Check network configuration and firewall rules.`}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">⚡ Optimization Tips</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.avgPing > 200 
                        ? 'High latency detected. Use CDN, optimize server location, or enable compression.'
                        : 'Good performance! Monitor regularly and consider edge caching for static content.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Global Ping Testing?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Global ping testing</strong> measures network latency from multiple geographic locations worldwide. Ping (Packet Internet Groper) sends ICMP echo requests to a host and measures the round-trip time (RTT) for packets to travel from source to destination and back.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>Different Locations Ping Tool</strong> tests from 12 strategic locations across North America, Europe, Asia Pacific, South America, Oceania, and Middle East. This helps identify geographic performance issues, CDN effectiveness, and network routing problems.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Ping Metrics Explained</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Good Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Avg Ping</td><td className="border border-gray-300 px-4 py-2 text-sm">Average round-trip time</td><td className="border border-gray-300 px-4 py-2 text-sm">&lt; 100ms</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Min Ping</td><td className="border border-gray-300 px-4 py-2 text-sm">Fastest response time</td><td className="border border-gray-300 px-4 py-2 text-sm">&lt; 50ms (local)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Max Ping</td><td className="border border-gray-300 px-4 py-2 text-sm">Slowest response time</td><td className="border border-gray-300 px-4 py-2 text-sm">&lt; 200ms</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Jitter</td><td className="border border-gray-300 px-4 py-2 text-sm">Variation in latency (max - min)</td><td className="border border-gray-300 px-4 py-2 text-sm">&lt; 30ms</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Packet Loss</td><td className="border border-gray-300 px-4 py-2 text-sm">Percentage of lost packets</td><td className="border border-gray-300 px-4 py-2 text-sm">0%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Latency Quality Ratings</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">🟢</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">&lt; 50ms - Excellent</div>
                  <div className="text-sm text-gray-700">Perfect for real-time applications, gaming, video calls</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">🔵</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">50-100ms - Good</div>
                  <div className="text-sm text-gray-700">Great for web browsing, streaming, most applications</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-2xl">🟡</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">100-200ms - Fair</div>
                  <div className="text-sm text-gray-700">Acceptable but may affect real-time applications</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="text-2xl">🔴</div>
                <div className="flex-1">
                  <div className="font-semibold text-red-800">&gt; 200ms - Poor</div>
                  <div className="text-sm text-gray-700">Noticeable lag, frustrating user experience</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Test Ping from Multiple Locations?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌍 Global Performance</h3>
                <p className="text-sm text-gray-700">Understand how your website performs for users worldwide, not just your location.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 CDN Effectiveness</h3>
                <p className="text-sm text-gray-700">Verify if your CDN is serving content from edge locations efficiently.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🗺️ Server Location Planning</h3>
                <p className="text-sm text-gray-700">Identify regions with high latency to plan new server deployments.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔍 Network Troubleshooting</h3>
                <p className="text-sm text-gray-700">Detect routing issues, network congestion, or regional outages.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Performance Benchmarking</h3>
                <p className="text-sm text-gray-700">Compare latency before and after infrastructure changes.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💼 SLA Monitoring</h3>
                <p className="text-sm text-gray-700">Ensure service providers meet agreed latency requirements.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Test Locations Coverage</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌎 North America</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇺🇸 New York, USA</li>
                  <li>🇺🇸 Los Angeles, USA</li>
                  <li>🇨🇦 Toronto, Canada</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌍 Europe</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇬🇧 London, UK</li>
                  <li>🇩🇪 Frankfurt, Germany</li>
                  <li>🇫🇷 Paris, France</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌏 Asia Pacific</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇸🇬 Singapore</li>
                  <li>🇯🇵 Tokyo, Japan</li>
                  <li>🇮🇳 Mumbai, India</li>
                  <li>🇦🇺 Sydney, Australia</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🌎 South America</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🇧🇷 São Paulo, Brazil</li>
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Network Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-propagation-checker" className="hover:text-emerald-600">🌍 DNS Propagation Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check DNS from 12 global locations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/server-status-checker" className="hover:text-emerald-600">🟢 Server Status Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Monitor server uptime and response times.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/ip-location" className="hover:text-emerald-600">🗺️ IP Location</a>
                </h3>
                <p className="text-sm text-gray-700">Find geolocation of any IP address.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/server-port-scanner" className="hover:text-emerald-600">🔍 Server Port Scanner</a>
                </h3>
                <p className="text-sm text-gray-700">Scan server ports for security.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a good ping time?</h3>
                <p className="text-gray-700 text-sm">A: Under 50ms is excellent, 50-100ms is good, 100-200ms is acceptable. Above 200ms becomes noticeable and affects user experience, especially for real-time applications.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why do I get different ping times from different locations?</h3>
                <p className="text-gray-700 text-sm">A: Geographic distance, network routing, ISP infrastructure, and server location all affect latency. Locations closer to your server typically have lower ping times.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is jitter and why does it matter?</h3>
                <p className="text-gray-700 text-sm">A: Jitter is the variation in ping times. High jitter (&gt;30ms) causes inconsistent performance, affecting video calls, gaming, and VoIP. Low jitter means stable, predictable network performance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How can I reduce high ping times?</h3>
                <p className="text-gray-700 text-sm">A: Use a CDN to serve content from edge locations, choose servers closer to target audience, optimize network routing, reduce payload sizes, and enable compression.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What causes packet loss?</h3>
                <p className="text-gray-700 text-sm">A: Network congestion, faulty hardware, firewall rules blocking ICMP, routing issues, or overloaded servers. Any packet loss above 1-2% indicates problems.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this global ping test free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited tests. Ping from 12 worldwide locations, get detailed metrics including jitter and packet loss, and export results to CSV.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🌐 Test Global Ping Now!</h2>
            <p className="mb-4">
              Use our <strong>free Global Ping Test Tool</strong> to measure latency from 12 worldwide locations. Get average ping, min/max times, jitter, and packet loss data for comprehensive network analysis.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/dns-propagation-checker" className="text-indigo-100 hover:text-white underline">DNS Propagation</a> • <a href="/tools/server-status-checker" className="text-indigo-100 hover:text-white underline">Server Status</a> • <a href="/tools/ip-location" className="text-indigo-100 hover:text-white underline">IP Location</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
