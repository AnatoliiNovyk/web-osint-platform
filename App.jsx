// App.jsx
import React, { useState, useEffect } from 'react';
import { Search, Globe, Server, Mail, Users, MapPin, Calendar, Shield, Eye, Zap, Cpu, Database, Activity, AlertCircle, CheckCircle, XCircle, Loader, Copy, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [apiKey, setApiKey] = useState('');

  // Моковые данные для демонстрации
  const mockResults = {
    domainInfo: {
      domain: 'example.com',
      registrar: 'GoDaddy.com, LLC',
      creationDate: '2023-01-15',
      expirationDate: '2024-01-15',
      nameServers: ['ns1.example.com', 'ns2.example.com'],
      status: 'Active',
      registrant: 'John Doe',
      organization: 'Example Corp',
      country: 'United States',
      emails: ['admin@example.com', 'contact@example.com']
    },
    dnsRecords: {
      A: ['93.184.216.34'],
      MX: ['10 mail.example.com'],
      NS: ['ns1.example.com', 'ns2.example.com'],
      TXT: ['v=spf1 include:_spf.example.com ~all']
    },
    subdomains: [
      'mail.example.com',
      'blog.example.com',
      'shop.example.com',
      'api.example.com'
    ],
    socialProfiles: [
      { platform: 'Twitter', username: '@example', url: 'https://twitter.com/example' },
      { platform: 'LinkedIn', username: 'Example Corp', url: 'https://linkedin.com/company/example' },
      { platform: 'Facebook', username: 'ExamplePage', url: 'https://facebook.com/ExamplePage' }
    ],
    emailAddresses: [
      'admin@example.com',
      'contact@example.com',
      'support@example.com',
      'info@example.com'
    ],
    ipInfo: {
      ip: '93.184.216.34',
      hostname: 'example.com',
      city: 'Los Angeles',
      region: 'California',
      country: 'United States',
      isp: 'Cloudflare, Inc.',
      org: 'Cloudflare',
      asn: 'AS13335'
    },
    sslInfo: {
      issuer: 'Let\'s Encrypt Authority X3',
      validFrom: '2023-06-01',
      validTo: '2023-08-30',
      serialNumber: '04:12:AB:CD:EF:34:56:78',
      signatureAlgorithm: 'sha256WithRSAEncryption'
    }
  };

  const tools = [
    { id: 'whois', name: 'WHOIS Lookup', icon: Globe, color: 'bg-blue-500' },
    { id: 'dns', name: 'DNS Records', icon: Server, color: 'bg-green-500' },
    { id: 'subdomains', name: 'Subdomain Finder', icon: Search, color: 'bg-purple-500' },
    { id: 'emails', name: 'Email Extractor', icon: Mail, color: 'bg-yellow-500' },
    { id: 'social', name: 'Social Profiler', icon: Users, color: 'bg-pink-500' },
    { id: 'ip', name: 'IP Geolocation', icon: MapPin, color: 'bg-indigo-500' },
    { id: 'ssl', name: 'SSL Checker', icon: Shield, color: 'bg-red-500' },
    { id: 'fullscan', name: 'Full Scan', icon: Eye, color: 'bg-teal-500' }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Симуляция API вызова
    setTimeout(() => {
      const newResult = {
        id: Date.now(),
        target: searchQuery,
        timestamp: new Date().toISOString(),
        results: mockResults
      };
      
      setSearchResults([newResult, ...searchResults]);
      setScanHistory([newResult, ...scanHistory]);
      setSelectedTarget(newResult);
      setIsLoading(false);
    }, 1500);
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(selectedTarget, null, 2);
    const dataUri = 'application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `osint_results_${selectedTarget.target}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Eye className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              OSINT Recon
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter domain, IP, or email..."
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 w-80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-lg font-medium flex items-center transition-all"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Scan
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Cpu },
              { id: 'history', name: 'Scan History', icon: Database },
              { id: 'tools', name: 'Tools', icon: Zap },
              { id: 'settings', name: 'Settings', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Total Scans</h3>
                    <Activity className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="text-3xl font-bold mt-4">{scanHistory.length}</p>
                  <p className="text-gray-400 mt-2">Scans completed</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Domains Analyzed</h3>
                    <Globe className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold mt-4">142</p>
                  <p className="text-gray-400 mt-2">Unique domains</p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Emails Found</h3>
                    <Mail className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold mt-4">3,847</p>
                  <p className="text-gray-400 mt-2">Email addresses</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Quick Tools</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {tools.slice(0, 4).map((tool) => (
                      <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${tool.color} rounded-lg p-4 text-left transition-all hover:opacity-90`}
                      >
                        <div className="flex items-center">
                          <tool.icon className="h-6 w-6 mr-3" />
                          <span className="font-medium">{tool.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Recent Scans</h3>
                  <div className="space-y-3">
                    {scanHistory.slice(0, 5).map((scan) => (
                      <div 
                        key={scan.id} 
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTarget(scan);
                          setActiveTab('history');
                        }}
                      >
                        <div>
                          <p className="font-medium">{scan.target}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(scan.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    {scanHistory.length === 0 && (
                      <p className="text-gray-400 text-center py-4">No scan history yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Scan History</h2>
                <div className="flex space-x-2">
                  <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </button>
                </div>
              </div>
              
              {selectedTarget ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{selectedTarget.target}</h3>
                      <p className="text-gray-400">
                        Scanned on {new Date(selectedTarget.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={exportResults}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </button>
                      <button 
                        onClick={() => setSelectedTarget(null)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <Globe className="mr-2 h-5 w-5 text-cyan-400" />
                          Domain Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Registrar:</span>
                            <span>{selectedTarget.results.domainInfo.registrar}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Creation Date:</span>
                            <span>{selectedTarget.results.domainInfo.creationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Expiration Date:</span>
                            <span>{selectedTarget.results.domainInfo.expirationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              {selectedTarget.results.domainInfo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-green-400" />
                          IP Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IP Address:</span>
                            <span className="flex items-center">
                              {selectedTarget.results.ipInfo.ip}
                              <button 
                                onClick={() => copyToClipboard(selectedTarget.results.ipInfo.ip)}
                                className="ml-2 text-gray-400 hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span>{selectedTarget.results.ipInfo.city}, {selectedTarget.results.ipInfo.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">ISP:</span>
                            <span>{selectedTarget.results.ipInfo.isp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Organization:</span>
                            <span>{selectedTarget.results.ipInfo.org}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <Server className="mr-2 h-5 w-5 text-purple-400" />
                          DNS Records
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">A Records</p>
                            {selectedTarget.results.dnsRecords.A.map((record, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{record}</span>
                                <button 
                                  onClick={() => copyToClipboard(record)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">MX Records</p>
                            {selectedTarget.results.dnsRecords.MX.map((record, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{record}</span>
                                <button 
                                  onClick={() => copyToClipboard(record)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <Mail className="mr-2 h-5 w-5 text-yellow-400" />
                          Email Addresses
                        </h4>
                        <div className="space-y-2">
                          {selectedTarget.results.emailAddresses.map((email, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                              <span>{email}</span>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => copyToClipboard(email)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                <button className="text-gray-400 hover:text-cyan-400">
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <Users className="mr-2 h-5 w-5 text-pink-400" />
                          Social Profiles
                        </h4>
                        <div className="space-y-3">
                          {selectedTarget.results.socialProfiles.map((profile, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-800/50 p-3 rounded">
                              <div>
                                <p className="font-medium">{profile.platform}</p>
                                <p className="text-sm text-gray-400">{profile.username}</p>
                              </div>
                              <button className="text-gray-400 hover:text-cyan-400">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold">Scan Results</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="py-3 px-4 text-left">Target</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Results</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanHistory.map((scan) => (
                          <tr key={scan.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                            <td className="py-3 px-4 font-medium">{scan.target}</td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(scan.timestamp).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className="flex items-center text-green-400">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completed
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-4">
                                <span className="flex items-center text-cyan-400">
                                  <Globe className="h-4 w-4 mr-1" />
                                  {Object.keys(scan.results.domainInfo).length}
                                </span>
                                <span className="flex items-center text-purple-400">
                                  <Server className="h-4 w-4 mr-1" />
                                  {Object.keys(scan.results.dnsRecords).length}
                                </span>
                                <span className="flex items-center text-yellow-400">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {scan.results.emailAddresses.length}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={() => setSelectedTarget(scan)}
                                className="text-cyan-400 hover:text-cyan-300 mr-3"
                              >
                                <Eye className="h-5 w-5 inline" />
                              </button>
                              <button className="text-gray-400 hover:text-white">
                                <Download className="h-5 w-5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {scanHistory.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500">
                              No scan history available. Perform a scan to see results here.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">OSINT Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5 }}
                    className={`${tool.color} rounded-xl p-6 text-white cursor-pointer transition-all`}
                  >
                    <div className="flex items-center mb-4">
                      <tool.icon className="h-8 w-8 mr-3" />
                      <h3 className="text-xl font-bold">{tool.name}</h3>
                    </div>
                    <p className="opacity-90">
                      {tool.id === 'whois' && 'Get domain registration information'}
                      {tool.id === 'dns' && 'Lookup DNS records for a domain'}
                      {tool.id === 'subdomains' && 'Discover subdomains of a target'}
                      {tool.id === 'emails' && 'Extract email addresses from websites'}
                      {tool.id === 'social' && 'Find social media profiles'}
                      {tool.id === 'ip' && 'Geolocate IP addresses'}
                      {tool.id === 'ssl' && 'Check SSL certificate information'}
                      {tool.id === 'fullscan' && 'Comprehensive target analysis'}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Tool Configuration</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      API keys are required for advanced tools. Get yours from the provider dashboard.
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Scan Depth</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>Basic (Fast)</option>
                      <option>Standard (Recommended)</option>
                      <option>Deep (Thorough)</option>
                      <option>Extreme (Comprehensive)</option>
                    </select>
                    <p className="text-sm text-gray-400 mt-2">
                      Adjust scan depth based on your needs and time constraints.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-400">Enable dark theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-save Results</p>
                        <p className="text-sm text-gray-400">Automatically save scan results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-gray-400">Show scan completion notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Export Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Default Export Format</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option>JSON</option>
                        <option>CSV</option>
                        <option>PDF</option>
                        <option>XML</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Export Directory</label>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="/home/user/osint-results"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r-lg border border-l-0 border-gray-600">
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-800">
                  <div>
                    <p className="font-medium text-red-400">Clear All Data</p>
                    <p className="text-sm text-gray-400">This will permanently delete all scan history and results</p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
                    Clear Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>OSINT Recon Tool v2.0 | For educational purposes only</p>
          <p className="mt-2 text-sm">Always comply with applicable laws and ethical guidelines when conducting OSINT research</p>
        </div>
      </footer>
    </div>
  );
};

export default App;