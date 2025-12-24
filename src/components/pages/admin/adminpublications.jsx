// components/pages/admin/adminpublications.jsx
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
  FileText,
  Filter,
  Search,
  Calendar,
  Tag,
  Users,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Award,
  Hash,
  Globe,
  ChevronDown,
  FileDown,
  Eye
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPublications = () => {
  const { adminName, adminEmail, adminPhoto } = useAuth();
  const { data: publications, loading, error, addItem, updateItem, deleteItem } = useFirebaseData('/publications');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newPublication, setNewPublication] = useState({
    title: '',
    abstract: '',
    authors: '',
    venue: '',
    year: new Date().getFullYear(),
    tags: [],
    links: {
      paper: '',
      code: '',
      huggingface: ''
    }
  });
  const [newTag, setNewTag] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get unique years for filter
  const years = ['all', ...new Set(publications.map(p => p.year))].sort((a, b) => b - a);

  // Filter and sort publications
  const filteredPublications = publications
    .filter(pub => {
      const matchesSearch = pub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesYear = filterYear === 'all' || pub.year?.toString() === filterYear;
      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'year') {
        return b.year - a.year;
      }
      if (sortBy === 'title') {
        return a.title?.localeCompare(b.title);
      }
      return 0;
    });

  // Log action to Firebase
  const logAction = async (action, publicationTitle, publicationId = null) => {
    const logEntry = {
      action,
      adminName,
      adminEmail,
      adminPhoto,
      publicationTitle,
      publicationId,
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

  // Handle add publication
  const handleAddPublication = async () => {
    try {
      const publicationWithMeta = {
        ...newPublication,
        createdAt: new Date().toISOString(),
        tags: newPublication.tags,
        links: newPublication.links
      };

      const result = await addItem(publicationWithMeta);
      await logAction('CREATE_PUBLICATION', newPublication.title, result?.key);
      
      toast.success(`Publication "${newPublication.title}" added successfully!`);
      setIsAdding(false);
      resetNewPublication();
    } catch (error) {
      toast.error('Failed to add publication');
      console.error(error);
    }
  };

  // Handle update publication
  const handleUpdatePublication = async (id) => {
    try {
      await updateItem(id, newPublication);
      await logAction('UPDATE_PUBLICATION', newPublication.title, id);
      
      toast.success(`Publication "${newPublication.title}" updated successfully!`);
      setEditingId(null);
      resetNewPublication();
    } catch (error) {
      toast.error('Failed to update publication');
      console.error(error);
    }
  };

  // Handle delete publication
  const handleDeletePublication = async (id, title) => {
    try {
      await deleteItem(id);
      await logAction('DELETE_PUBLICATION', title, id);
      
      toast.success(`Publication "${title}" deleted successfully!`);
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete publication');
      console.error(error);
    }
  };

  // Handle export publications
  const handleExport = () => {
    try {
      const exportData = filteredPublications.map(pub => ({
        id: pub.id,
        title: pub.title,
        abstract: pub.abstract,
        authors: pub.authors,
        venue: pub.venue,
        year: pub.year,
        tags: pub.tags || [],
        links: pub.links || {},
        createdAt: pub.createdAt
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `publications-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success(`Exported ${exportData.length} publication${exportData.length !== 1 ? 's' : ''} successfully!`);
    } catch (error) {
      toast.error('Failed to export publications');
      console.error(error);
    }
  };

  // Start editing a publication
  const startEditing = (pub) => {
    setEditingId(pub.id);
    setNewPublication({
      title: pub.title || '',
      abstract: pub.abstract || '',
      authors: pub.authors || '',
      venue: pub.venue || '',
      year: pub.year || new Date().getFullYear(),
      tags: pub.tags || [],
      links: pub.links || { paper: '', code: '', huggingface: '' }
    });
  };

  // Reset new publication form
  const resetNewPublication = () => {
    setNewPublication({
      title: '',
      abstract: '',
      authors: '',
      venue: '',
      year: new Date().getFullYear(),
      tags: [],
      links: {
        paper: '',
        code: '',
        huggingface: ''
      }
    });
    setNewTag('');
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !newPublication.tags.includes(newTag.trim())) {
      setNewPublication({
        ...newPublication,
        tags: [...newPublication.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setNewPublication({
      ...newPublication,
      tags: newPublication.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Format authors (shorten if too long)
  const formatAuthors = (authors) => {
    if (!authors) return '';
    if (authors.length > 40) {
      return authors.substring(0, 40) + '...';
    }
    return authors;
  };

  // Get venue badge color
  const getVenueColor = (venue) => {
    if (!venue) return 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
    
    const venueLower = venue.toLowerCase();
    if (venueLower.includes('arxiv')) return 'from-orange-900/30 to-orange-600/20 text-orange-400 border-orange-700/30';
    if (venueLower.includes('emnlp') || venueLower.includes('acl')) return 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30';
    if (venueLower.includes('ieee')) return 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30';
    if (venueLower.includes('acm')) return 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30';
    if (venueLower.includes('springer') || venueLower.includes('elsevier')) return 'from-red-900/30 to-red-600/20 text-red-400 border-red-700/30';
    if (venueLower.includes('neurips')) return 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30';
    return 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
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
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Publications</h3>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Publications Management</h1>
          <p className="text-gray-400 mt-1">
            {publications.length} publication{publications.length !== 1 ? 's' : ''} • Manage research papers and publications
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Publication
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <FileDown className="h-4 w-4" />
            Export ({filteredPublications.length})
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
                placeholder="Search publications by title, abstract, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="all" className="bg-gray-900 text-white">All Years</option>
              {years.filter(year => year !== 'all').map(year => (
                <option key={year} value={year} className="bg-gray-900 text-white">
                  {year}
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
              <option value="year" className="bg-gray-900 text-white">Year (Latest)</option>
              <option value="title" className="bg-gray-900 text-white">Title A-Z</option>
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
                    {editingId ? 'Edit Publication' : 'Add New Publication'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {editingId ? 'Update the publication information' : 'Add a new research paper'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewPublication();
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
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Publication Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPublication.title}
                      onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., BanglaBERT v2: Enhanced Pre-training for Bangla Language Understanding"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">
                      Authors <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPublication.authors}
                      onChange={(e) => setNewPublication({...newPublication, authors: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., Sani, A., Rahman, A., et al."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Venue <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPublication.venue}
                      onChange={(e) => setNewPublication({...newPublication, venue: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., EMNLP Findings, 2024"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Year <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPublication.year}
                      onChange={(e) => setNewPublication({...newPublication, year: parseInt(e.target.value) || new Date().getFullYear()})}
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Abstract <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newPublication.abstract}
                    onChange={(e) => setNewPublication({...newPublication, abstract: e.target.value})}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter the paper abstract..."
                  />
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
                    placeholder="Add a tag (e.g., Language Model, BERT)"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPublication.tags.map((tag, index) => (
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

              {/* Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-amber-400" />
                  Links & Resources
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Paper URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={newPublication.links.paper}
                      onChange={(e) => setNewPublication({
                        ...newPublication,
                        links: {...newPublication.links, paper: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://arxiv.org/abs/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Code Repository</label>
                    <input
                      type="url"
                      value={newPublication.links.code}
                      onChange={(e) => setNewPublication({
                        ...newPublication,
                        links: {...newPublication.links, code: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">HuggingFace Model</label>
                    <input
                      type="url"
                      value={newPublication.links.huggingface}
                      onChange={(e) => setNewPublication({
                        ...newPublication,
                        links: {...newPublication.links, huggingface: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://huggingface.co/..."
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
                    resetNewPublication();
                  }}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingId ? handleUpdatePublication(editingId) : handleAddPublication()}
                  disabled={!newPublication.title || !newPublication.authors || !newPublication.venue || !newPublication.abstract || !newPublication.links.paper}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Publication' : 'Add Publication'}
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
                Are you sure you want to delete the publication "{confirmDelete.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePublication(confirmDelete.id, confirmDelete.title)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200"
                >
                  Delete Publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publications Grid - 3 items per row */}
      {filteredPublications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No publications found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterYear !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first publication'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Your First Publication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((pub) => (
            <div
              key={pub.id}
              className="group bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-blue-800/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">{pub.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getVenueColor(pub.venue)} font-medium`}>
                          {pub.venue}
                        </span>
                        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-700 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {pub.year}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>Authors:</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {formatAuthors(pub.authors)}
                    </p>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-5 line-clamp-3">
                    {pub.abstract}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pub.tags?.slice(0, 4).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-400 border border-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                    {pub.tags?.length > 4 && (
                      <span className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-500 border border-gray-700">
                        +{pub.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => startEditing(pub)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: pub.id, title: pub.title })}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Links */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                {pub.links?.paper && (
                  <a
                    href={pub.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-900/30 to-blue-800/20 hover:from-blue-900/40 hover:to-blue-800/30 rounded-lg text-xs text-blue-300 transition-all duration-200 border border-blue-700/30"
                  >
                    <BookOpen className="h-3 w-3" />
                    Read Paper
                  </a>
                )}
                {pub.links?.code && (
                  <a
                    href={pub.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-xs text-gray-300 transition-all duration-200 border border-gray-700"
                  >
                    <Hash className="h-3 w-3" />
                    View Code
                  </a>
                )}
                {pub.links?.huggingface && (
                  <a
                    href={pub.links.huggingface}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 hover:from-yellow-900/40 hover:to-yellow-800/30 rounded-lg text-xs text-yellow-300 transition-all duration-200 border border-yellow-700/30"
                  >
                    <Award className="h-3 w-3" />
                    HuggingFace
                  </a>
                )}
                {pub.createdAt && (
                  <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Added {new Date(pub.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPublications;