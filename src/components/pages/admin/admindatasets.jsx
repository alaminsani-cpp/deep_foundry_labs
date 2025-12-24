// components/pages/admin/admindatasets.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authcontext.jsx';
import useFirebaseData from '../../extra/usefb.js';
import { firebaseService } from '../../extra/fb.js';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  Save, 
  X, 
  Database, 
  Download,
  Filter,
  Search,
  Calendar,
  Tag,
  Globe,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  HardDrive,
  BarChart3,
  Hash,
  ExternalLink,
  FileDown
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDatasets = () => {
  const { adminName, adminEmail, adminPhoto } = useAuth();
  const { data: datasets, loading, error, addItem, updateItem, deleteItem } = useFirebaseData('/datasets');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newDataset, setNewDataset] = useState({
    name: '',
    description: '',
    category: 'NLP',
    language: 'Bangla',
    license: 'CC BY-NC 4.0',
    size: '',
    tags: [],
    team: [],
    stats: {
      annotations: 0,
      samples: 0,
      size: '0MB'
    },
    links: {
      download: '',
      huggingface: '',
      paper: ''
    }
  });
  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get unique categories for filter
  const categories = ['all', ...new Set(datasets.map(d => d.category))];

  // Filter and sort datasets
  const filteredDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dataset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dataset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || dataset.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'name') {
        return a.name?.localeCompare(b.name);
      }
      if (sortBy === 'samples') {
        return (b.stats?.samples || 0) - (a.stats?.samples || 0);
      }
      if (sortBy === 'size') {
        const sizeA = parseSize(a.stats?.size || '0MB');
        const sizeB = parseSize(b.stats?.size || '0MB');
        return sizeB - sizeA;
      }
      return 0;
    });

  // Parse size string to MB
  const parseSize = (sizeStr) => {
    const match = sizeStr.match(/(\d+(\.\d+)?)\s*(MB|GB|KB|B)/i);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const unit = match[3].toUpperCase();
    
    switch(unit) {
      case 'GB': return num * 1024;
      case 'MB': return num;
      case 'KB': return num / 1024;
      case 'B': return num / (1024 * 1024);
      default: return num;
    }
  };

  // Format size for display
  const formatSize = (sizeStr) => {
    const sizeMB = parseSize(sizeStr);
    if (sizeMB >= 1024) {
      return `${(sizeMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeMB.toFixed(1)} MB`;
  };

  // Log action to Firebase
  const logAction = async (action, datasetName, datasetId = null) => {
    const logEntry = {
      action,
      adminName,
      adminEmail,
      adminPhoto,
      datasetName,
      datasetId,
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

  // Handle add dataset
  const handleAddDataset = async () => {
    try {
      const datasetWithMeta = {
        ...newDataset,
        createdAt: new Date().toISOString(),
        date: new Date().getFullYear().toString()
      };

      const result = await addItem(datasetWithMeta);
      await logAction('CREATE_DATASET', newDataset.name, result?.key);
      
      toast.success(`Dataset "${newDataset.name}" created successfully!`);
      setIsAdding(false);
      resetNewDataset();
    } catch (error) {
      toast.error('Failed to create dataset');
      console.error(error);
    }
  };

  // Handle update dataset
  const handleUpdateDataset = async (id) => {
    try {
      await updateItem(id, newDataset);
      await logAction('UPDATE_DATASET', newDataset.name, id);
      
      toast.success(`Dataset "${newDataset.name}" updated successfully!`);
      setEditingId(null);
      resetNewDataset();
    } catch (error) {
      toast.error('Failed to update dataset');
      console.error(error);
    }
  };

  // Handle delete dataset
  const handleDeleteDataset = async (id, name) => {
    try {
      await deleteItem(id);
      await logAction('DELETE_DATASET', name, id);
      
      toast.success(`Dataset "${name}" deleted successfully!`);
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete dataset');
      console.error(error);
    }
  };

  // Handle export datasets
  const handleExport = () => {
    try {
      const exportData = filteredDatasets.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        category: dataset.category,
        language: dataset.language,
        license: dataset.license,
        tags: dataset.tags || [],
        team: dataset.team || [],
        stats: dataset.stats || {},
        links: dataset.links || {},
        createdAt: dataset.createdAt,
        date: dataset.date
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `datasets-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success(`Exported ${exportData.length} dataset${exportData.length !== 1 ? 's' : ''} successfully!`);
    } catch (error) {
      toast.error('Failed to export datasets');
      console.error(error);
    }
  };

  // Start editing a dataset
  const startEditing = (dataset) => {
    setEditingId(dataset.id);
    setNewDataset({
      name: dataset.name || '',
      description: dataset.description || '',
      category: dataset.category || 'NLP',
      language: dataset.language || 'Bangla',
      license: dataset.license || 'CC BY-NC 4.0',
      size: dataset.size || '',
      tags: dataset.tags || [],
      team: dataset.team || [],
      stats: dataset.stats || { annotations: 0, samples: 0, size: '0MB' },
      links: dataset.links || { download: '', huggingface: '', paper: '' }
    });
  };

  // Reset new dataset form
  const resetNewDataset = () => {
    setNewDataset({
      name: '',
      description: '',
      category: 'NLP',
      language: 'Bangla',
      license: 'CC BY-NC 4.0',
      size: '',
      tags: [],
      team: [],
      stats: {
        annotations: 0,
        samples: 0,
        size: '0MB'
      },
      links: {
        download: '',
        huggingface: '',
        paper: ''
      }
    });
    setNewTag('');
    setNewTeamMember('');
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !newDataset.tags.includes(newTag.trim())) {
      setNewDataset({
        ...newDataset,
        tags: [...newDataset.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setNewDataset({
      ...newDataset,
      tags: newDataset.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'NLP': 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30',
      'Healthcare': 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30',
      'Multimodal': 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30',
      'Speech': 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30',
      'Computer Vision': 'from-rose-900/30 to-rose-600/20 text-rose-400 border-rose-700/30',
      'Audio': 'from-indigo-900/30 to-indigo-600/20 text-indigo-400 border-indigo-700/30'
    };
    return colors[category] || 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
  };

  // Get license badge
  const getLicenseBadge = (license) => {
    const badges = {
      'CC BY-NC 4.0': 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 text-yellow-400 border-yellow-700/30',
      'Apache 2.0': 'bg-gradient-to-r from-red-900/30 to-red-800/20 text-red-400 border-red-700/30',
      'MIT': 'bg-gradient-to-r from-green-900/30 to-green-800/20 text-green-400 border-green-700/30',
      'Restricted': 'bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 border-gray-700',
      'CC BY-SA 4.0': 'bg-gradient-to-r from-orange-900/30 to-orange-800/20 text-orange-400 border-orange-700/30',
      'CC BY 4.0': 'bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 text-cyan-400 border-cyan-700/30'
    };
    return badges[license] || 'bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 border-gray-700';
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
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Datasets</h3>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Datasets Management</h1>
          <p className="text-gray-400 mt-1">
            {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} • Manage your research datasets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Dataset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <FileDown className="h-4 w-4" />
            Export ({filteredDatasets.length})
          </button>
        </div>
      </div>

      {/* Search and Filter Bar - Fixed Design */}
      <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/20 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search datasets by name, description, or tags..."
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="createdAt" className="bg-gray-900 text-white">Newest First</option>
              <option value="name" className="bg-gray-900 text-white">Name A-Z</option>
              <option value="samples" className="bg-gray-900 text-white">Most Samples</option>
              <option value="size" className="bg-gray-900 text-white">Largest Size</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal - Refined Design */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Dataset' : 'Add New Dataset'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {editingId ? 'Update the dataset information' : 'Create a new dataset entry'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewDataset();
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
                  <Database className="h-5 w-5 text-cyan-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Dataset Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDataset.name}
                      onChange={(e) => setNewDataset({...newDataset, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter dataset name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newDataset.category}
                        onChange={(e) => setNewDataset({...newDataset, category: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="NLP">NLP</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Multimodal">Multimodal</option>
                        <option value="Speech">Speech</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="Audio">Audio</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Language</label>
                    <input
                      type="text"
                      value={newDataset.language}
                      onChange={(e) => setNewDataset({...newDataset, language: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., Bangla, English"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">License</label>
                    <div className="relative">
                      <select
                        value={newDataset.license}
                        onChange={(e) => setNewDataset({...newDataset, license: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="CC BY-NC 4.0">CC BY-NC 4.0</option>
                        <option value="Apache 2.0">Apache 2.0</option>
                        <option value="MIT">MIT</option>
                        <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                        <option value="CC BY 4.0">CC BY 4.0</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe the dataset, its purpose, and contents..."
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  Statistics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Samples</label>
                    <input
                      type="number"
                      value={newDataset.stats.samples}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        stats: {...newDataset.stats, samples: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Annotations</label>
                    <input
                      type="number"
                      value={newDataset.stats.annotations}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        stats: {...newDataset.stats, annotations: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Size</label>
                    <input
                      type="text"
                      value={newDataset.stats.size}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        stats: {...newDataset.stats, size: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., 850MB, 1.2GB"
                    />
                  </div>
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
                    placeholder="Add a tag (press Enter)"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newDataset.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <Hash className="h-3.5 w-3.5 text-gray-400" />
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
                    <label className="block text-gray-300 mb-2">Download URL</label>
                    <input
                      type="url"
                      value={newDataset.links.download}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        links: {...newDataset.links, download: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">HuggingFace URL</label>
                    <input
                      type="url"
                      value={newDataset.links.huggingface}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        links: {...newDataset.links, huggingface: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://huggingface.co/datasets/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Paper URL</label>
                    <input
                      type="url"
                      value={newDataset.links.paper}
                      onChange={(e) => setNewDataset({
                        ...newDataset,
                        links: {...newDataset.links, paper: e.target.value}
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
                    resetNewDataset();
                  }}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingId ? handleUpdateDataset(editingId) : handleAddDataset()}
                  disabled={!newDataset.name || !newDataset.description}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Dataset' : 'Create Dataset'}
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
                Are you sure you want to delete the dataset "{confirmDelete.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDataset(confirmDelete.id, confirmDelete.name)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200"
                >
                  Delete Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Datasets Grid - 3 items per row */}
      {filteredDatasets.length === 0 ? (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No datasets found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first dataset'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Your First Dataset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="group bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-blue-800/10">
                      <Database className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{dataset.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(dataset.category)} font-medium`}>
                      {dataset.category}
                    </span>
                    <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getLicenseBadge(dataset.license)} font-medium`}>
                      {dataset.license}
                    </span>
                    {dataset.language && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-700 font-medium">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {dataset.language}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => startEditing(dataset)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: dataset.id, name: dataset.name })}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-5 line-clamp-3">
                {dataset.description}
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-3 bg-gradient-to-b from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700">
                  <div className="text-lg font-bold text-cyan-400">{dataset.stats?.samples?.toLocaleString() || '0'}</div>
                  <div className="text-xs text-gray-400">Samples</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700">
                  <div className="text-lg font-bold text-emerald-400">{dataset.stats?.annotations?.toLocaleString() || '0'}</div>
                  <div className="text-xs text-gray-400">Annotations</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700">
                  <div className="text-lg font-bold text-purple-400">{formatSize(dataset.stats?.size || '0MB')}</div>
                  <div className="text-xs text-gray-400">Size</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {dataset.tags?.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-400 border border-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
                {dataset.tags?.length > 3 && (
                  <span className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-500 border border-gray-700">
                    +{dataset.tags.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(dataset.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {dataset.team?.length || 0} members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDatasets;