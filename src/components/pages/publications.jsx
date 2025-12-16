import React, { useState } from "react";
import { FileText, ExternalLink, Code, AlertCircle, Loader, Search } from "lucide-react";
import useFirebaseData from '../extra/usefb.js';

// Fallback data in case Firebase is not available
const fallbackPapers = [
  {
    id: "fallback-1",
    title: "MaskNet: Context-Aware Transformer for Crime Event Detection in Bangla",
    authors: "Rahman, A., Sani, A., et al.",
    venue: "IEEE Access, 2024",
    abstract: "Introduces a multimodal Transformer architecture combining attention masking and text-image fusion for event detection in low-resource languages.",
    tags: ["Transformer", "Crime Detection", "Bangla", "Multimodal"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
  {
    id: "fallback-2",
    title: "GraphSent: Aspect-Based Sentiment Graph Neural Network for Finance Text",
    authors: "Sani, A., Hasan, T., et al.",
    venue: "Elsevier Expert Systems with Applications, 2023",
    abstract: "Presents a heterogeneous GNN integrating sentiment lexicons and aspect embeddings to improve F1 scores on financial news datasets.",
    tags: ["Graph Neural Networks", "Sentiment Analysis", "Finance", "NLP"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
  {
    id: "fallback-3",
    title: "MemeCLIP: Vision-Language Model for Harmful Content Detection",
    authors: "Chowdhury, N., Sani, A., et al.",
    venue: "ACM Multimedia Asia, 2023",
    abstract: "Proposes a lightweight CLIP-based meme classification model for detecting misinformation and hate speech with vision-text alignment.",
    tags: ["Computer Vision", "NLP", "Safety", "Multimodal"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
  {
    id: "fallback-4",
    title: "BanglaDocQA: Low-Resource Question Answering Dataset for Government Documents",
    authors: "Khan, R., Sani, A., et al.",
    venue: "arXiv Preprint, 2025",
    abstract: "Creates a domain-specific QA dataset for Bangla documents and benchmarks existing transformer models for retrieval-based QA.",
    tags: ["Question Answering", "Dataset", "Bangla", "RAG"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
  {
    id: "fallback-5",
    title: "BanglaBERT v2: Enhanced Pre-training for Bangla Language Understanding",
    authors: "Sani, A., Rahman, A., et al.",
    venue: "EMNLP Findings, 2024",
    abstract: "Introduces an improved BanglaBERT model with better tokenization and larger corpus coverage for various downstream tasks.",
    tags: ["Language Model", "BERT", "Bangla", "Pre-training"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
  {
    id: "fallback-6",
    title: "Multimodal Sentiment Analysis for Low-Resource Social Media",
    authors: "Hasan, T., Chowdhury, N., et al.",
    venue: "ACM Transactions on Asian Language Processing, 2023",
    abstract: "Presents a framework for analyzing sentiment in multimodal content from social media platforms in low-resource settings.",
    tags: ["Sentiment Analysis", "Multimodal", "Social Media", "Low-Resource"],
    links: {
      paper: "#",
      code: "#",
      huggingface: "#"
    },
  },
];

// HuggingFace Logo Component
const HuggingFaceLogo = ({ className = "h-4 w-4" }) => (
  <img
    src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
    alt="Hugging Face"
    className={className}
  />
);

const Publications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch publications from Firebase
  const { data: firebasePapers, loading, error } = useFirebaseData('publications', fallbackPapers);
  
  // Use Firebase data if available, otherwise use fallback
  const papers = firebasePapers && firebasePapers.length > 0 ? firebasePapers : fallbackPapers;

  // Filter papers based on search query
  const filteredPapers = papers.filter(paper => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      paper.title?.toLowerCase().includes(query) ||
      paper.authors?.toLowerCase().includes(query) ||
      paper.venue?.toLowerCase().includes(query) ||
      paper.abstract?.toLowerCase().includes(query) ||
      paper.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading publications from Firebase...</p>
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
      {!error && firebasePapers && firebasePapers.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/80 border border-green-700 rounded-lg p-4 max-w-md shadow-lg">
          <div className="flex items-start gap-3">
            <Loader className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-white">Live Data from Firebase</p>
              <p className="text-xs text-gray-300 mt-1">
                Showing real-time publications from the database.
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">
            Publications
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            Research That Pushes Boundaries
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Peer-reviewed research, datasets, and open-source contributions that advance AI in Bangla and low-resource settings.
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
                  placeholder="Search publications by title, authors, venue, abstract, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-800/50 text-white placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Search Tips */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span className="font-medium">Try searching for:</span>
                <button 
                  onClick={() => setSearchQuery('Transformer')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  Transformer
                </button>
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
                  onClick={() => setSearchQuery('IEEE')}
                  className="px-2 py-1 bg-gray-800/50 rounded hover:bg-gray-700/50 transition hover:text-white"
                >
                  IEEE
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
                Showing {filteredPapers.length} of {papers.length} {papers.length === 1 ? 'publication' : 'publications'}
                {searchQuery && (
                  <span className="ml-2">
                    matching "<span className="text-cyan-300">{searchQuery}</span>"
                  </span>
                )}
                {!error && firebasePapers && firebasePapers.length > 0 && (
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

      {/* Publications Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No publications found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No publications match "<span className="text-cyan-300">{searchQuery}</span>". 
              Try different keywords or clear the search.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPapers.map((paper, idx) => (
              <div
                key={paper.id || idx}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-cyan-800/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-cyan-400 font-medium text-sm">
                    <FileText className="h-4 w-4" />
                    {paper.venue || 'Research Publication'}
                  </div>
                  <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-cyan-400 transition-colors mb-2">
                    {paper.title || 'Untitled Publication'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {paper.authors || 'Authors not specified'}
                  </p>
                  
                  {/* Tags */}
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 mb-4">
                      {paper.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs border border-gray-700 hover:border-cyan-600/50 hover:text-cyan-300 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 mb-6">
                    {paper.abstract || 'No abstract available.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {paper.links?.paper && (
                    <a
                      href={paper.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="Read Paper"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Paper</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {paper.links?.code && (
                    <a
                      href={paper.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="View Code"
                    >
                      <Code className="h-4 w-4" />
                      <span className="hidden sm:inline">Code</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {paper.links?.huggingface && (
                    <a
                      href={paper.links.huggingface}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                      title="HuggingFace"
                    >
                      <HuggingFaceLogo className="h-4 w-4 text-[#FFD21E]" />
                      <span className="hidden sm:inline">HuggingFace</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {!paper.links?.paper && !paper.links?.code && !paper.links?.huggingface && (
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
              <div className="p-3 rounded-xl bg-[#FFD21E]/10 border border-[#FFD21E]/30">
                <HuggingFaceLogo className="h-8 w-8 text-[#FFD21E]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-white">
                Find Our Models on HuggingFace
              </h2>
            </div>
            <p className="text-gray-300 mb-8">
              All our models, datasets, and demos are available on HuggingFace Hub for easy access and collaboration.
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
              Visit Our HuggingFace Hub
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <button className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition">
              Contact Us
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{papers.length} Publications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <span>Open Source Code</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFD21E]"></div>
              <span>HuggingFace Integration</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Publications;