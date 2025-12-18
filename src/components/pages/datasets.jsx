import React, { useState, useEffect } from 'react'; 
import { Database, Download, ExternalLink, Calendar, Tag, Users, Search, Filter, AlertCircle, Loader, Grid, List } from 'lucide-react'; 
import useFirebaseData from '../extra/usefb.js';

// HuggingFace Logo Component 
const HuggingFaceLogo = ({ className = "h-4 w-4" }) => ( 
  <img 
    src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" 
    alt="Hugging Face" 
    className={className} 
  /> 
);

// Fallback data 
const fallbackDatasets = [ 
  // ... (fallback data remains the same) 
];

const Datasets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [processedDatasets, setProcessedDatasets] = useState([]);
  const [usingFirebase, setUsingFirebase] = useState(false);

  const categories = ['All', 'NLP', 'Multimodal', 'Speech', 'Healthcare', 'Finance', 'Legal'];
  
  // Fetch datasets from Firebase
  const { data: firebaseData, loading, error } = useFirebaseData('datasets', fallbackDatasets);
  
  // Process Firebase data when it loads
  useEffect(() => {
    if (firebaseData && firebaseData.length > 0) {
      // Check if this is Firebase data (has different structure) or fallback
      const isFirebaseData = firebaseData.some(item => item.id && item.id.includes('fallback')) ? false : true;
      setUsingFirebase(isFirebaseData);
      
      // Transform Firebase data to match expected structure
      const transformedData = firebaseData.map((item, index) => {
        // If it's already in the correct format (from fallback), return as-is
        if (item.id && item.id.includes('fallback')) {
          return item;
        }
        
        // Transform Firebase document structure
        return {
          id: item.id || `dataset-${index}`,
          name: item.name || item.title || 'Untitled Dataset',
          category: item.category || item.type || 'NLP',
          description: item.description || 'No description available.',
          size: item.size || 'Size not specified',
          language: item.language || 'Bangla',
          license: item.license || 'CC BY 4.0',
          date: item.date || item.year || '2024',
          tags: Array.isArray(item.tags) ? item.tags : 
                (item.keywords ? item.keywords.split(',').map(k => k.trim()) : ['AI Research']),
          stats: {
            samples: item.stats?.samples || item.samples || 0,
            annotations: item.stats?.annotations || item.annotations || 0,
            size: item.stats?.size || item.fileSize || 'N/A'
          },
          links: {
            paper: item.links?.paper || item.paperLink || '#',
            download: item.links?.download || item.downloadLink || '#',
            huggingface: item.links?.huggingface || item.hfLink || '#'
          },
          team: Array.isArray(item.team) ? item.team : 
                (item.authors ? item.authors.split(',').map(a => a.trim()) : ['Research Team'])
        };
      });
      
      setProcessedDatasets(transformedData);
    } else {
      // Use fallback data
      setProcessedDatasets(fallbackDatasets);
      setUsingFirebase(false);
    }
  }, [firebaseData]);

  // Filter datasets based on search and category
  const filteredDatasets = processedDatasets.filter(dataset => {
    const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
    
    if (!searchQuery) return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    return matchesCategory && (
      dataset.name?.toLowerCase().includes(query) ||
      dataset.description?.toLowerCase().includes(query) ||
      (dataset.tags && dataset.tags.some(tag => tag.toLowerCase().includes(query))) ||
      dataset.language?.toLowerCase().includes(query) ||
      dataset.category?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading datasets from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Show status notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-900/80 border border-yellow-700 rounded-lg p-4 max-w-md shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Using Local Data</p>
              <p className="text-xs text-gray-300 mt-1">
                {error.message || 'Could not connect to Firebase. Using fallback data.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!error && !usingFirebase && firebaseData && firebaseData.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-blue-900/80 border border-blue-700 rounded-lg p-4 max-w-md shadow-lg">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Using Fallback Data</p>
              <p className="text-xs text-gray-300 mt-1">
                Firebase collection is empty. Using built-in dataset examples.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Datasets</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            Open Datasets for Bangla AI Research
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            High-quality, curated datasets for NLP, speech, multimodal AI, and domain-specific research in Bangla and low-resource languages.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets by name, description, tags, or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800/50 text-white placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Category Filter and View Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filter by Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition shadow-sm ${
                          selectedCategory === category
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-sm text-gray-300 hidden sm:block">View:</span>
                  <div className="flex bg-gray-800/50 border border-gray-600 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 rounded-lg transition ${
                        viewMode === 'grid'
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 rounded-lg transition ${
                        viewMode === 'list'
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Tips */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span className="font-medium">Quick search:</span>
                <button 
                  onClick={() => setSearchQuery('Bangla')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Bangla
                </button>
                <button 
                  onClick={() => setSearchQuery('NLP')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  NLP
                </button>
                <button 
                  onClick={() => setSearchQuery('Speech')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Speech
                </button>
                <button 
                  onClick={() => setSearchQuery('Healthcare')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Healthcare
                </button>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white ml-2"
                >
                  Clear All
                </button>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
                Showing {filteredDatasets.length} of {processedDatasets.length} {processedDatasets.length === 1 ? 'dataset' : 'datasets'}
                {searchQuery && (
                  <span className="ml-2">
                    matching "<span className="text-cyan-300">{searchQuery}</span>"
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="ml-2">in <span className="text-cyan-300">{selectedCategory}</span></span>
                )}
                <span className="ml-2">• {viewMode === 'grid' ? 'Grid' : 'List'} View</span>
                {usingFirebase && (
                  <span className="text-green-400 ml-2">• Live</span>
                )}
                {!usingFirebase && !error && (
                  <span className="text-blue-400 ml-2">• Local Data</span>
                )}
                {error && (
                  <span className="text-yellow-400 ml-2">• Offline Mode</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Datasets Grid/List */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        {filteredDatasets.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Database className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No datasets found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchQuery ? `No datasets match "${searchQuery}".` : 'No datasets available in this category.'}
              Try different keywords or clear the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDatasets.map((dataset, idx) => (
              <div
                key={dataset.id || idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-cyan-800/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-400 border border-cyan-700">
                        {dataset.category || 'Dataset'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dataset.date || '2024'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {dataset.name || 'Untitled Dataset'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {dataset.size || 'Size not specified'}
                    </p>
                  </div>
                </div>

                {/* Language and License */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">
                    {dataset.language || 'Bangla'}
                  </span>
                  <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">
                    {dataset.license || 'Open License'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {dataset.description || 'No description available.'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(dataset.tags || []).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-cyan-800/50 hover:border-cyan-600/50 hover:text-cyan-300 transition-colors"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {(!dataset.tags || dataset.tags.length === 0) && (
                    <span className="px-2 py-1 bg-gray-800/30 text-gray-400 rounded-lg text-xs font-medium border border-gray-700">
                      AI Research
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      {dataset.stats?.samples ? dataset.stats.samples.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">Samples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      {dataset.stats?.annotations ? dataset.stats.annotations.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">Annotations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">
                      {dataset.stats?.size || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">Size</div>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {(dataset.team || []).join(', ') || 'Research Team'}
                  </span>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {dataset.links?.paper && dataset.links.paper !== '#' && (
                    <a
                      href={dataset.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="Read Paper"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Paper</span>
                    </a>
                  )}
                  {dataset.links?.download && dataset.links.download !== '#' && (
                    <a
                      href={dataset.links.download}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="Download Dataset"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}
                  {dataset.links?.huggingface && dataset.links.huggingface !== '#' && (
                    <a
                      href={dataset.links.huggingface}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="HuggingFace"
                    >
                      <HuggingFaceLogo className="h-4 w-4" />
                      <span className="hidden sm:inline">HuggingFace</span>
                    </a>
                  )}
                  {(!dataset.links?.paper || dataset.links.paper === '#') && 
                   (!dataset.links?.download || dataset.links.download === '#') && 
                   (!dataset.links?.huggingface || dataset.links.huggingface === '#') && (
                    <span className="text-sm text-gray-500 italic">Links coming soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {filteredDatasets.map((dataset, idx) => (
              <div
                key={dataset.id || idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-cyan-800/50"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side: Basic info */}
                  <div className="lg:w-2/3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-400 border border-cyan-700">
                            {dataset.category || 'Dataset'}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {dataset.date || '2024'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {dataset.name || 'Untitled Dataset'}
                        </h3>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">
                            {dataset.language || 'Bangla'}
                          </span>
                          <span className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">
                            {dataset.license || 'Open License'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {dataset.size || 'Size not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4">
                      {dataset.description || 'No description available.'}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(dataset.tags || []).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-cyan-800/50 hover:border-cyan-600/50 hover:text-cyan-300 transition-colors"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Team */}
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {(dataset.team || []).join(', ') || 'Research Team'}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Stats and Links */}
                  <div className="lg:w-1/3 lg:border-l lg:border-gray-700 lg:pl-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-medium text-white">
                          {dataset.stats?.samples ? dataset.stats.samples.toLocaleString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Samples</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium text-white">
                          {dataset.stats?.annotations ? dataset.stats.annotations.toLocaleString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Annotations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium text-white">
                          {dataset.stats?.size || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Size</div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                      {dataset.links?.paper && dataset.links.paper !== '#' && (
                        <a
                          href={dataset.links.paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                          title="Read Paper"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Paper</span>
                        </a>
                      )}
                      {dataset.links?.download && dataset.links.download !== '#' && (
                        <a
                          href={dataset.links.download}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                          title="Download Dataset"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                      )}
                      {dataset.links?.huggingface && dataset.links.huggingface !== '#' && (
                        <a
                          href={dataset.links.huggingface}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                          title="HuggingFace"
                        >
                          <HuggingFaceLogo className="h-4 w-4" />
                          <span>HuggingFace</span>
                        </a>
                      )}
                      {(!dataset.links?.paper || dataset.links.paper === '#') && 
                       (!dataset.links?.download || dataset.links.download === '#') && 
                       (!dataset.links?.huggingface || dataset.links.huggingface === '#') && (
                        <span className="text-sm text-gray-500 italic">Links coming soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center bg-gradient-to-br from-cyan-900/30 to-sky-900/30 rounded-3xl border border-cyan-800/30 mx-6 mb-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                <Database className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="p-3 rounded-xl bg-[#FFD21E]/10 border border-[#FFD21E]/30">
                <HuggingFaceLogo className="h-8 w-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-white">
                All Datasets Available on HuggingFace
              </h2>
            </div>
            <p className="text-gray-300 mb-8">
              Our datasets are hosted on HuggingFace Hub for easy access, versioning, and community collaboration.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://huggingface.co/DeepFoundryLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#FFD21E] text-gray-900 font-medium rounded-lg hover:bg-[#FFD21E]/90 transition-all group shadow-lg hover:shadow-xl"
            >
              <HuggingFaceLogo className="h-5 w-5" />
              Browse All Datasets
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <button className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition">
              Request Custom Dataset
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                {processedDatasets.length}+
              </div>
              <div className="text-gray-400">Curated Datasets</div>
            </div>
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                {processedDatasets.reduce((total, ds) => total + (ds.stats?.samples || 0), 0).toLocaleString()}+
              </div>
              <div className="text-gray-400">Total Samples</div>
            </div>
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                {new Set(processedDatasets.map(ds => ds.category)).size}
              </div>
              <div className="text-gray-400">Categories</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datasets;