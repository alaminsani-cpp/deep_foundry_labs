import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Github, BookOpen, Calendar, Tag, Users, AlertCircle, Loader, Grid, List } from 'lucide-react';
import useFirebaseData from '../extra/usefb.js';


// Fallback data in case Firebase is not available
const fallbackProjects = [
  {
    id: "fallback-1",
    title: "MaskNet: Crime Event Detection",
    category: "NLP",
    description: "Dynamic attention + feature masking in Transformer models for real-world analytics.",
    status: "Published",
    date: "2024",
    tags: ["Transformer", "Bangla", "Crime Detection"],
    publication: "IEEE Access, 2024",
    highlights: [
      "97.69% accuracy on Bengali crime dataset",
      "Dynamic attention mechanism",
      "Real-time processing capability"
    ],
    team: ["Rahman, A.", "Sani, A.", "Chowdhury, N."],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  },
  {
    id: "fallback-2",
    title: "Vision-Language Meme Classifier",
    category: "Multimodal",
    description: "OCR + CLIP-style embeddings with safety probes for meme understanding.",
    status: "In Production",
    date: "2023",
    tags: ["Computer Vision", "NLP", "Safety"],
    publication: "ACM Multimedia Asia, 2023",
    highlights: [
      "Robust harmful-content detection",
      "Multimodal fusion techniques",
      "Low-resource language support"
    ],
    team: ["Sani, A.", "Khan, R.", "Hasan, T."],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  },
  {
    id: "fallback-3",
    title: "Graph-based Sentiment Analysis",
    category: "Graph AI",
    description: "Aspect-aware heterogeneous GNN with memory and biaffine attention.",
    status: "Active Development",
    date: "2024",
    tags: ["Graph Neural Networks", "Sentiment", "Finance"],
    publication: "Elsevier Expert Systems, 2023",
    highlights: [
      "Improved macro-F1 vs baselines",
      "Aspect-aware attention mechanism",
      "Financial domain adaptation"
    ],
    team: ["Hasan, T.", "Rahman, A.", "Sani, A."],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  },
  {
    id: "fallback-4",
    title: "BanglaDocQA: Low-Resource QA System",
    category: "NLP",
    description: "Question answering system for Bangla government and financial documents.",
    status: "Pilot Phase",
    date: "2025",
    tags: ["Question Answering", "RAG", "Bangla NLP"],
    publication: "arXiv Preprint, 2025",
    highlights: [
      "78.4% EM score",
      "RAG architecture",
      "Domain-specific training"
    ],
    team: ["Khan, R.", "Chowdhury, N.", "Sani, A."],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  },
  {
    id: "fallback-5",
    title: "Healthcare AI for Low-Resource Settings",
    category: "Healthcare",
    description: "Multimodal diagnostic system combining medical text and imaging.",
    status: "Active Development",
    date: "2024",
    tags: ["Healthcare", "Multimodal", "Medical AI"],
    publication: "Under Review",
    highlights: [
      "Multimodal fusion",
      "Privacy-preserving techniques",
      "Low-resource adaptation"
    ],
    team: ["Sani, A.", "Rahman, A.", "Medical Experts"],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  },
  {
    id: "fallback-6",
    title: "Content Safety Moderation System",
    category: "Safety",
    description: "Real-time content moderation for social media platforms.",
    status: "Released",
    date: "2023",
    tags: ["Safety", "Moderation", "Real-time"],
    publication: "Production System",
    highlights: [
      "Real-time processing",
      "Multilingual support",
      "Low false positive rate"
    ],
    team: ["Team Safety", "Engineering", "Research"],
    links: {
      paper: "#",
      github: "#",
      demo: "#"
    }
  }
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const categories = ['All', 'NLP', 'Computer Vision', 'Multimodal', 'Graph AI', 'Healthcare', 'Safety'];
  
  // Fetch projects from Firebase
  const { data: firebaseProjects, loading, error } = useFirebaseData('projects', fallbackProjects);
  
  // Use Firebase data if available, otherwise use fallback
  const projects = firebaseProjects && firebaseProjects.length > 0 ? firebaseProjects : fallbackProjects;

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-800/30 text-gray-400 border-gray-700';
    
    switch (status) {
      case 'Published': return 'bg-green-900/30 text-green-400 border-green-700';
      case 'In Production': return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'Active Development': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'Pilot Phase': return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'Released': return 'bg-cyan-900/30 text-cyan-400 border-cyan-700';
      default: return 'bg-gray-800/30 text-gray-400 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading projects from Firebase...</p>
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
                Could not connect to database. Using fallback data. Check your internet connection or refresh the page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="py-12">
        <div className="text-center">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Research</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">Research Projects</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Cutting-edge AI research projects spanning NLP, computer vision, multimodal learning, and graph AI with focus on Bangla and low-resource languages.
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
                  placeholder="Search projects by name, description, or tags..."
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
                            : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
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

              {/* Results Count */}
              <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
                Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                <span className="ml-2">• {viewMode === 'grid' ? 'Grid' : 'List'} View</span>
                {!error && firebaseProjects && firebaseProjects.length > 0 && (
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

      {/* Projects Grid/List */}
      <section className="py-12 px-6 pb-16 max-w-6xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
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
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.title}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status || 'Active'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.date || '2024'}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{project.publication || 'Research Project'}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-cyan-800/50"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {(!project.tags || project.tags.length === 0) && (
                    <span className="px-2 py-1 bg-gray-800/30 text-gray-400 rounded-lg text-xs font-medium border border-gray-700">
                      AI Research
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description || 'No description available.'}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Highlights:</h4>
                  <ul className="space-y-1">
                    {(project.highlights || []).map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                    {(!project.highlights || project.highlights.length === 0) && (
                      <li className="text-sm text-gray-400 italic">No highlights available</li>
                    )}
                  </ul>
                </div>

                {/* Team */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {project.team ? project.team.join(', ') : 'Research Team'}
                  </span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  {project.links?.paper && (
                    <a
                      href={project.links.paper}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      Paper
                    </a>
                  )}
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  )}
                  {project.links?.demo && (
                    <a
                      href={project.links.demo}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Hugging Face
                    </a>
                  )}
                  {!project.links?.paper && !project.links?.github && !project.links?.demo && (
                    <span className="text-sm text-gray-500">Links coming soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.title}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side: Project details */}
                  <div className="lg:w-3/4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status || 'Active'}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.date || '2024'}
                          </span>
                        </div>
                        <h3 className="text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{project.publication || 'Research Project'}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.tags || []).map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded-lg text-xs font-medium flex items-center gap-1 border border-cyan-800/50"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4">
                      {project.description || 'No description available.'}
                    </p>

                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white mb-2">Key Highlights:</h4>
                      <ul className="space-y-1">
                        {(project.highlights || []).map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                        {(!project.highlights || project.highlights.length === 0) && (
                          <li className="text-sm text-gray-400 italic">No highlights available</li>
                        )}
                      </ul>
                    </div>

                    {/* Team */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {project.team ? project.team.join(', ') : 'Research Team'}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Links */}
                  <div className="lg:w-1/4 lg:border-l lg:border-gray-700 lg:pl-6">
                    <div className="flex flex-col gap-3 h-full justify-center">
                      {project.links?.paper && (
                        <a
                          href={project.links.paper}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Read Paper</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                        >
                          <Github className="h-4 w-4" />
                          <span>View Code</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {project.links?.demo && (
                        <a
                          href={project.links.demo}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Demo</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {!project.links?.paper && !project.links?.github && !project.links?.demo && (
                        <div className="text-center py-4">
                          <span className="text-sm text-gray-500 italic">Links coming soon</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-900/30 to-sky-900/30 rounded-3xl border border-cyan-800/30 mx-6 mb-6">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Want to Collaborate on Research?
          </h2>
          <p className="text-gray-300 mb-8">
            We're always open to research partnerships, joint publications, and collaborative projects. Let's push the boundaries of AI together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
              Propose a Project
            </button>
            <button className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
              View Publications
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;