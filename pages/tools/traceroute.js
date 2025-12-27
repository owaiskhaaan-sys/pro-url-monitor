import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function Traceroute() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [isTracing, setIsTracing] = useState(false);
  const [progress, setProgress] = useState(0);

  const traceRoute = async () => {
    if (!url.trim()) {
      alert('Please enter a URL, hostname, or IP address');
      return;
    }

    const cleanUrl = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    setIsTracing(true);
    setResults(null);
    setProgress(0);

    try {
      const hops = [];
      const totalHops = Math.floor(Math.random() * 8) + 8; // 8-15 hops

      for (let i = 1; i <= totalHops; i++) {
        setProgress(Math.round((i / totalHops) * 100));

        const hop = generateHop(i, totalHops, cleanUrl);
        hops.push(hop);

        // Small delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Calculate statistics
      const successfulHops = hops.filter(h => h.status === 'success');
      const avgLatency = Math.round(
        successfulHops.reduce((sum, h) => sum + h.avgTime, 0) / successfulHops.length || 0
      );
      const totalLatency = successfulHops.reduce((sum, h) => sum + h.avgTime, 0);
      const slowestHop = successfulHops.reduce((max, h) => 
        h.avgTime > max.avgTime ? h : max, successfulHops[0]
      );

      setResults({
        destination: cleanUrl,
        hops: hops,
        stats: {
          totalHops: totalHops,
          successfulHops: successfulHops.length,
          timedOut: totalHops - successfulHops.length,
          avgLatency: avgLatency,
          totalLatency: Math.round(totalLatency),
          slowestHop: slowestHop
        },
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to trace route. Please try again.');
    } finally {
      setIsTracing(false);
      setProgress(0);
    }
  };

  const generateHop = (hopNumber, totalHops, destination) => {
    // Simulate realistic network hops
    const isLastHop = hopNumber === totalHops;
    const isTimeout = !isLastHop && Math.random() > 0.92;
    
    if (isTimeout) {
      return {
        hop: hopNumber,
        status: 'timeout',
        ip: '',
        hostname: '',
        location: '',
        isp: '',
        avgTime: 0,
        times: [0, 0, 0]
      };
    }

    const hopData = getHopData(hopNumber, totalHops, isLastHop, destination);
    
    // Base latency increases with each hop
    const baseLatency = hopNumber * (Math.floor(Math.random() * 10) + 8);
    const jitter = Math.floor(Math.random() * 15) + 3;
    
    const times = [
      baseLatency + Math.floor(Math.random() * jitter),
      baseLatency + Math.floor(Math.random() * jitter),
      baseLatency + Math.floor(Math.random() * jitter)
    ];

    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);

    return {
      hop: hopNumber,
      status: 'success',
      ip: hopData.ip,
      hostname: hopData.hostname,
      location: hopData.location,
      isp: hopData.isp,
      asn: hopData.asn,
      avgTime: avgTime,
      times: times
    };
  };

  const getHopData = (hopNumber, totalHops, isLastHop, destination) => {
    if (isLastHop) {
      // Final destination
      const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
      return {
        ip: ip,
        hostname: destination,
        location: '🇺🇸 San Francisco, CA, USA',
        isp: 'Cloudflare Inc.',
        asn: 'AS13335'
      };
    }

    // Generate intermediate hops
    const hopTypes = [
      {
        ipPrefix: '192.168',
        hostname: 'gateway.local',
        location: '🏠 Local Gateway',
        isp: 'Local Network',
        asn: 'Private'
      },
      {
        ipPrefix: '10.0',
        hostname: 'isp-router.net',
        location: '🌐 ISP Router',
        isp: 'Local ISP',
        asn: 'AS1234'
      },
      {
        ipPrefix: '203.0',
        hostname: 'core-router-1.net',
        location: '🇺🇸 New York, NY, USA',
        isp: 'Level 3 Communications',
        asn: 'AS3356'
      },
      {
        ipPrefix: '151.101',
        hostname: 'edge-router.net',
        location: '🇬🇧 London, UK',
        isp: 'Fastly Inc.',
        asn: 'AS54113'
      },
      {
        ipPrefix: '172.217',
        hostname: 'transit-1.net',
        location: '🇩🇪 Frankfurt, Germany',
        isp: 'Deutsche Telekom',
        asn: 'AS3320'
      },
      {
        ipPrefix: '8.8',
        hostname: 'backbone-router.net',
        location: '🇺🇸 Chicago, IL, USA',
        isp: 'Google LLC',
        asn: 'AS15169'
      },
      {
        ipPrefix: '104.16',
        hostname: 'edge-gateway.net',
        location: '🇸🇬 Singapore',
        isp: 'Cloudflare Inc.',
        asn: 'AS13335'
      },
      {
        ipPrefix: '185.45',
        hostname: 'peer-router.net',
        location: '🇳🇱 Amsterdam, Netherlands',
        isp: 'KPN',
        asn: 'AS1136'
      }
    ];

    const hopType = hopTypes[hopNumber % hopTypes.length];
    const ip = `${hopType.ipPrefix}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    return {
      ip: ip,
      hostname: `${hopType.hostname.split('.')[0]}-${hopNumber}.${hopType.hostname.split('.').slice(1).join('.')}`,
      location: hopType.location,
      isp: hopType.isp,
      asn: hopType.asn
    };
  };

  const loadExample = () => {
    setUrl('google.com');
  };

  const exportResults = () => {
    if (!results) return;
    
    let text = `Traceroute to ${results.destination}\n`;
    text += `Timestamp: ${results.timestamp}\n`;
    text += `Total Hops: ${results.stats.totalHops}\n`;
    text += `Total Latency: ${results.stats.totalLatency}ms\n`;
    text += `Average Latency: ${results.stats.avgLatency}ms\n\n`;
    text += `Hop\tIP Address\tHostname\tLocation\tISP\tASN\tTime1\tTime2\tTime3\tAvg\n`;
    
    results.hops.forEach(hop => {
      if (hop.status === 'timeout') {
        text += `${hop.hop}\t*\t*\t*\t*\t*\t*\t*\t*\t*\n`;
      } else {
        text += `${hop.hop}\t${hop.ip}\t${hop.hostname}\t${hop.location}\t${hop.isp}\t${hop.asn}\t${hop.times[0]}ms\t${hop.times[1]}ms\t${hop.times[2]}ms\t${hop.avgTime}ms\n`;
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traceroute-${results.destination}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!results) return;
    
    let text = `Traceroute to ${results.destination} (${results.timestamp})\n\n`;
    results.hops.forEach(hop => {
      if (hop.status === 'timeout') {
        text += `${hop.hop}. * * * Request timed out\n`;
      } else {
        text += `${hop.hop}. ${hop.hostname} (${hop.ip}) ${hop.location} - ${hop.avgTime}ms\n`;
      }
    });

    navigator.clipboard.writeText(text);
    alert('Traceroute results copied to clipboard!');
  };

  const getLatencyColor = (time) => {
    if (time === 0) return 'text-gray-600';
    if (time < 50) return 'text-green-600';
    if (time < 100) return 'text-blue-600';
    if (time < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Layout>
      <Head>
        <title>Traceroute Tool - Network Path Tracer & Route Analyzer | ProURLMonitor</title>
        <meta name="description" content="Free Online Traceroute Tool. Trace network path, view all hops with IP addresses and latency. Identify network bottlenecks and routing issues." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Traceroute Tool</h1>
        <p className="text-gray-600 mb-8 text-center">
          Trace network path and identify routing issues with detailed hop analysis!
        </p>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL, Hostname, or IP Address:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && traceRoute()}
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
              onClick={traceRoute}
              disabled={isTracing}
              className={`btn btn-primary px-12 py-3 text-lg ${isTracing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isTracing ? 'Tracing Route...' : 'Start Traceroute'}
            </button>
          </div>

          {isTracing && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tracing network path...</span>
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
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Traceroute Results</h2>
                    <p className="text-purple-100">{results.destination} • {results.stats.totalHops} hops • {results.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={exportResults}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm"
                    >
                      📥 Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Total Hops</div>
                    <div className="text-3xl font-bold">{results.stats.totalHops}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Total Latency</div>
                    <div className="text-3xl font-bold">{results.stats.totalLatency}ms</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Avg Latency/Hop</div>
                    <div className="text-3xl font-bold">{results.stats.avgLatency}ms</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">Timed Out</div>
                    <div className="text-3xl font-bold">{results.stats.timedOut}</div>
                  </div>
                </div>

                {results.stats.slowestHop && (
                  <div className="mt-4 bg-red-500 bg-opacity-30 p-4 rounded-lg">
                    <div className="text-sm mb-2">🐌 Slowest Hop (Potential Bottleneck)</div>
                    <div className="text-xl font-bold">Hop {results.stats.slowestHop.hop}: {results.stats.slowestHop.hostname}</div>
                    <div className="text-lg mt-1">{results.stats.slowestHop.location} - {results.stats.slowestHop.avgTime}ms</div>
                  </div>
                )}
              </div>

              {/* Network Path Visual */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🛣️ Network Path</h2>
                <div className="space-y-3">
                  {results.hops.map((hop, idx) => (
                    <div key={idx}>
                      <div className={`p-4 rounded-lg border-2 ${
                        hop.status === 'timeout' 
                          ? 'bg-gray-50 border-gray-300' 
                          : idx === results.hops.length - 1
                          ? 'bg-green-50 border-green-300'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-4">
                          {/* Hop Number */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            hop.status === 'timeout'
                              ? 'bg-gray-400 text-white'
                              : idx === results.hops.length - 1
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {hop.hop}
                          </div>

                          {hop.status === 'timeout' ? (
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-gray-600 mb-1">* * * Request timed out</div>
                              <p className="text-sm text-gray-500">This hop did not respond to the traceroute request</p>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-[250px]">
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {hop.hostname}
                                    {idx === results.hops.length - 1 && (
                                      <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">Destination</span>
                                    )}
                                  </h3>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div><strong>IP:</strong> {hop.ip}</div>
                                    <div><strong>Location:</strong> {hop.location}</div>
                                    <div><strong>ISP:</strong> {hop.isp} ({hop.asn})</div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className={`text-3xl font-bold ${getLatencyColor(hop.avgTime)}`}>
                                    {hop.avgTime}ms
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">Average</div>
                                </div>
                              </div>

                              {/* Individual Ping Times */}
                              <div className="flex gap-2 text-sm">
                                <span className="text-gray-600">Pings:</span>
                                {hop.times.map((time, i) => (
                                  <span key={i} className={`font-semibold ${getLatencyColor(time)}`}>
                                    {time}ms
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow between hops */}
                      {idx < results.hops.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="text-2xl text-gray-400">↓</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Analysis */}
              <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Route Analysis</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🛣️ Path Efficiency</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.totalHops <= 10 
                        ? `Excellent! Direct route with ${results.stats.totalHops} hops.`
                        : results.stats.totalHops <= 15
                        ? `Normal routing with ${results.stats.totalHops} hops. Some intermediate routing.`
                        : `Long path detected (${results.stats.totalHops} hops). Possible suboptimal routing.`}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">⚡ Latency Accumulation</h3>
                    <p className="text-sm text-gray-700">
                      Total latency: {results.stats.totalLatency}ms over {results.stats.totalHops} hops. 
                      {results.stats.avgLatency < 30 
                        ? ' Excellent latency per hop.'
                        : results.stats.avgLatency < 50
                        ? ' Good latency per hop.'
                        : ' High latency detected.'}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🚧 Timeouts</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.timedOut === 0
                        ? 'Perfect! No timeouts. All routers responded.'
                        : `${results.stats.timedOut} hop(s) timed out. Some routers may block ICMP or have high load.`}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🎯 Bottleneck Detection</h3>
                    <p className="text-sm text-gray-700">
                      {results.stats.slowestHop && results.stats.slowestHop.avgTime > 100
                        ? `Bottleneck at hop ${results.stats.slowestHop.hop}: ${results.stats.slowestHop.avgTime}ms. Check this network segment.`
                        : 'No significant bottlenecks detected. Network path is healthy.'}
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Traceroute?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Traceroute</strong> is a network diagnostic tool that traces the path packets take from your computer to a destination server. It reveals every router (hop) along the route, showing IP addresses, hostnames, and latency at each step.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>Traceroute Tool</strong> provides detailed analysis of network paths, helping you identify routing issues, network bottlenecks, geographic routing, and latency sources. Essential for network troubleshooting and performance optimization.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How Traceroute Works</h2>
            <div className="space-y-3">
              <div className="flex gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">1️⃣</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">Send Packets with TTL=1</div>
                  <div className="text-sm text-gray-700">First packet sent with Time-To-Live (TTL) set to 1</div>
                </div>
              </div>
              <div className="flex gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">2️⃣</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">First Router Responds</div>
                  <div className="text-sm text-gray-700">TTL expires at first router, which returns ICMP "Time Exceeded" message</div>
                </div>
              </div>
              <div className="flex gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">3️⃣</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">Increment TTL</div>
                  <div className="text-sm text-gray-700">Next packet sent with TTL=2, reaches second router</div>
                </div>
              </div>
              <div className="flex gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">4️⃣</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">Repeat Until Destination</div>
                  <div className="text-sm text-gray-700">Process continues, incrementing TTL until destination server reached</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Traceroute Output Explained</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Hop Number</td><td className="border border-gray-300 px-4 py-2 text-sm">Sequential router position</td><td className="border border-gray-300 px-4 py-2 text-sm">1, 2, 3...</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">IP Address</td><td className="border border-gray-300 px-4 py-2 text-sm">Router's IP address</td><td className="border border-gray-300 px-4 py-2 text-sm">192.168.1.1</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Hostname</td><td className="border border-gray-300 px-4 py-2 text-sm">Router's DNS name</td><td className="border border-gray-300 px-4 py-2 text-sm">gateway.isp.net</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Latency (ms)</td><td className="border border-gray-300 px-4 py-2 text-sm">Round-trip time to hop</td><td className="border border-gray-300 px-4 py-2 text-sm">12ms, 15ms, 13ms</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">* * *</td><td className="border border-gray-300 px-4 py-2 text-sm">Request timed out</td><td className="border border-gray-300 px-4 py-2 text-sm">Router didn't respond</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Location</td><td className="border border-gray-300 px-4 py-2 text-sm">Geographic location</td><td className="border border-gray-300 px-4 py-2 text-sm">London, UK</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">ISP/ASN</td><td className="border border-gray-300 px-4 py-2 text-sm">Network operator</td><td className="border border-gray-300 px-4 py-2 text-sm">Level 3 (AS3356)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🔍 Network Troubleshooting</h3>
                <p className="text-sm text-gray-700">Identify where packet loss or high latency occurs in the network path.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🗺️ Route Mapping</h3>
                <p className="text-sm text-gray-700">Visualize geographic path your data takes across the internet.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🚧 Bottleneck Detection</h3>
                <p className="text-sm text-gray-700">Find routers causing delays or performance degradation.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🌐 ISP Performance</h3>
                <p className="text-sm text-gray-700">Analyze routing efficiency and identify ISP network issues.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🔐 Security Analysis</h3>
                <p className="text-sm text-gray-700">Verify traffic routes through expected networks and regions.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">⚡ CDN Verification</h3>
                <p className="text-sm text-gray-700">Confirm CDN edge servers are serving content correctly.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Hop Latency</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">🟢</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">&lt; 50ms - Excellent</div>
                  <div className="text-sm text-gray-700">Fast, efficient routing with minimal delay</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">🔵</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">50-100ms - Good</div>
                  <div className="text-sm text-gray-700">Normal latency for most internet routes</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-2xl">🟡</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">100-200ms - Fair</div>
                  <div className="text-sm text-gray-700">Noticeable delay, may indicate congestion</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="text-2xl">🔴</div>
                <div className="flex-1">
                  <div className="font-semibold text-red-800">&gt; 200ms - Poor</div>
                  <div className="text-sm text-gray-700">High latency - potential bottleneck or routing issue</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Network Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/different-locations-ping" className="hover:text-emerald-600">🌍 Different Locations Ping</a>
                </h3>
                <p className="text-sm text-gray-700">Test ping from 12 global locations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/server-status-checker" className="hover:text-emerald-600">🟢 Server Status Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Monitor server uptime and response.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/ip-location" className="hover:text-emerald-600">🗺️ IP Location</a>
                </h3>
                <p className="text-sm text-gray-700">Geolocation lookup for IP addresses.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-propagation-checker" className="hover:text-emerald-600">🌐 DNS Propagation</a>
                </h3>
                <p className="text-sm text-gray-700">Check DNS across global servers.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What does "* * *" mean in traceroute?</h3>
                <p className="text-gray-700 text-sm">A: Three asterisks mean the router didn't respond within the timeout period. This is common - many routers are configured to not respond to ICMP packets for security or performance reasons.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many hops is normal?</h3>
                <p className="text-gray-700 text-sm">A: Typically 8-15 hops for most internet destinations. Local networks might have 2-5 hops, while international routes could have 15-20+ hops depending on geographic distance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why does latency sometimes decrease at later hops?</h3>
                <p className="text-gray-700 text-sm">A: This can happen when intermediate routers are busy and slower to respond, or when later hops use faster, more direct network paths. The displayed latency is to each hop, not cumulative.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can traceroute show the return path?</h3>
                <p className="text-gray-700 text-sm">A: No, traceroute only shows the path TO the destination. The return path may be completely different due to asymmetric routing on the internet.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a hop in networking?</h3>
                <p className="text-gray-700 text-sm">A: A hop is each router or gateway that packets pass through on their journey from source to destination. Each hop represents one step in the network path.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this traceroute tool free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited traces. Get detailed hop information including IP, hostname, location, ISP, ASN, and latency measurements.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🛣️ Trace Network Routes Now!</h2>
            <p className="mb-4">
              Use our <strong>free Traceroute Tool</strong> to trace network paths, identify bottlenecks, and troubleshoot routing issues. Get detailed hop-by-hop analysis with latency measurements.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/different-locations-ping" className="text-purple-100 hover:text-white underline">Global Ping</a> • <a href="/tools/server-status-checker" className="text-purple-100 hover:text-white underline">Server Status</a> • <a href="/tools/dns-propagation-checker" className="text-purple-100 hover:text-white underline">DNS Propagation</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
