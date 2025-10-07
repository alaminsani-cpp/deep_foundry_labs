import React, { useState } from 'react';
import { Linkedin, Github, Mail, ExternalLink, Award, BookOpen, Users, MapPin } from 'lucide-react';
import { team, roles } from '../../content/people';

const People = () => {
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredTeam = team.filter(member => 
    selectedRole === 'All' || member.role === selectedRole
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Core Team': return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
      case 'Researchers': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Engineers': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Contributors': return 'bg-green-100 text-green-700 border border-green-200';
      case 'Advisors': return 'bg-amber-100 text-amber-700 border border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="font-[Manrope] font-medium text-slate-800">
      {/* Header Section */}
      <section className="py-12 border-b border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">Our Team</h1>
          <p className="mt-4 text-lg text-slate-700 max-w-3xl mx-auto">
            A diverse group of researchers, engineers, and contributors building open AI for Bangla and beyond.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-6">
        <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
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
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 pt-2 border-t border-gray-300">
              Showing {filteredTeam.length} {filteredTeam.length === 1 ? 'member' : 'members'}
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold mb-4 group-hover:scale-105 transition-transform">
                  {getInitials(member.name)}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.title}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
                <MapPin className="h-3 w-3" />
                {member.location}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
                {member.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4 pb-4 border-b border-gray-100">
                {member.expertise.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-medium text-gray-900">{member.stats.publications}</div>
                  <div className="text-xs text-gray-500">Papers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-medium text-gray-900">{member.stats.projects}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-medium text-gray-900">{member.stats.citations}</div>
                  <div className="text-xs text-gray-500">Citations</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3">
                <a href={member.links.linkedin} className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-cyan-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={member.links.github} className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-cyan-600 transition-colors" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
                <a href={`mailto:${member.links.email}`} className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-cyan-600 transition-colors" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
                {member.links.website && (
                  <a href={member.links.website} className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-cyan-600 transition-colors" aria-label="Website">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-8">
            We're always looking for passionate researchers, engineers, and contributors to join our mission of building open AI for low-resource languages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              View Open Positions
            </button>
            <button className="px-6 py-3 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              Become a Contributor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default People;