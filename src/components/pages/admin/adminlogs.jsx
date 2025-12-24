// components/pages/admin/adminlogs.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authcontext.jsx';
import useFirebaseData from '../../extra/usefb.js';
import { 
  Filter,
  Search,
  Calendar,
  User,
  Monitor,
  Globe,
  Clock,
  RefreshCw,
  AlertTriangle,
  Trash2,
  Eye,
  Download,
  FileText,
  Database,
  Cpu,
  FolderKanban,
  Users,
  Archive,
  ExternalLink,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogs = () => {
  const { adminName } = useAuth();
  const { data: logs, loading, error } = useFirebaseData('/logs');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterAdmin, setFilterAdmin] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [selectedLog, setSelectedLog] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Get unique actions and admins for filter
  const actions = ['all', ...new Set(logs.map(l => l.action))];
  const admins = ['all', ...new Set(logs.map(l => l.adminName))];

  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = 
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.datasetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.publicationTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.memberName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesAdmin = filterAdmin === 'all' || log.adminName === filterAdmin;
      
      return matchesSearch && matchesAction && matchesAdmin;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sortBy === 'admin') {
        return a.adminName?.localeCompare(b.adminName);
      }
      return 0;
    });

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format detailed timestamp
  const formatDetailedTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Get action icon
  const getActionIcon = (action) => {
    const icons = {
      'CREATE_DATASET': Database,
      'UPDATE_DATASET': Database,
      'DELETE_DATASET': Database,
      'CREATE_MODEL': Cpu,
      'UPDATE_MODEL': Cpu,
      'DELETE_MODEL': Cpu,
      'CREATE_PROJECT': FolderKanban,
      'UPDATE_PROJECT': FolderKanban,
      'DELETE_PROJECT': FolderKanban,
      'CREATE_PUBLICATION': FileText,
      'UPDATE_PUBLICATION': FileText,
      'DELETE_PUBLICATION': FileText,
      'CREATE_TEAM_MEMBER': Users,
      'UPDATE_TEAM_MEMBER': Users,
      'DELETE_TEAM_MEMBER': Users,
      'LOGIN': Shield,
      'LOGOUT': Shield
    };
    return icons[action] || Info;
  };

  // Get action color
  const getActionColor = (action) => {
    if (action?.includes('CREATE')) return 'bg-emerald-900/30 text-emerald-400';
    if (action?.includes('UPDATE')) return 'bg-blue-900/30 text-blue-400';
    if (action?.includes('DELETE')) return 'bg-red-900/30 text-red-400';
    if (action === 'LOGIN') return 'bg-green-900/30 text-green-400';
    if (action === 'LOGOUT') return 'bg-amber-900/30 text-amber-400';
    return 'bg-gray-800 text-gray-400';
  };

  // Get action text
  const getActionText = (action) => {
    const actionMap = {
      'CREATE_DATASET': 'Created Dataset',
      'UPDATE_DATASET': 'Updated Dataset',
      'DELETE_DATASET': 'Deleted Dataset',
      'CREATE_MODEL': 'Created Model',
      'UPDATE_MODEL': 'Updated Model',
      'DELETE_MODEL': 'Deleted Model',
      'CREATE_PROJECT': 'Created Project',
      'UPDATE_PROJECT': 'Updated Project',
      'DELETE_PROJECT': 'Deleted Project',
      'CREATE_PUBLICATION': 'Created Publication',
      'UPDATE_PUBLICATION': 'Updated Publication',
      'DELETE_PUBLICATION': 'Deleted Publication',
      'CREATE_TEAM_MEMBER': 'Added Team Member',
      'UPDATE_TEAM_MEMBER': 'Updated Team Member',
      'DELETE_TEAM_MEMBER': 'Removed Team Member',
      'LOGIN': 'Logged In',
      'LOGOUT': 'Logged Out'
    };
    return actionMap[action] || action;
  };

  // Get target entity
  const getTargetEntity = (log) => {
    return log.modelName || log.datasetName || log.projectTitle || log.publicationTitle || log.memberName || 'N/A';
  };

  // Get target type
  const getTargetType = (log) => {
    if (log.modelName) return 'Model';
    if (log.datasetName) return 'Dataset';
    if (log.projectTitle) return 'Project';
    if (log.publicationTitle) return 'Publication';
    if (log.memberName) return 'Team Member';
    return 'System';
  };

  // Get browser info
  const getBrowserInfo = (userAgent) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  // Get OS info
  const getOSInfo = (platform) => {
    if (!platform) return 'Unknown';
    
    if (platform.includes('Win')) return 'Windows';
    if (platform.includes('Mac')) return 'macOS';
    if (platform.includes('Linux')) return 'Linux';
    if (platform.includes('Android')) return 'Android';
    if (platform.includes('iOS')) return 'iOS';
    return 'Other';
  };

  // Export logs as JSON
  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `admin-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Logs exported successfully!');
  };

  // Clear all logs confirmation
  const handleClearLogs = async () => {
    // Note: This would require a Firebase function to clear logs
    // Since we don't have delete functionality in useFirebaseData for all logs,
    // we'll just show a message for now
    toast.info('Log clearing functionality requires backend implementation');
    setConfirmClear(false);
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
      <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Logs</h3>
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Activity Logs</h1>
          <p className="text-gray-400 mt-1">
            {logs.length} log{logs.length !== 1 ? 's' : ''} • Track all admin activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Logs
          </button>
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-900/30">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-cyan-400 text-sm font-medium">Total Activities</div>
              <div className="text-white text-2xl font-bold">{logs.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900/30">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-emerald-400 text-sm font-medium">Create Actions</div>
              <div className="text-white text-2xl font-bold">
                {logs.filter(l => l.action?.includes('CREATE')).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-900/30">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-blue-400 text-sm font-medium">Update Actions</div>
              <div className="text-white text-2xl font-bold">
                {logs.filter(l => l.action?.includes('UPDATE')).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-900/30">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <div className="text-red-400 text-sm font-medium">Delete Actions</div>
              <div className="text-white text-2xl font-bold">
                {logs.filter(l => l.action?.includes('DELETE')).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {actions.map(action => (
                <option key={action} value={action}>
                  {action === 'all' ? 'All Actions' : getActionText(action)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {admins.map(admin => (
                <option key={admin} value={admin}>
                  {admin === 'all' ? 'All Admins' : admin}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="timestamp">Newest First</option>
              <option value="admin">Admin Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-red-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Clear All Logs</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to clear all {logs.length} logs? This action cannot be undone and no further activities will be tracked until new logs are generated.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear All Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Admin Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-800">
                  <img 
                    src={selectedLog.adminPhoto || '/assets/admin.jpg'} 
                    alt={selectedLog.adminName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/admin.jpg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">{selectedLog.adminName}</h3>
                  <p className="text-sm text-gray-400">{selectedLog.adminEmail}</p>
                  <p className="text-sm text-cyan-400 mt-1">{selectedLog.action}</p>
                </div>
              </div>
              
              {/* Action Details */}
              <div>
                <h4 className="text-gray-300 font-medium mb-3">Action Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Action Type</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg">
                      <span className={`text-sm ${getActionColor(selectedLog.action).split(' ')[1]}`}>
                        {getActionText(selectedLog.action)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Target Type</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                      {getTargetType(selectedLog)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Target Name</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg text-white text-sm">
                      {getTargetEntity(selectedLog)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Target ID</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg text-gray-300 text-sm font-mono">
                      {selectedLog.modelId || selectedLog.datasetId || selectedLog.projectId || selectedLog.publicationId || selectedLog.memberId || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timestamp */}
              <div>
                <h4 className="text-gray-300 font-medium mb-3">Timestamp</h4>
                <div className="px-3 py-2 bg-gray-800/50 rounded-lg">
                  <div className="text-white">{formatDetailedTimestamp(selectedLog.timestamp)}</div>
                  <div className="text-sm text-gray-400 mt-1">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>
              </div>
              
              {/* Device Info */}
              <div>
                <h4 className="text-gray-300 font-medium mb-3">Device Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Browser</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {getBrowserInfo(selectedLog.deviceInfo?.userAgent)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Operating System</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                      <Monitor className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {getOSInfo(selectedLog.deviceInfo?.platform)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Language</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                      {selectedLog.deviceInfo?.language || 'Unknown'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Screen Resolution</label>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-lg text-gray-300 text-sm">
                      {selectedLog.deviceInfo?.screenWidth || '?'} × {selectedLog.deviceInfo?.screenHeight || '?'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Raw Data */}
              <div>
                <h4 className="text-gray-300 font-medium mb-3">Raw Log Data</h4>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No logs found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterAction !== 'all' || filterAdmin !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'No activities have been logged yet'}
          </p>
          <div className="text-sm text-gray-500">
            Logs will appear here when admins perform actions in the system
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const ActionIcon = getActionIcon(log.action);
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-cyan-500/30 hover:bg-gray-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Admin Profile Picture */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500/50 overflow-hidden bg-gray-800">
                      <img 
                        src={log.adminPhoto || '/assets/admin.jpg'} 
                        alt={log.adminName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/admin.jpg';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Log Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{log.adminName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(log.action)}`}>
                          {getActionText(log.action)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                    
                    {/* Target Information */}
                    <div className="mb-2">
                      {getTargetEntity(log) !== 'N/A' && (
                        <div className="flex items-center gap-2 text-sm">
                          <ActionIcon className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-300">{getTargetType(log)}:</span>
                          <span className="text-cyan-300 font-medium truncate">
                            {getTargetEntity(log)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Device Info (Compact) */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {log.deviceInfo?.userAgent && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {getBrowserInfo(log.deviceInfo.userAgent)}
                        </div>
                      )}
                      
                      {log.deviceInfo?.platform && (
                        <div className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" />
                          {getOSInfo(log.deviceInfo.platform)}
                        </div>
                      )}
                      
                      {log.deviceInfo?.screenWidth && log.deviceInfo?.screenHeight && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {log.deviceInfo.screenWidth}×{log.deviceInfo.screenHeight}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination/Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="text-gray-400">
            Showing {filteredLogs.length} of {logs.length} logs
            {searchTerm || filterAction !== 'all' || filterAdmin !== 'all' ? ' (filtered)' : ''}
          </div>
          
          <div className="text-gray-400">
            Last log: {logs.length > 0 ? formatTimestamp(logs[0]?.timestamp) : 'None'}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-gray-400">Create: {logs.filter(l => l.action?.includes('CREATE')).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Update: {logs.filter(l => l.action?.includes('UPDATE')).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Delete: {logs.filter(l => l.action?.includes('DELETE')).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;