import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Github, BookOpen, Calendar, Tag, Users } from 'lucide-react';
import { projects } from '../../content/projects';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'NLP', 'Computer Vision', 'Multimodal', 'Graph AI', 'Healthcare', 'Safety'];

  
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Production': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Active Development': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Pilot Phase': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Released': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="font-[Manrope] font-medium text-slate-800">
      {/* Header Section */}
      <section className="py-12 border-b border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">Research Projects</h1>
          <p className="mt-4 text-lg text-slate-700 max-w-3xl mx-auto">
            Cutting-edge AI research projects spanning NLP, computer vision, multimodal learning, and graph AI with focus on Bangla and low-resource languages.
          </p>
        </div>
      </section>

     {/* Search and Filter Section */}
      <section className="py-8 px-6">
        <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
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
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 pt-2 border-t border-gray-300">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-cyan-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{project.publication}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Highlights:</h4>
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-cyan-600 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Team */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {project.team.join(', ')}
                  </span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={project.links.paper}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    Paper
                  </a>
                  <a
                    href={project.links.github}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                  <a
                    href={project.links.demo}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
            Want to Collaborate on Research?
          </h2>
          <p className="text-gray-600 mb-8">
            We're always open to research partnerships, joint publications, and collaborative projects. Let's push the boundaries of AI together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Propose a Project
            </button>
            <button className="px-6 py-3 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              View Publications
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;