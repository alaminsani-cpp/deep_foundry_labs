import React, { useState } from "react";
import { Cpu, Database, ExternalLink, Download, Sparkles, Search, Filter, AlertCircle, Loader } from "lucide-react";
import useFirebaseData from "../extra/usefb";

// HuggingFace Logo Component
const HuggingFaceLogo = ({ className = "h-4 w-4" }) => (
  <img
    src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
    alt="Hugging Face"
    className={className}
  />
);

// Fallback data in case Firebase is not available
const fallbackModels = [
  {
    id: "fallback-1",
    name: "BanglaBERT v2",
    type: "Language Model",
    description: "A transformer-based masked language model pre-trained on 50GB of Bangla text including Common Crawl, news, and Wikipedia.",
    metrics: ["85.6% F1 (NER)", "92.3% Accuracy (Sentiment)"],
    size: "355M parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/BanglaBERT-v2",
      paper: "#",
    },
  },
  {
    id: "fallback-2",
    name: "MaskNet",
    type: "Transformer",
    description: "Context-aware Transformer for multimodal crime event detection with attention masking and text-image fusion.",
    metrics: ["97.69% Accuracy", "Real-time processing"],
    size: "185M parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/MaskNet",
      paper: "#",
    },
  },
  {
    id: "fallback-3",
    name: "GraphSent",
    type: "Graph Neural Network",
    description: "Aspect-based sentiment graph neural network for financial text analysis with heterogeneous graph architecture.",
    metrics: ["Improved macro-F1", "Aspect-aware attention"],
    size: "128M parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/GraphSent",
      paper: "#",
    },
  },
  {
    id: "fallback-4",
    name: "MemeCLIP",
    type: "Multimodal Model",
    description: "Vision-language model for harmful content detection in memes with OCR and CLIP-style embeddings.",
    metrics: ["Robust safety detection", "Multimodal fusion"],
    size: "420M parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/MemeCLIP",
      paper: "#",
    },
  },
  {
    id: "fallback-5",
    name: "BanglaDocQA",
    type: "Question Answering",
    description: "Retrieval-augmented generation model for Bangla document question answering with domain adaptation.",
    metrics: ["78.4% EM score", "RAG architecture"],
    size: "775M parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/BanglaDocQA",
      paper: "#",
    },
  },
  {
    id: "fallback-6",
    name: "BanglaSpeechTTS",
    type: "Speech",
    description: "Text-to-speech model for Bangla with multiple accents and dialects from different regions of Bangladesh.",
    metrics: ["4.2 MOS score", "Multi-accent support"],
    size: "1.2B parameters",
    links: {
      hf: "https://huggingface.co/DeepFoundryLabs/BanglaSpeechTTS",
      paper: "#",
    },
  }
];

const Models = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Language Model', 'Multimodal Model', 'Graph Neural Network', 'Question Answering', 'Computer Vision', 'Speech', 'Transformer'];
  
  // Fetch models from Firebase
  const { data: firebaseModels, loading, error } = useFirebaseData('models', fallbackModels);
  
  // Use Firebase data if available, otherwise use fallback
  const models = firebaseModels && firebaseModels.length > 0 ? firebaseModels : fallbackModels;

  // Filter models based on search and category
  const filteredModels = models.filter(model => {
    const matchesCategory = selectedCategory === 'All' || model.type === selectedCategory;
    
    if (!searchQuery) return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    return matchesCategory && (
      model.name?.toLowerCase().includes(query) ||
      model.description?.toLowerCase().includes(query) ||
      model.type?.toLowerCase().includes(query) ||
      (model.metrics && model.metrics.some(metric => metric.toLowerCase().includes(query)))
    );
  });

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading models from Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Show warning if using fallback data */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-900/80 border border-yellow-700 rounded-lg p-4 max-w-md shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Using Local Data</p>
              <p className="text-xs text-gray-300 mt-1">
                Could not connect to Firebase. Using fallback data. Check your internet connection and Firebase rules.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show info if using Firebase data
      {!error && firebaseModels && firebaseModels.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/80 border border-green-700 rounded-lg p-4 max-w-md shadow-lg">
          <div className="flex items-start gap-3">
            <Loader className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-white">Live Data from Firebase</p>
              <p className="text-xs text-gray-300 mt-1">
                Showing real-time models from the database.
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Header Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">
            Models
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            Open & Reproducible AI for Bangla
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Foundation and fine-tuned models for low-resource NLP, vision-language tasks,
            and domain-specific R&D — built for transparency and impact.
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
                  placeholder="Search models by name, description, type, or metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800/50 text-white placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
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
                  onClick={() => setSearchQuery('Transformer')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Transformer
                </button>
                <button 
                  onClick={() => setSearchQuery('Speech')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Speech
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
                Showing {filteredModels.length} of {models.length} {models.length === 1 ? 'model' : 'models'}
                {searchQuery && (
                  <span className="ml-2">
                    matching "<span className="text-cyan-300">{searchQuery}</span>"
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="ml-2">in <span className="text-cyan-300">{selectedCategory}</span></span>
                )}
                {!error && firebaseModels && firebaseModels.length > 0 && (
                  <span className="text-green-400 ml-2">• Live</span>
                )}
                {error && (
                  <span className="text-yellow-400 ml-2">• Offline</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        {filteredModels.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Cpu className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No models found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchQuery ? `No models match "${searchQuery}".` : 'No models available in this category.'}
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
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, idx) => (
              <div
                key={model.id || idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-cyan-800/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-cyan-400 font-medium text-sm">
                    <Cpu className="h-4 w-4" />
                    {model.type || 'AI Model'}
                  </div>
                  <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-cyan-400 transition-colors">
                    {model.name || 'Untitled Model'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">{model.size || 'Size not specified'}</p>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed line-clamp-4">
                    {model.description || 'No description available.'}
                  </p>

                  {/* Metrics */}
                  {model.metrics && model.metrics.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm">
                      {model.metrics.map((metric, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <Sparkles className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {model.links?.hf && (
                    <a
                      href={model.links.hf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="HuggingFace"
                    >
                      <HuggingFaceLogo className="h-4 w-4" />
                      <span className="hidden sm:inline">HuggingFace</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {model.links?.paper && (
                    <a
                      href={model.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="Read Paper"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Paper</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {!model.links?.hf && !model.links?.paper && (
                    <span className="text-sm text-gray-500 italic">Links coming soon</span>
                  )}
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
                <Cpu className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="p-3 rounded-xl bg-[#FFD21E]/10 border border-[#FFD21E]/30">
                <HuggingFaceLogo className="h-8 w-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-white">
                All Models Available on HuggingFace
              </h2>
            </div>
            <p className="text-gray-300 mb-8">
              Our models are hosted on HuggingFace Hub for easy access, inference, and fine-tuning.
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
              Browse All Models
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <button className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition">
              Request Custom Model
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                {models.length}+
              </div>
              <div className="text-gray-400">Open Models</div>
            </div>
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                {new Set(models.map(m => m.type)).size}
              </div>
              <div className="text-gray-400">Model Types</div>
            </div>
            <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <div className="text-lg font-medium text-white mb-1">
                All
              </div>
              <div className="text-gray-400">Open Source</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Models;