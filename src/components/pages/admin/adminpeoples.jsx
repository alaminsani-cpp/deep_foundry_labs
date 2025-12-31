// components/pages/admin/adminpeoples.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authcontext.jsx';
import useFirebaseData from '../../extra/usefb.js';
import { firebaseService } from '../../extra/fb.js';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Users,
  Filter,
  Search,
  MapPin,
  Linkedin,
  Github,
  Mail,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  User,
  BookOpen,
  Award,
  ChevronDown,
  FileDown,
  Star,
  Calendar,
  Hash,
  Shield,
  Mail as MailIcon
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPeoples = () => {
  const { adminName, adminEmail, adminPhoto } = useAuth();
  const { data: teamMembers, loading, error, addItem, updateItem, deleteItem } = useFirebaseData('/team');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newMember, setNewMember] = useState({
    name: '',
    title: '',
    role: 'Core Team',
    bio: '',
    location: '',
    expertise: [],
    profilePicture: '',
    stats: {
      publications: 0,
      projects: 0,
      citations: 0
    },
    links: {
      linkedin: '',
      github: '',
      email: '',
      website: ''
    }
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get unique roles for filter
  const roles = ['all', ...new Set(teamMembers.map(m => m.role))];

  // Filter and sort team members
  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.expertise?.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'name') {
        return a.name?.localeCompare(b.name);
      }
      if (sortBy === 'role') {
        const roleOrder = { 'Core Team': 0, 'Researchers': 1, 'Engineers': 2, 'Contributors': 3, 'Advisors': 4 };
        return (roleOrder[a.role] || 5) - (roleOrder[b.role] || 5);
      }
      return 0;
    });

  // Log action to Firebase
  const logAction = async (action, memberName, memberId = null) => {
    const logEntry = {
      action,
      adminName,
      adminEmail,
      adminPhoto,
      memberName,
      memberId,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      },
      details: {
        actionType: action,
        ip: 'Fetching...'
      }
    };

    try {
      await firebaseService.pushData('/logs', logEntry);
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  // Handle add team member
  const handleAddMember = async () => {
    try {
      const memberWithMeta = {
        ...newMember,
        createdAt: new Date().toISOString(),
        stats: {
          publications: parseInt(newMember.stats.publications) || 0,
          projects: parseInt(newMember.stats.projects) || 0,
          citations: parseInt(newMember.stats.citations) || 0
        }
      };

      const result = await addItem(memberWithMeta);
      await logAction('CREATE_TEAM_MEMBER', newMember.name, result?.key);
      
      toast.success(`Team member "${newMember.name}" added successfully!`);
      setIsAdding(false);
      resetNewMember();
    } catch (error) {
      toast.error('Failed to add team member');
      console.error(error);
    }
  };

  // Handle update team member
  const handleUpdateMember = async (id) => {
    try {
      await updateItem(id, newMember);
      await logAction('UPDATE_TEAM_MEMBER', newMember.name, id);
      
      toast.success(`Team member "${newMember.name}" updated successfully!`);
      setEditingId(null);
      resetNewMember();
    } catch (error) {
      toast.error('Failed to update team member');
      console.error(error);
    }
  };

  // Handle delete team member
  const handleDeleteMember = async (id, name) => {
    try {
      await deleteItem(id);
      await logAction('DELETE_TEAM_MEMBER', name, id);
      
      toast.success(`Team member "${name}" removed successfully!`);
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete team member');
      console.error(error);
    }
  };

  // Handle export team members
  const handleExport = () => {
    try {
      const exportData = filteredMembers.map(member => ({
        id: member.id,
        name: member.name,
        title: member.title,
        role: member.role,
        bio: member.bio,
        location: member.location,
        expertise: member.expertise || [],
        profilePicture: member.profilePicture || '',
        stats: member.stats || { publications: 0, projects: 0, citations: 0 },
        links: member.links || {},
        createdAt: member.createdAt
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `team-members-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success(`Exported ${exportData.length} team member${exportData.length !== 1 ? 's' : ''} successfully!`);
    } catch (error) {
      toast.error('Failed to export team members');
      console.error(error);
    }
  };

  // Start editing a team member
  const startEditing = (member) => {
    setEditingId(member.id);
    setNewMember({
      name: member.name || '',
      title: member.title || '',
      role: member.role || 'Core Team',
      bio: member.bio || '',
      location: member.location || '',
      expertise: member.expertise || [],
      profilePicture: member.profilePicture || '',
      stats: member.stats || { publications: 0, projects: 0, citations: 0 },
      links: member.links || { linkedin: '', github: '', email: '', website: '' }
    });
  };

  // Reset new member form
  const resetNewMember = () => {
    setNewMember({
      name: '',
      title: '',
      role: 'Core Team',
      bio: '',
      location: '',
      expertise: [],
      profilePicture: '',
      stats: {
        publications: 0,
        projects: 0,
        citations: 0
      },
      links: {
        linkedin: '',
        github: '',
        email: '',
        website: ''
      }
    });
    setNewExpertise('');
  };

  // Add expertise
  const addExpertise = () => {
    if (newExpertise.trim() && !newMember.expertise.includes(newExpertise.trim())) {
      setNewMember({
        ...newMember,
        expertise: [...newMember.expertise, newExpertise.trim()]
      });
      setNewExpertise('');
    }
  };

  // Remove expertise
  const removeExpertise = (expertiseToRemove) => {
    setNewMember({
      ...newMember,
      expertise: newMember.expertise.filter(exp => exp !== expertiseToRemove)
    });
  };

  // Format bio for display (shorten if too long)
  const formatBio = (bio) => {
    if (!bio) return '';
    if (bio.length > 120) {
      return bio.substring(0, 120) + '...';
    }
    return bio;
  };

  // Get role badge color
  const getRoleColor = (role) => {
    if (!role) return 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
    
    const colors = {
      'Core Team': 'from-cyan-900/30 to-cyan-600/20 text-cyan-400 border-cyan-700/30',
      'Researchers': 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30',
      'Engineers': 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30',
      'Contributors': 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30',
      'Advisors': 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30'
    };
    return colors[role] || 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'TM';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle profile picture error
  const handleImageError = (e, member) => {
    e.target.style.display = 'none';
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg font-bold';
    fallbackDiv.textContent = getInitials(member.name);
    e.target.parentElement.appendChild(fallbackDiv);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-700 rounded-xl p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Team Members</h3>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-1">
            {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} • Manage your research team
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <FileDown className="h-4 w-4" />
            Export ({filteredMembers.length})
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/20 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search team members by name, title, bio, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="all" className="bg-gray-900 text-white">All Roles</option>
              {roles.filter(role => role !== 'all').map(role => (
                <option key={role} value={role} className="bg-gray-900 text-white">
                  {role}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="createdAt" className="bg-gray-900 text-white">Newest Added</option>
              <option value="name" className="bg-gray-900 text-white">Name A-Z</option>
              <option value="role" className="bg-gray-900 text-white">Role (Core First)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Team Member' : 'Add New Team Member'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {editingId ? 'Update the team member information' : 'Add a new team member'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewMember();
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-cyan-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., Dr. Ahmed Sani"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMember.title}
                      onChange={(e) => setNewMember({...newMember, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., Lead AI Researcher & Founder"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Role <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="Core Team">Core Team</option>
                        <option value="Researchers">Researchers</option>
                        <option value="Engineers">Engineers</option>
                        <option value="Contributors">Contributors</option>
                        <option value="Advisors">Advisors</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={newMember.location}
                      onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., Dhaka, Bangladesh"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Profile Picture URL</label>
                    <input
                      type="url"
                      value={newMember.profilePicture}
                      onChange={(e) => setNewMember({...newMember, profilePicture: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://example.com/profile.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to use initials-based avatar</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Bio <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newMember.bio}
                    onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe the team member's background, expertise, and contributions..."
                  />
                </div>
              </div>

              {/* Expertise */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Expertise & Skills
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add an expertise (e.g., NLP, Computer Vision)"
                  />
                  <button
                    onClick={addExpertise}
                    className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newMember.expertise.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <Star className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{exp}</span>
                      <button
                        onClick={() => removeExpertise(exp)}
                        className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                  Research Statistics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Publications</label>
                    <input
                      type="number"
                      min="0"
                      value={newMember.stats.publications}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        stats: {...newMember.stats, publications: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Projects</label>
                    <input
                      type="number"
                      min="0"
                      value={newMember.stats.projects}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        stats: {...newMember.stats, projects: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Citations</label>
                    <input
                      type="number"
                      min="0"
                      value={newMember.stats.citations}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        stats: {...newMember.stats, citations: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-400" />
                  Social Links & Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">LinkedIn URL</label>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-400" />
                      <input
                        type="url"
                        value={newMember.links.linkedin}
                        onChange={(e) => setNewMember({
                          ...newMember,
                          links: {...newMember.links, linkedin: e.target.value}
                        })}
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">GitHub URL</label>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-300" />
                      <input
                        type="url"
                        value={newMember.links.github}
                        onChange={(e) => setNewMember({
                          ...newMember,
                          links: {...newMember.links, github: e.target.value}
                        })}
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-cyan-400" />
                      <input
                        type="email"
                        value={newMember.links.email}
                        onChange={(e) => setNewMember({
                          ...newMember,
                          links: {...newMember.links, email: e.target.value}
                        })}
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="name@deepfoundrylabs.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Website URL</label>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-400" />
                      <input
                        type="url"
                        value={newMember.links.website}
                        onChange={(e) => setNewMember({
                          ...newMember,
                          links: {...newMember.links, website: e.target.value}
                        })}
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-950 border-t border-gray-700 p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewMember();
                  }}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingId ? handleUpdateMember(editingId) : handleAddMember()}
                  disabled={!newMember.name || !newMember.title || !newMember.bio || !newMember.links.email}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-red-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Confirm Removal</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove "{confirmDelete.name}" from the team? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMember(confirmDelete.id, confirmDelete.name)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No team members found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterRole !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first team member'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Your First Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden relative">
                    {member.profilePicture ? (
                      <img 
                        src={member.profilePicture} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, member)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{member.title}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEditing(member)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ id: member.id, name: member.name })}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${getRoleColor(member.role)} font-medium`}>
                      {member.role}
                    </span>
                    {member.location && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-700">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {member.location}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {formatBio(member.bio)}
              </p>
              
              {/* Expertise */}
              <div className="flex flex-wrap gap-2 mb-4">
                {member.expertise?.slice(0, 3).map((exp, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-400 border border-gray-700"
                  >
                    {exp}
                  </span>
                ))}
                {member.expertise?.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-500 border border-gray-700">
                    +{member.expertise.length - 3} more
                  </span>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400 mb-1">{member.stats?.publications || 0}</div>
                  <div className="text-xs text-gray-400">Publications</div>
                </div>
                <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-400 mb-1">{member.stats?.projects || 0}</div>
                  <div className="text-xs text-gray-400">Projects</div>
                </div>
                <div className="text-center p-2 bg-gray-900/30 rounded-lg">
                  <div className="text-lg font-bold text-purple-400 mb-1">{member.stats?.citations || 0}</div>
                  <div className="text-xs text-gray-400">Citations</div>
                </div>
              </div>
              
              {/* Links */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                {member.links?.linkedin && (
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-blue-800/10 hover:from-blue-900/30 hover:to-blue-800/20 text-blue-400 hover:text-blue-300 transition-all duration-200 border border-blue-700/20"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                )}
                {member.links?.github && (
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-400 hover:text-white transition-all duration-200 border border-gray-700"
                    title="GitHub"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
                {member.links?.email && (
                  <a
                    href={`mailto:${member.links.email}`}
                    className="p-2 rounded-lg bg-gradient-to-r from-cyan-900/20 to-cyan-800/10 hover:from-cyan-900/30 hover:to-cyan-800/20 text-cyan-400 hover:text-cyan-300 transition-all duration-200 border border-cyan-700/20"
                    title="Email"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                <div className="ml-auto text-xs text-gray-500">
                  {member.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added {new Date(member.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPeoples;