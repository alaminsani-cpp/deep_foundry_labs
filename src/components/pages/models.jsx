import React, { useState } from "react";
import { Cpu, Database, ExternalLink, Download, Sparkles, Search, Filter } from "lucide-react";
import useFirebaseData from "../extra/usefb";

const Models = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Language Model', 'Multimodal Model', 'Graph Neural Network', 'Question Answering', 'Computer Vision', 'Speech'];
  
  // Fetch models from Firebase
  const { data: firebaseModels, loading, error } = useFirebaseData('models', []);
  
  // Use Firebase data if available, otherwise use fallback
  const models = firebaseModels.length > 0 ? firebaseModels : [
    // Fallback data (same as before)
    {
      name: "BanglaBERT v2",
      type: "Language Model",
      description: "A transformer-based masked language model pre-trained on 50GB of Bangla text including Common Crawl, news, and Wikipedia.",
      metrics: ["85.6% F1 (NER)", "92.3% Accuracy (Sentiment)"],
      size: "355M parameters",
      links: {
        hf: "#",
        paper: "#",
      },
    },
    // ... rest of fallback data
  ];

  const filteredModels = models.filter(model => {
    const matchesCategory = selectedCategory === 'All' || model.type === selectedCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading models: {error.message}</p>
          <p className="text-sm mt-2">Using fallback data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Rest of the component remains the same */}
      <section className="py-16 md:py-24 text-center">
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
        <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search models by name, description, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800/50 text-white placeholder-gray-400 shadow-sm"
              />
            </div>

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
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
              Showing {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'}
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        {filteredModels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No models found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model, idx) => (
              <div
                key={model.id || idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-cyan-400 font-medium text-sm">
                    <Cpu className="h-4 w-4" />
                    {model.type}
                  </div>
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {model.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">{model.size}</p>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    {model.description}
                  </p>

                  <ul className="mt-4 space-y-1 text-sm text-gray-300">
                    {model.metrics && model.metrics.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cyan-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {model.links?.hf && (
                    <a
                      href={model.links.hf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 transition text-gray-300 hover:text-white"
                    >
                      Hugging Face <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {model.links?.paper && (
                    <a
                      href={model.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 transition text-gray-300 hover:text-white"
                    >
                      Read Paper <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center bg-gray-800/30 border-t border-gray-700 mt-12">
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
          Want to Use or Fine-Tune Our Models?
        </h2>
        <p className="text-gray-300 mb-6">
          We provide API access, evaluation harnesses, and collaboration for academic or
          industry use.
        </p>
        <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center gap-2 mx-auto">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default Models;