// components/pages/admin/adminprojects.jsx
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
  FolderKanban,
  Filter,
  Search,
  Calendar,
  Tag,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Rocket,
  Target,
  BarChart3,
  GitBranch,
  Globe,
  Shield,
  Clock,
  ChevronDown,
  FileDown,
  ExternalLink,
  Hash,
  Eye
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProjects = () => {
  const { adminName, adminEmail, adminPhoto } = useAuth();
  const { data: projects, loading, error, addItem, updateItem, deleteItem } = useFirebaseData('/projects');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'NLP',
    status: 'Active Development',
    publication: '',
    highlights: [],
    tags: [],
    team: [],
    links: {
      demo: '',
      github: '',
      paper: ''
    }
  });
  const [newHighlight, setNewHighlight] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get unique categories and statuses for filter
  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const statuses = ['all', 'Active Development', 'Published', 'Pilot Phase', 'Released', 'In Production', 'Under Review'];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'title') {
        return a.title?.localeCompare(b.title);
      }
      if (sortBy === 'date') {
        return b.date?.localeCompare(a.date);
      }
      return 0;
    });

  // Log action to Firebase
  const logAction = async (action, projectTitle, projectId = null) => {
    const logEntry = {
      action,
      adminName,
      adminEmail,
      adminPhoto,
      projectTitle,
      projectId,
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

  // Handle add project
  const handleAddProject = async () => {
    try {
      const projectWithMeta = {
        ...newProject,
        createdAt: new Date().toISOString(),
        date: new Date().getFullYear().toString()
      };

      const result = await addItem(projectWithMeta);
      await logAction('CREATE_PROJECT', newProject.title, result?.key);
      
      toast.success(`Project "${newProject.title}" created successfully!`);
      setIsAdding(false);
      resetNewProject();
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    }
  };

  // Handle update project
  const handleUpdateProject = async (id) => {
    try {
      await updateItem(id, newProject);
      await logAction('UPDATE_PROJECT', newProject.title, id);
      
      toast.success(`Project "${newProject.title}" updated successfully!`);
      setEditingId(null);
      resetNewProject();
    } catch (error) {
      toast.error('Failed to update project');
      console.error(error);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (id, title) => {
    try {
      await deleteItem(id);
      await logAction('DELETE_PROJECT', title, id);
      
      toast.success(`Project "${title}" deleted successfully!`);
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  // Handle export projects
  const handleExport = () => {
    try {
      const exportData = filteredProjects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        publication: project.publication || '',
        highlights: project.highlights || [],
        tags: project.tags || [],
        team: project.team || [],
        links: project.links || {},
        createdAt: project.createdAt,
        date: project.date
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `projects-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success(`Exported ${exportData.length} project${exportData.length !== 1 ? 's' : ''} successfully!`);
    } catch (error) {
      toast.error('Failed to export projects');
      console.error(error);
    }
  };

  // Start editing a project
  const startEditing = (project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'NLP',
      status: project.status || 'Active Development',
      publication: project.publication || '',
      highlights: project.highlights || [],
      tags: project.tags || [],
      team: project.team || [],
      links: project.links || { demo: '', github: '', paper: '' }
    });
  };

  // Reset new project form
  const resetNewProject = () => {
    setNewProject({
      title: '',
      description: '',
      category: 'NLP',
      status: 'Active Development',
      publication: '',
      highlights: [],
      tags: [],
      team: [],
      links: {
        demo: '',
        github: '',
        paper: ''
      }
    });
    setNewHighlight('');
    setNewTag('');
    setNewTeamMember('');
  };

  // Add highlight
  const addHighlight = () => {
    if (newHighlight.trim() && !newProject.highlights.includes(newHighlight.trim())) {
      setNewProject({
        ...newProject,
        highlights: [...newProject.highlights, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  // Remove highlight
  const removeHighlight = (highlightToRemove) => {
    setNewProject({
      ...newProject,
      highlights: newProject.highlights.filter(highlight => highlight !== highlightToRemove)
    });
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Add team member
  const addTeamMember = () => {
    if (newTeamMember.trim() && !newProject.team.includes(newTeamMember.trim())) {
      setNewProject({
        ...newProject,
        team: [...newProject.team, newTeamMember.trim()]
      });
      setNewTeamMember('');
    }
  };

  // Remove team member
  const removeTeamMember = (memberToRemove) => {
    setNewProject({
      ...newProject,
      team: newProject.team.filter(member => member !== memberToRemove)
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'NLP': 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30',
      'Safety': 'from-red-900/30 to-red-600/20 text-red-400 border-red-700/30',
      'Graph AI': 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30',
      'Healthcare': 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30',
      'Multimodal': 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30',
      'Computer Vision': 'from-rose-900/30 to-rose-600/20 text-rose-400 border-rose-700/30',
      'Speech': 'from-indigo-900/30 to-indigo-600/20 text-indigo-400 border-indigo-700/30'
    };
    return colors[category] || 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Active Development': 'from-cyan-900/30 to-cyan-600/20 text-cyan-400 border-cyan-700/30',
      'Published': 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30',
      'Pilot Phase': 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30',
      'Released': 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30',
      'In Production': 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30',
      'Under Review': 'from-orange-900/30 to-orange-600/20 text-orange-400 border-orange-700/30'
    };
    return badges[status] || 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Active Development': Clock,
      'Published': CheckCircle,
      'Pilot Phase': Rocket,
      'Released': Globe,
      'In Production': Shield,
      'Under Review': AlertTriangle
    };
    return icons[status] || Clock;
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
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Projects</h3>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Projects Management</h1>
          <p className="text-gray-400 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} • Manage your research projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <FileDown className="h-4 w-4" />
            Export ({filteredProjects.length})
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
                placeholder="Search projects by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="all" className="bg-gray-900 text-white">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(cat => (
                <option key={cat} value={cat} className="bg-gray-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Target className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="all" className="bg-gray-900 text-white">All Status</option>
              {statuses.filter(status => status !== 'all').map(status => (
                <option key={status} value={status} className="bg-gray-900 text-white">
                  {status}
                </option>
              ))}
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
                    {editingId ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {editingId ? 'Update the project information' : 'Create a new research project'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewProject();
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
                  <FolderKanban className="h-5 w-5 text-cyan-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., BanglaDocQA: Low-Resource QA System"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="NLP">NLP</option>
                        <option value="Safety">Safety</option>
                        <option value="Graph AI">Graph AI</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Multimodal">Multimodal</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="Speech">Speech</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Status <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newProject.status}
                        onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="Active Development">Active Development</option>
                        <option value="Published">Published</option>
                        <option value="Pilot Phase">Pilot Phase</option>
                        <option value="Released">Released</option>
                        <option value="In Production">In Production</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Publication Info</label>
                    <input
                      type="text"
                      value={newProject.publication}
                      onChange={(e) => setNewProject({...newProject, publication: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., IEEE Access, 2024"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe the project objectives, methodology, and outcomes..."
                  />
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  Key Highlights
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add a highlight (e.g., 97.69% accuracy)"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{highlight}</span>
                      <button
                        onClick={() => removeHighlight(highlight)}
                        className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-400" />
                  Tags
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add a tag (e.g., Transformer, Bangla)"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  Team Members
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add team member (e.g., John Doe)"
                  />
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.team.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{member}</span>
                      <button
                        onClick={() => removeTeamMember(member)}
                        className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-400" />
                  Links & Resources
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Demo URL</label>
                    <input
                      type="url"
                      value={newProject.links.demo}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        links: {...newProject.links, demo: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://huggingface.co/spaces/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">GitHub Repository</label>
                    <input
                      type="url"
                      value={newProject.links.github}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        links: {...newProject.links, github: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Paper URL</label>
                    <input
                      type="url"
                      value={newProject.links.paper}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        links: {...newProject.links, paper: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://arxiv.org/abs/..."
                    />
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
                    resetNewProject();
                  }}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingId ? handleUpdateProject(editingId) : handleAddProject()}
                  disabled={!newProject.title || !newProject.description}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Project' : 'Create Project'}
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
                <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the project "{confirmDelete.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(confirmDelete.id, confirmDelete.title)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first project'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = getStatusIcon(project.status);
            return (
              <div
                key={project.id}
                className="group bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-900/30 to-cyan-800/10">
                        <FolderKanban className="h-5 w-5 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} font-medium`}>
                        {project.category}
                      </span>
                      <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusBadge(project.status)} font-medium`}>
                        <div className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {project.status}
                        </div>
                      </span>
                      {project.publication && (
                        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-700 font-medium">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {project.publication}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => startEditing(project)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ id: project.id, title: project.title })}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-5 line-clamp-3">
                  {project.description}
                </p>
                
                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <BarChart3 className="h-3 w-3" />
                      <span>Key Highlights:</span>
                    </div>
                    <ul className="space-y-1">
                      {project.highlights.slice(0, 2).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-400 border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 4 && (
                    <span className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-500 border border-gray-700">
                      +{project.tags.length - 4} more
                    </span>
                  )}
                </div>
                
                {/* Links and Info */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.links?.demo && project.links.demo !== '#' && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 hover:from-cyan-900/40 hover:to-cyan-800/30 rounded-lg text-xs text-cyan-300 transition-all duration-200 border border-cyan-700/30"
                      >
                        <Eye className="h-3 w-3" />
                        Demo
                      </a>
                    )}
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-xs text-gray-300 transition-all duration-200 border border-gray-700"
                      >
                        <GitBranch className="h-3 w-3" />
                        Code
                      </a>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {project.team?.length || 0} members
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;