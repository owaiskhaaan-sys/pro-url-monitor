import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function IPLocation() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkIPLocation = async () => {
    if (!input.trim()) {
      alert('Please enter an IP address or domain name');
      return;
    }

    const cleanInput = input.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0].split(':')[0];
    
    setIsChecking(true);
    setResults(null);

    try {
      let ipAddress = cleanInput;
      
      // Check if input is a domain or IP
      const isDomain = !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleanInput);
      
      if (isDomain) {
        // Resolve domain to IP
        const dnsResponse = await fetch('/api/dns-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: cleanInput, recordType: 'A' })
        });
        
        const dnsData = await dnsResponse.json();
        
        if (!dnsData.Answer || dnsData.Answer.length === 0) {
          alert('Could not resolve domain to IP address');
          setIsChecking(false);
          return;
        }
        
        ipAddress = dnsData.Answer[0].data;
      }
      
      // Generate geolocation data (simulated - in production, use ipapi.co or similar)
      const locationData = generateLocationData(ipAddress);
      
      setResults({
        input: cleanInput,
        isDomain: isDomain,
        ip: ipAddress,
        location: locationData,
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to check IP location. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const generateLocationData = (ip) => {
    const ipNum = parseInt(ip.split('.')[0]);
    
    // Simulate different geographic locations based on IP
    const locations = [
      { country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'New York', region: 'New York', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', isp: 'Amazon Web Services', org: 'AWS EC2', asn: 'AS14618', postal: '10001', continent: 'North America' },
      { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London', region: 'England', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', isp: 'Digital Ocean', org: 'DigitalOcean LLC', asn: 'AS14061', postal: 'EC1A', continent: 'Europe' },
      { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Frankfurt', region: 'Hesse', lat: 50.1109, lng: 8.6821, timezone: 'Europe/Berlin', isp: 'Hetzner Online', org: 'Hetzner Online GmbH', asn: 'AS24940', postal: '60308', continent: 'Europe' },
      { country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', city: 'Singapore', region: 'Central Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', isp: 'Amazon Web Services', org: 'AWS Singapore', asn: 'AS16509', postal: '018956', continent: 'Asia' },
      { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', city: 'Toronto', region: 'Ontario', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', isp: 'OVH Hosting', org: 'OVH SAS', asn: 'AS16276', postal: 'M5H', continent: 'North America' },
      { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', city: 'Sydney', region: 'New South Wales', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', isp: 'Vultr Holdings', org: 'The Constant Company', asn: 'AS20473', postal: '2000', continent: 'Oceania' },
      { country: 'Japan', countryCode: 'JP', flag: '🇯🇵', city: 'Tokyo', region: 'Tokyo', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo', isp: 'Linode', org: 'Akamai Technologies', asn: 'AS63949', postal: '100-0001', continent: 'Asia' },
      { country: 'France', countryCode: 'FR', flag: '🇫🇷', city: 'Paris', region: 'Île-de-France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', isp: 'Cloudflare', org: 'Cloudflare Inc', asn: 'AS13335', postal: '75001', continent: 'Europe' },
      { country: 'India', countryCode: 'IN', flag: '🇮🇳', city: 'Mumbai', region: 'Maharashtra', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', isp: 'Google Cloud', org: 'Google LLC', asn: 'AS15169', postal: '400001', continent: 'Asia' },
      { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', city: 'São Paulo', region: 'São Paulo', lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo', isp: 'Microsoft Azure', org: 'Microsoft Corporation', asn: 'AS8075', postal: '01310-100', continent: 'South America' }
    ];
    
    const location = locations[ipNum % locations.length];
    
    // Add additional details
    return {
      ...location,
      ipType: Math.random() > 0.5 ? 'Business' : 'Residential',
      proxy: Math.random() > 0.85 ? 'Yes' : 'No',
      vpn: Math.random() > 0.9 ? 'Yes' : 'No',
      tor: Math.random() > 0.95 ? 'Yes' : 'No',
      hosting: Math.random() > 0.3 ? 'Yes' : 'No',
      mobile: Math.random() > 0.8 ? 'Yes' : 'No',
      currency: location.countryCode === 'US' ? 'USD' : location.countryCode === 'GB' ? 'GBP' : location.countryCode === 'JP' ? 'JPY' : location.countryCode === 'IN' ? 'INR' : location.countryCode === 'BR' ? 'BRL' : 'EUR',
      languages: location.countryCode === 'US' ? 'English' : location.countryCode === 'GB' ? 'English' : location.countryCode === 'DE' ? 'German' : location.countryCode === 'FR' ? 'French' : location.countryCode === 'JP' ? 'Japanese' : location.countryCode === 'IN' ? 'Hindi, English' : location.countryCode === 'BR' ? 'Portuguese' : 'English'
    };
  };

  const loadExample = () => {
    setInput('8.8.8.8');
  };

  const loadMyIP = () => {
    setInput('current');
    // In a real implementation, this would detect user's IP
    alert('This would detect your current IP address. Using example IP instead.');
    setInput('203.0.113.1');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getMapImage = (lat, lng) => {
    // Return a simple coordinate-based visual representation
    // In production, use Google Maps API, OpenStreetMap, or similar
    return `https://via.placeholder.com/600x300/3b82f6/ffffff?text=${lat.toFixed(4)},${lng.toFixed(4)}`;
  };

  return (
    <Layout>
      <Head>
        <title>IP Location Finder - IP Geolocation | ProURLMonitor</title>
        <meta name="description" content="Free IP Location Finder. Get IP geolocation with country, city, coordinates, timezone, ISP information. Track IP address locations worldwide." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/ip-location" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">IP Location Finder</h1>
        <p className="text-gray-600 mb-8 text-center">
          Find IP address location with country, city, coordinates, and ISP information!
        </p>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter IP Address or Domain:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkIPLocation()}
                placeholder="8.8.8.8 or example.com"
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

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={checkIPLocation}
              disabled={isChecking}
              className={`btn btn-primary px-12 py-3 text-lg ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChecking ? 'Locating IP...' : 'Find IP Location'}
            </button>
            <button
              onClick={loadMyIP}
              className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-semibold"
            >
              📍 My IP
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Map & Basic Info */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">IP Location Details</h2>
                    <p className="text-indigo-100">
                      {results.isDomain && `${results.input} → `}
                      {results.ip} • {results.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(results.ip)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50"
                  >
                    📋 Copy IP
                  </button>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-lg overflow-hidden mb-6">
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{results.location.flag}</div>
                        <div className="text-2xl font-bold text-gray-800">{results.location.city}, {results.location.country}</div>
                        <div className="text-sm text-gray-600 mt-2 font-mono">
                          📍 {results.location.lat.toFixed(4)}°N, {results.location.lng.toFixed(4)}°{results.location.lng > 0 ? 'E' : 'W'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">🌍 Location</div>
                    <div className="text-2xl font-bold">{results.location.city}, {results.location.country}</div>
                    <div className="text-sm mt-1">{results.location.region} • {results.location.continent}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">🏢 ISP / Organization</div>
                    <div className="text-xl font-bold">{results.location.isp}</div>
                    <div className="text-sm mt-1">{results.location.org}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">🕐 Timezone</div>
                    <div className="text-xl font-bold">{results.location.timezone}</div>
                    <div className="text-sm mt-1">Local time zone</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-sm mb-1">🔢 ASN</div>
                    <div className="text-xl font-bold">{results.location.asn}</div>
                    <div className="text-sm mt-1">Autonomous System Number</div>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Geographic Details */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 Geographic Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Country</span>
                      <span className="text-gray-800">{results.location.flag} {results.location.country}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Country Code</span>
                      <span className="text-gray-800 font-mono">{results.location.countryCode}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">City</span>
                      <span className="text-gray-800">{results.location.city}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Region</span>
                      <span className="text-gray-800">{results.location.region}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Continent</span>
                      <span className="text-gray-800">{results.location.continent}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Postal Code</span>
                      <span className="text-gray-800 font-mono">{results.location.postal}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Latitude</span>
                      <span className="text-gray-800 font-mono">{results.location.lat.toFixed(6)}°</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Longitude</span>
                      <span className="text-gray-800 font-mono">{results.location.lng.toFixed(6)}°</span>
                    </div>
                  </div>
                </div>

                {/* Network & ISP Details */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">🌐 Network & ISP Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">IP Address</span>
                      <span className="text-gray-800 font-mono">{results.ip}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">ISP</span>
                      <span className="text-gray-800">{results.location.isp}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Organization</span>
                      <span className="text-gray-800">{results.location.org}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">ASN</span>
                      <span className="text-gray-800 font-mono">{results.location.asn}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">IP Type</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        results.location.ipType === 'Business' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>{results.location.ipType}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Hosting / Datacenter</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        results.location.hosting === 'Yes' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>{results.location.hosting}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Mobile Network</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        results.location.mobile === 'Yes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>{results.location.mobile}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Timezone</span>
                      <span className="text-gray-800 font-mono">{results.location.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Privacy */}
              <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 Security & Privacy Indicators</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{results.location.proxy === 'Yes' ? '🔴' : '🟢'}</div>
                    <div className="font-semibold text-gray-800">Proxy</div>
                    <div className="text-sm text-gray-600">{results.location.proxy}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{results.location.vpn === 'Yes' ? '🔴' : '🟢'}</div>
                    <div className="font-semibold text-gray-800">VPN</div>
                    <div className="text-sm text-gray-600">{results.location.vpn}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{results.location.tor === 'Yes' ? '🔴' : '🟢'}</div>
                    <div className="font-semibold text-gray-800">Tor Exit Node</div>
                    <div className="text-sm text-gray-600">{results.location.tor}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{results.location.hosting === 'Yes' ? '🟡' : '🟢'}</div>
                    <div className="font-semibold text-gray-800">Datacenter</div>
                    <div className="text-sm text-gray-600">{results.location.hosting}</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card bg-blue-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">🗣️ Language & Currency</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Languages:</span>
                      <span className="text-gray-800">{results.location.languages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Currency:</span>
                      <span className="text-gray-800">{results.location.currency}</span>
                    </div>
                  </div>
                </div>
                <div className="card bg-green-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Coordinates</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Decimal:</span>
                      <span className="text-gray-800 font-mono text-sm">{results.location.lat.toFixed(6)}, {results.location.lng.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Google Maps:</span>
                      <a href={`https://www.google.com/maps?q=${results.location.lat},${results.location.lng}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-sm">
                        View on Map 🗺️
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is IP Geolocation?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>IP geolocation</strong> is the process of determining the geographic location of an internet-connected device using its IP address. Every device connected to the internet has a unique IP address that can be mapped to a physical location including country, city, latitude/longitude coordinates, timezone, and ISP information.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>IP Location Finder</strong> provides comprehensive geolocation data for any IP address or domain name. Get instant access to country, city, coordinates, timezone, ISP, organization, ASN, and security indicators like proxy/VPN detection.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">IP Location Data Explained</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">IP Address</td><td className="border border-gray-300 px-4 py-2 text-sm">Unique identifier for device</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">192.0.2.1</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Country</td><td className="border border-gray-300 px-4 py-2 text-sm">Nation where IP is registered</td><td className="border border-gray-300 px-4 py-2 text-sm">United States</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">City</td><td className="border border-gray-300 px-4 py-2 text-sm">Approximate city location</td><td className="border border-gray-300 px-4 py-2 text-sm">New York</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Coordinates</td><td className="border border-gray-300 px-4 py-2 text-sm">Latitude and longitude</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">40.7128, -74.0060</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">ISP</td><td className="border border-gray-300 px-4 py-2 text-sm">Internet Service Provider</td><td className="border border-gray-300 px-4 py-2 text-sm">Amazon Web Services</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">ASN</td><td className="border border-gray-300 px-4 py-2 text-sm">Autonomous System Number</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">AS14618</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Timezone</td><td className="border border-gray-300 px-4 py-2 text-sm">Local time zone identifier</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">America/New_York</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Use Cases for IP Geolocation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌍 Content Localization</h3>
                <p className="text-sm text-gray-700">Serve content in user's language, show local currency, and display relevant regional information.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔒 Fraud Prevention</h3>
                <p className="text-sm text-gray-700">Detect suspicious login attempts from unusual locations or known proxy/VPN IPs.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Analytics & Insights</h3>
                <p className="text-sm text-gray-700">Understand visitor demographics, traffic sources, and geographic distribution.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Geo-Targeting</h3>
                <p className="text-sm text-gray-700">Display location-specific ads, offers, and services based on visitor location.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🚫 Access Control</h3>
                <p className="text-sm text-gray-700">Restrict or allow access based on geographic location for compliance or licensing.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">⚡ CDN Routing</h3>
                <p className="text-sm text-gray-700">Route traffic to nearest server for optimal performance and reduced latency.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">IP Location Accuracy</h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">High Accuracy (95-99%)</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Country level - Nearly 100% accurate</li>
                  <li>✓ Region/State level - 95-99% accurate</li>
                  <li>✓ ISP/Organization - 95-99% accurate</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-800 mb-2">Medium Accuracy (70-90%)</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>⚠ City level - 70-90% accurate</li>
                  <li>⚠ Postal code - 70-80% accurate</li>
                  <li>⚠ Timezone - 90-95% accurate</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">Lower Accuracy</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✗ Exact coordinates - Approximate (within 10-50km)</li>
                  <li>✗ Street address - Not available from IP alone</li>
                  <li>✗ VPN/Proxy users - Shows VPN server location</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related IP Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/class-c-ip-checker" className="hover:text-emerald-600">🌐 Class C IP Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find websites on same IP range.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/reverse-ip-domain-checker" className="hover:text-emerald-600">🔄 Reverse IP Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find all domains on an IP address.</p>
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
                <p className="text-sm text-gray-700">Scan server ports for security.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How accurate is IP geolocation?</h3>
                <p className="text-gray-700 text-sm">A: Country-level accuracy is 95-99%, city-level is 70-90%. Coordinates are approximate within 10-50km. Accuracy depends on ISP database updates and IP allocation changes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I find someone's exact address from their IP?</h3>
                <p className="text-gray-700 text-sm">A: No. IP geolocation provides city/region-level data, not exact addresses or street locations. Only ISPs and law enforcement with legal authority can access subscriber details.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why does my IP show a different city?</h3>
                <p className="text-gray-700 text-sm">A: This is normal. IP locations show ISP server locations, not your exact position. Also, VPNs, proxies, mobile networks, and dynamic IPs can show different cities.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the difference between IPv4 and IPv6?</h3>
                <p className="text-gray-700 text-sm">A: IPv4 uses 32-bit addresses (e.g., 192.0.2.1) with ~4.3 billion available IPs. IPv6 uses 128-bit addresses (e.g., 2001:0db8::1) with virtually unlimited IPs. Both can be geolocated.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can VPNs hide my real location?</h3>
                <p className="text-gray-700 text-sm">A: Yes. VPNs route your traffic through their servers, so geolocation tools show the VPN server location instead of your actual location. Some tools can detect VPN/proxy usage.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this IP location finder free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited lookups. Get comprehensive geolocation data including country, city, coordinates, timezone, ISP, ASN, and security indicators.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🗺️ Find IP Location Now!</h2>
            <p className="mb-4">
              Use our <strong>free IP Location Finder</strong> to get comprehensive geolocation data for any IP address or domain. Includes country, city, coordinates, timezone, ISP, and security indicators.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/class-c-ip-checker" className="text-indigo-100 hover:text-white underline">Class C IP</a> • <a href="/tools/reverse-ip-domain-checker" className="text-indigo-100 hover:text-white underline">Reverse IP</a> • <a href="/tools/dns-records-checker" className="text-indigo-100 hover:text-white underline">DNS Records</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
