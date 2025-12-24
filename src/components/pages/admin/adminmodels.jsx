// components/pages/admin/adminmodels.jsx
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
  Cpu,
  Filter,
  Search,
  Calendar,
  Tag,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Brain,
  Zap,
  Layers,
  BarChart,
  ChevronDown,
  FileDown,
  ExternalLink,
  Hash
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminModels = () => {
  const { adminName, adminEmail, adminPhoto } = useAuth();
  const { data: models, loading, error, addItem, updateItem, deleteItem } = useFirebaseData('/models');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    type: 'Language Model',
    size: '',
    metrics: [],
    links: {
      github: '',
      hf: '',
      paper: ''
    }
  });
  const [newMetric, setNewMetric] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get unique types for filter
  const modelTypes = ['all', ...new Set(models.map(m => m.type))];

  // Filter and sort models
  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || model.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'name') {
        return a.name?.localeCompare(b.name);
      }
      if (sortBy === 'size') {
        const sizeA = extractParams(a.size) || 0;
        const sizeB = extractParams(b.size) || 0;
        return sizeB - sizeA;
      }
      return 0;
    });

  // Extract parameter count
  const extractParams = (sizeString) => {
    if (!sizeString) return 0;
    const match = sizeString.match(/(\d+(\.\d+)?)([BM])/i);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[3].toUpperCase();
      return unit === 'B' ? num : num * 1000000;
    }
    return 0;
  };

  // Format size for display
  const formatSize = (sizeString) => {
    const params = extractParams(sizeString);
    if (params >= 1000000000) {
      return `${(params / 1000000000).toFixed(1)}B`;
    } else if (params >= 1000000) {
      return `${(params / 1000000).toFixed(1)}M`;
    }
    return sizeString || '0';
  };

  // Log action to Firebase
  const logAction = async (action, modelName, modelId = null) => {
    const logEntry = {
      action,
      adminName,
      adminEmail,
      adminPhoto,
      modelName,
      modelId,
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

  // Handle add model
  const handleAddModel = async () => {
    try {
      const modelWithMeta = {
        ...newModel,
        createdAt: new Date().toISOString()
      };

      const result = await addItem(modelWithMeta);
      await logAction('CREATE_MODEL', newModel.name, result?.key);
      
      toast.success(`Model "${newModel.name}" created successfully!`);
      setIsAdding(false);
      resetNewModel();
    } catch (error) {
      toast.error('Failed to create model');
      console.error(error);
    }
  };

  // Handle update model
  const handleUpdateModel = async (id) => {
    try {
      await updateItem(id, newModel);
      await logAction('UPDATE_MODEL', newModel.name, id);
      
      toast.success(`Model "${newModel.name}" updated successfully!`);
      setEditingId(null);
      resetNewModel();
    } catch (error) {
      toast.error('Failed to update model');
      console.error(error);
    }
  };

  // Handle delete model
  const handleDeleteModel = async (id, name) => {
    try {
      await deleteItem(id);
      await logAction('DELETE_MODEL', name, id);
      
      toast.success(`Model "${name}" deleted successfully!`);
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete model');
      console.error(error);
    }
  };

  // Handle export models
  const handleExport = () => {
    try {
      const exportData = filteredModels.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        type: model.type,
        size: model.size,
        metrics: model.metrics || [],
        links: model.links || {},
        createdAt: model.createdAt
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `models-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast.success(`Exported ${exportData.length} model${exportData.length !== 1 ? 's' : ''} successfully!`);
    } catch (error) {
      toast.error('Failed to export models');
      console.error(error);
    }
  };

  // Start editing a model
  const startEditing = (model) => {
    setEditingId(model.id);
    setNewModel({
      name: model.name || '',
      description: model.description || '',
      type: model.type || 'Language Model',
      size: model.size || '',
      metrics: model.metrics || [],
      links: model.links || { github: '', hf: '', paper: '' }
    });
  };

  // Reset new model form
  const resetNewModel = () => {
    setNewModel({
      name: '',
      description: '',
      type: 'Language Model',
      size: '',
      metrics: [],
      links: {
        github: '',
        hf: '',
        paper: ''
      }
    });
    setNewMetric('');
  };

  // Add metric
  const addMetric = () => {
    if (newMetric.trim() && !newModel.metrics.includes(newMetric.trim())) {
      setNewModel({
        ...newModel,
        metrics: [...newModel.metrics, newMetric.trim()]
      });
      setNewMetric('');
    }
  };

  // Remove metric
  const removeMetric = (metricToRemove) => {
    setNewModel({
      ...newModel,
      metrics: newModel.metrics.filter(metric => metric !== metricToRemove)
    });
  };

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      'Language Model': 'from-blue-900/30 to-blue-600/20 text-blue-400 border-blue-700/30',
      'Question Answering': 'from-emerald-900/30 to-emerald-600/20 text-emerald-400 border-emerald-700/30',
      'Speech': 'from-purple-900/30 to-purple-600/20 text-purple-400 border-purple-700/30',
      'Graph Neural Network': 'from-amber-900/30 to-amber-600/20 text-amber-400 border-amber-700/30',
      'Transformer': 'from-cyan-900/30 to-cyan-600/20 text-cyan-400 border-cyan-700/30',
      'Multimodal Model': 'from-pink-900/30 to-pink-600/20 text-pink-400 border-pink-700/30',
      'Computer Vision': 'from-rose-900/30 to-rose-600/20 text-rose-400 border-rose-700/30'
    };
    return colors[type] || 'from-gray-800 to-gray-700 text-gray-400 border-gray-700';
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
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Models</h3>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Models Management</h1>
          <p className="text-gray-400 mt-1">
            {models.length} model{models.length !== 1 ? 's' : ''} • Manage your AI/ML models
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Model
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <FileDown className="h-4 w-4" />
            Export ({filteredModels.length})
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
                placeholder="Search models by name or description..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
            >
              <option value="all" className="bg-gray-900 text-white">All Types</option>
              {modelTypes.filter(type => type !== 'all').map(type => (
                <option key={type} value={type} className="bg-gray-900 text-white">
                  {type}
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
              <option value="size" className="bg-gray-900 text-white">Largest Size</option>
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
                    {editingId ? 'Edit Model' : 'Add New Model'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {editingId ? 'Update the model information' : 'Create a new AI model entry'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetNewModel();
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
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Model Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newModel.name}
                      onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., BanglaBERT v2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Model Type <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newModel.type}
                        onChange={(e) => setNewModel({...newModel, type: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="Language Model">Language Model</option>
                        <option value="Question Answering">Question Answering</option>
                        <option value="Speech">Speech</option>
                        <option value="Graph Neural Network">Graph Neural Network</option>
                        <option value="Transformer">Transformer</option>
                        <option value="Multimodal Model">Multimodal Model</option>
                        <option value="Computer Vision">Computer Vision</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Model Size <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newModel.size}
                      onChange={(e) => setNewModel({...newModel, size: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="e.g., 355M parameters"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Created Date</label>
                    <input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={newModel.description}
                    onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Describe the model architecture, training data, and capabilities..."
                  />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-emerald-400" />
                  Performance Metrics
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMetric()}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add a metric (e.g., 85.6% F1 score)"
                  />
                  <button
                    onClick={addMetric}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newModel.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-700"
                    >
                      <BarChart className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-300">{metric}</span>
                      <button
                        onClick={() => removeMetric(metric)}
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
                    <label className="block text-gray-300 mb-2">GitHub Repository</label>
                    <input
                      type="url"
                      value={newModel.links.github}
                      onChange={(e) => setNewModel({
                        ...newModel,
                        links: {...newModel.links, github: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">HuggingFace Model</label>
                    <input
                      type="url"
                      value={newModel.links.hf}
                      onChange={(e) => setNewModel({
                        ...newModel,
                        links: {...newModel.links, hf: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://huggingface.co/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Paper URL</label>
                    <input
                      type="url"
                      value={newModel.links.paper}
                      onChange={(e) => setNewModel({
                        ...newModel,
                        links: {...newModel.links, paper: e.target.value}
                      })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="https://arxiv.org/..."
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
                    resetNewModel();
                  }}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingId ? handleUpdateModel(editingId) : handleAddModel()}
                  disabled={!newModel.name || !newModel.description || !newModel.size}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Model' : 'Create Model'}
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
                Are you sure you want to delete the model "{confirmDelete.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteModel(confirmDelete.id, confirmDelete.name)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200"
                >
                  Delete Model
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Models Grid */}
      {filteredModels.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No models found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first model'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Your First Model
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="group bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-900/30 to-purple-800/10">
                      <Cpu className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{model.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${getTypeColor(model.type)} font-medium`}>
                      {model.type}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-700 font-medium">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {formatSize(model.size)}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => startEditing(model)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: model.id, name: model.name })}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-5 line-clamp-3">
                {model.description}
              </p>
              
              {/* Metrics */}
              {model.metrics && model.metrics.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <BarChart className="h-3 w-3" />
                    <span>Performance:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {model.metrics.slice(0, 3).map((metric, index) => (
                      <div
                        key={index}
                        className="px-2.5 py-1.5 bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700"
                      >
                        <span className="text-xs text-emerald-400 font-medium">{metric}</span>
                      </div>
                    ))}
                    {model.metrics.length > 3 && (
                      <div className="px-2.5 py-1.5 bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700">
                        <span className="text-xs text-gray-500">
                          +{model.metrics.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Links */}
              <div className="flex flex-wrap gap-2 mb-4">
                {model.links?.github && (
                  <a
                    href={model.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg text-xs text-gray-300 transition-all duration-200 border border-gray-700"
                  >
                    <FileText className="h-3 w-3" />
                    GitHub
                  </a>
                )}
                {model.links?.hf && (
                  <a
                    href={model.links.hf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 hover:from-yellow-900/40 hover:to-yellow-800/30 rounded-lg text-xs text-yellow-300 transition-all duration-200 border border-yellow-700/30"
                  >
                    <Brain className="h-3 w-3" />
                    HuggingFace
                  </a>
                )}
                {model.links?.paper && (
                  <a
                    href={model.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-900/30 to-blue-800/20 hover:from-blue-900/40 hover:to-blue-800/30 rounded-lg text-xs text-blue-300 transition-all duration-200 border border-blue-700/30"
                  >
                    <FileText className="h-3 w-3" />
                    Paper
                  </a>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {model.createdAt ? new Date(model.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  {formatSize(model.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminModels;