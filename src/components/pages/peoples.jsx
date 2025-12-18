import React, { useState } from 'react';
import { Linkedin, Github, Mail, ExternalLink, Award, BookOpen, Users, MapPin, AlertCircle, Loader, Grid, List } from 'lucide-react';
import useFirebaseData from '../extra/usefb.js';

// Fallback data in case Firebase is not available
const fallbackTeam = [
  {
    id: "fallback-1",
    name: "Ahmed Sani",
    title: "Lead AI Researcher",
    role: "Core Team",
    bio: "Researcher focusing on NLP, multimodal learning, and low-resource language AI with publications in IEEE and ACM venues.",
    location: "Dhaka, Bangladesh",
    expertise: ["NLP", "Transformer", "Multimodal AI", "Bangla NLP"],
    stats: {
      publications: 15,
      projects: 9,
      citations: 320
    },
    links: {
      linkedin: "#",
      github: "#",
      email: "ahmed@deepfoundrylabs.com",
      website: "#"
    }
  },
  {
    id: "fallback-2",
    name: "Nadia Rahman",
    title: "Computer Vision Engineer",
    role: "Researchers",
    bio: "Specializes in computer vision, medical imaging, and multimodal fusion for healthcare applications.",
    location: "Dhaka, Bangladesh",
    expertise: ["Computer Vision", "Medical AI", "Deep Learning", "PyTorch"],
    stats: {
      publications: 8,
      projects: 6,
      citations: 145
    },
    links: {
      linkedin: "#",
      github: "#",
      email: "nadia@deepfoundrylabs.com"
    }
  },
  {
    id: "fallback-3",
    name: "Tariq Hasan",
    title: "ML Engineer",
    role: "Engineers",
    bio: "Builds scalable machine learning pipelines and deploys AI models to production environments.",
    location: "Remote",
    expertise: ["MLOps", "Cloud", "Docker", "Kubernetes", "TensorFlow"],
    stats: {
      publications: 5,
      projects: 12,
      citations: 89
    },
    links: {
      linkedin: "#",
      github: "#",
      email: "tariq@deepfoundrylabs.com"
    }
  },
  {
    id: "fallback-4",
    name: "Rina Chowdhury",
    title: "NLP Researcher",
    role: "Researchers",
    bio: "Works on Bangla language models, sentiment analysis, and low-resource NLP techniques.",
    location: "Chittagong, Bangladesh",
    expertise: ["NLP", "Sentiment Analysis", "Bangla", "BERT"],
    stats: {
      publications: 7,
      projects: 5,
      citations: 112
    },
    links: {
      linkedin: "#",
      github: "#",
      email: "rina@deepfoundrylabs.com"
    }
  },
  {
    id: "fallback-5",
    name: "Dr. Kazi Ahmed",
    title: "Academic Advisor",
    role: "Advisors",
    bio: "Professor of Computer Science with expertise in AI ethics, responsible AI, and machine learning theory.",
    location: "University of Dhaka",
    expertise: ["AI Ethics", "Theory", "Research Methodology", "Publications"],
    stats: {
      publications: 42,
      projects: 18,
      citations: 2100
    },
    links: {
      linkedin: "#",
      email: "kazi@university.edu",
      website: "#"
    }
  },
  {
    id: "fallback-6",
    name: "Samia Khan",
    title: "Data Scientist",
    role: "Contributors",
    bio: "Contributes to dataset creation, annotation pipelines, and data quality assurance for AI projects.",
    location: "Remote",
    expertise: ["Data Science", "Annotation", "Quality Assurance", "Python"],
    stats: {
      publications: 3,
      projects: 7,
      citations: 45
    },
    links: {
      linkedin: "#",
      github: "#",
      email: "samia@deepfoundrylabs.com"
    }
  }
];

// Static roles for filtering
const roles = ['All', 'Core Team', 'Researchers', 'Engineers', 'Contributors', 'Advisors'];

const People = () => {
  const [selectedRole, setSelectedRole] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch team data from Firebase
  const { data: firebaseTeam, loading, error } = useFirebaseData('team', fallbackTeam);
  
  // Use Firebase data if available, otherwise use fallback
  const team = firebaseTeam && firebaseTeam.length > 0 ? firebaseTeam : fallbackTeam;

  const filteredTeam = team.filter(member => 
    selectedRole === 'All' || member.role === selectedRole
  );

  const getInitials = (name) => {
    if (!name) return 'DF';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    if (!role) return 'bg-gray-800/30 text-gray-400 border border-gray-700';
    
    switch (role) {
      case 'Core Team': return 'bg-cyan-900/30 text-cyan-400 border border-cyan-700';
      case 'Researchers': return 'bg-purple-900/30 text-purple-400 border border-purple-700';
      case 'Engineers': return 'bg-blue-900/30 text-blue-400 border border-blue-700';
      case 'Contributors': return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'Advisors': return 'bg-amber-900/30 text-amber-400 border border-amber-700';
      default: return 'bg-gray-800/30 text-gray-400 border border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading team data from Firebase...</p>
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

      {/* Header Section */}
      <section className="py-12">
        <div className="text-center">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Team</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">Our Team</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            A diverse group of researchers, engineers, and contributors building open AI for Bangla and beyond.
          </p>
        </div>
      </section>

      {/* Filter and View Toggle Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
            <div className="space-y-6">
              {/* Filter and View Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Filter by Role</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition shadow-sm ${
                          selectedRole === role
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                        }`}
                      >
                        {role}
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
                Showing {filteredTeam.length} {filteredTeam.length === 1 ? 'member' : 'members'}
                <span className="ml-2">• {viewMode === 'grid' ? 'Grid' : 'List'} View</span>
                {!error && firebaseTeam && firebaseTeam.length > 0 && (
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

      {/* Team Grid/List */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        {filteredTeam.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No team members found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No team members found in the "{selectedRole}" category.
              Try selecting a different role or "All".
            </p>
            <button
              onClick={() => setSelectedRole('All')}
              className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Show All Members
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeam.map((member) => (
              <div
                key={member.id || member.name}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold mb-4 group-hover:scale-105 transition-transform">
                    {getInitials(member.name)}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">{member.name || 'Team Member'}</h3>
                  <p className="text-sm text-gray-400 mb-2">{member.title || 'AI Professional'}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role || 'Team Member'}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
                  <MapPin className="h-3 w-3" />
                  {member.location || 'Location not specified'}
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-300 text-center mb-4 line-clamp-3">
                  {member.bio || 'No bio available.'}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-4 pb-4 border-b border-gray-700">
                  {(member.expertise || []).map((skill, index) => (
                    <span key={`${skill}-${index}`} className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-xs border border-gray-700">
                      {skill}
                    </span>
                  ))}
                  {(!member.expertise || member.expertise.length === 0) && (
                    <span className="px-2 py-1 bg-gray-800/30 text-gray-400 rounded-lg text-xs border border-gray-700 italic">
                      AI & Research
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="h-3 w-3 text-gray-500" />
                    </div>
                    <div className="text-lg font-medium text-white">
                      {member.stats?.publications || 0}
                    </div>
                    <div className="text-xs text-gray-400">Papers</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="h-3 w-3 text-gray-500" />
                    </div>
                    <div className="text-lg font-medium text-white">
                      {member.stats?.projects || 0}
                    </div>
                    <div className="text-xs text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                    </div>
                    <div className="text-lg font-medium text-white">
                      {member.stats?.citations || 0}
                    </div>
                    <div className="text-xs text-gray-400">Citations</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                  {member.links?.linkedin && (
                    <a 
                      href={member.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400 transition-colors" 
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.links?.github && (
                    <a 
                      href={member.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400 transition-colors" 
                      aria-label="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {member.links?.email && (
                    <a 
                      href={`mailto:${member.links.email}`} 
                      className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400 transition-colors" 
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.links?.website && (
                    <a 
                      href={member.links.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400 transition-colors" 
                      aria-label="Website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {(!member.links?.linkedin && !member.links?.github && !member.links?.email && !member.links?.website) && (
                    <span className="text-xs text-gray-500">Contact info not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {filteredTeam.map((member) => (
              <div
                key={member.id || member.name}
                className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side: Avatar and basic info */}
                  <div className="lg:w-1/4 flex flex-col items-center lg:items-start">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold mb-4 group-hover:scale-105 transition-transform">
                      {getInitials(member.name)}
                    </div>
                    
                    <div className="text-center lg:text-left">
                      <h3 className="text-xl font-medium text-white mb-1">{member.name || 'Team Member'}</h3>
                      <p className="text-sm text-gray-400 mb-2">{member.title || 'AI Professional'}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role || 'Team Member'}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
                      <MapPin className="h-3 w-3" />
                      {member.location || 'Location not specified'}
                    </div>
                  </div>

                  {/* Middle: Bio, expertise, and stats */}
                  <div className="lg:w-1/2 lg:border-l lg:border-gray-700 lg:pl-6">
                    {/* Bio */}
                    <p className="text-sm text-gray-300 mb-4">
                      {member.bio || 'No bio available.'}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(member.expertise || []).map((skill, index) => (
                        <span key={`${skill}-${index}`} className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-xs border border-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen className="h-3 w-3 text-gray-500" />
                        </div>
                        <div className="text-lg font-medium text-white">
                          {member.stats?.publications || 0}
                        </div>
                        <div className="text-xs text-gray-400">Papers</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Award className="h-3 w-3 text-gray-500" />
                        </div>
                        <div className="text-lg font-medium text-white">
                          {member.stats?.projects || 0}
                        </div>
                        <div className="text-xs text-gray-400">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <ExternalLink className="h-3 w-3 text-gray-500" />
                        </div>
                        <div className="text-lg font-medium text-white">
                          {member.stats?.citations || 0}
                        </div>
                        <div className="text-xs text-gray-400">Citations</div>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Social links */}
                  <div className="lg:w-1/4 lg:border-l lg:border-gray-700 lg:pl-6">
                    <div className="flex flex-col gap-3 h-full justify-center">
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {member.links?.linkedin && (
                          <a 
                            href={member.links.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        )}
                        {member.links?.github && (
                          <a 
                            href={member.links.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                            aria-label="GitHub"
                          >
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {member.links?.email && (
                          <a 
                            href={`mailto:${member.links.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                            aria-label="Email"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </a>
                        )}
                        {member.links?.website && (
                          <a 
                            href={member.links.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700/50 hover:border-cyan-500 transition-all text-gray-300 hover:text-white group/link"
                            aria-label="Website"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Website</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </div>

                      {(!member.links?.linkedin && !member.links?.github && !member.links?.email && !member.links?.website) && (
                        <div className="text-center py-4">
                          <span className="text-sm text-gray-500 italic">Contact info not available</span>
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

      {/* Join Team CTA */}
      <section className="py-16 bg-gradient-to-br from-cyan-900/30 to-sky-900/30 rounded-3xl border border-cyan-800/30 mx-6 mb-6">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">Join Our Team</h2>
          <p className="text-gray-300 mb-8">
            We're always looking for passionate researchers, engineers, and contributors to join our mission of building open AI for low-resource languages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
              View Open Positions
            </button>
            <button className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
              Become a Contributor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default People; 