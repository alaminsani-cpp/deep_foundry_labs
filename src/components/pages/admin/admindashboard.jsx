import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../../../contexts/authcontext.jsx';
import useFirebaseData from '../../extra/usefb.js';
import { 
  Database, 
  Cpu, 
  FolderKanban, 
  FileText, 
  Users,
  LogOut,
  Menu,
  X,
  Clock,
  Activity,
  Logs,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Plus,
  Eye,
  Download,
  Shield,
  Zap,
  CheckCircle,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Database as DatabaseIcon,
  Cpu as CpuIcon
} from 'lucide-react';

// Lazy load the admin components
const AdminDatasets = lazy(() => import('./admindatasets.jsx'));
const AdminModels = lazy(() => import('./adminmodels.jsx'));
const AdminProjects = lazy(() => import('./adminprojects.jsx'));
const AdminPublications = lazy(() => import('./adminpublications.jsx')); 
const AdminLogs = lazy(() => import('./adminlogs.jsx'));

// Error Boundary component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
      setError(error);
    };

    // Add global error listeners
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback || (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
};

const AdminDashboard = () => {
  const { logout, adminName, adminEmail, adminPhoto } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch real data from Firebase
  const { data: datasets } = useFirebaseData('/datasets');
  const { data: models } = useFirebaseData('/models');
  const { data: projects } = useFirebaseData('/projects');
  const { data: publications } = useFirebaseData('/publications');
  const { data: logs, loading: logsLoading } = useFirebaseData('/logs');
  const { data: teamMembers } = useFirebaseData('/team');

  // Update clock every second
  useEffect(() => {
    let timerId;
    
    const updateClock = () => {
      setCurrentTime(new Date());
      timerId = setTimeout(updateClock, 1000);
    };
    
    updateClock();
    
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Format time for header
  const formatHeaderTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format timestamp for recent activities
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
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
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  // Get recent logs sorted by timestamp (newest first)
  const getRecentLogs = () => {
    if (!logs || !Array.isArray(logs)) return [];
    
    return logs
      .filter(log => log && log.timestamp) // Filter out invalid logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort newest first
      .slice(0, 4); // Get last 4
  };

  const recentLogs = getRecentLogs();

  // Get action icon
  const getActionIcon = (action) => {
    if (action?.includes('DATASET')) return DatabaseIcon;
    if (action?.includes('MODEL')) return CpuIcon;
    if (action?.includes('PROJECT')) return FolderKanban;
    if (action?.includes('PUBLICATION')) return FileText;
    if (action?.includes('TEAM_MEMBER')) return Users;
    if (action?.includes('CREATE')) return Plus;
    if (action?.includes('UPDATE')) return Edit2;
    if (action?.includes('DELETE')) return Trash2;
    return Activity;
  };

  // Get action color
  const getActionColor = (action) => {
    if (action?.includes('CREATE')) return 'bg-emerald-500';
    if (action?.includes('UPDATE')) return 'bg-blue-500';
    if (action?.includes('DELETE')) return 'bg-red-500';
    if (action === 'LOGIN') return 'bg-green-500';
    if (action === 'LOGOUT') return 'bg-amber-500';
    return 'bg-gray-500';
  };

  // Get action text
  const getActionText = (log) => {
    if (!log || !log.action) return 'Activity';
    
    const actionMap = {
      'CREATE_DATASET': 'Created dataset',
      'UPDATE_DATASET': 'Updated dataset',
      'DELETE_DATASET': 'Deleted dataset',
      'CREATE_MODEL': 'Created model',
      'UPDATE_MODEL': 'Updated model',
      'DELETE_MODEL': 'Deleted model',
      'CREATE_PROJECT': 'Created project',
      'UPDATE_PROJECT': 'Updated project',
      'DELETE_PROJECT': 'Deleted project',
      'CREATE_PUBLICATION': 'Added publication',
      'UPDATE_PUBLICATION': 'Updated publication',
      'DELETE_PUBLICATION': 'Deleted publication',
      'CREATE_TEAM_MEMBER': 'Added team member',
      'UPDATE_TEAM_MEMBER': 'Updated team member',
      'DELETE_TEAM_MEMBER': 'Removed team member',
      'LOGIN': 'Logged in',
      'LOGOUT': 'Logged out'
    };
    
    return actionMap[log.action] || log.action.replace(/_/g, ' ').toLowerCase();
  };

  // Get target name
  const getTargetName = (log) => {
    return log.modelName || log.datasetName || log.projectTitle || log.publicationTitle || log.memberName || 'item';
  };

  // Database sections
  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      description: 'Overview and statistics',
      component: null
    },
    {
      id: 'datasets',
      name: 'Datasets',
      icon: Database,
      description: 'Manage all datasets',
      component: 'AdminDatasets'
    },
    {
      id: 'models',
      name: 'Models',
      icon: Cpu,
      description: 'Manage AI models',
      component: 'AdminModels'
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: FolderKanban,
      description: 'Research projects',
      component: 'AdminProjects'
    },
    {
      id: 'publications',
      name: 'Publications',
      icon: FileText,
      description: 'Research papers',
      component: 'AdminPublications'
    },
    {
      id: 'logs',
      name: 'Logs',
      icon: Logs,
      description: 'Activity logs',
      component: 'AdminLogs'
    }
  ];

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
      <span className="ml-3 text-gray-300">Loading...</span>
    </div>
  );

  const renderContent = () => {
    const activeSectionData = sections.find(s => s.id === activeSection);
    
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-4 md:p-6">
            {/* Welcome Card with Enhanced Profile */}
            <div className="bg-gradient-to-r from-gray-800/50 to-cyan-900/20 border border-gray-700 rounded-xl p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Profile Picture - Twice as big (now 256x256) */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 rounded-full border-4 border-cyan-500 overflow-hidden bg-gray-800 shadow-2xl shadow-cyan-500/30">
                    <img 
                      src={adminPhoto} 
                      alt={adminName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', adminPhoto);
                        e.target.src = '/assets/admin.jpg';
                      }}
                    />
                  </div>
                </div>
                
                {/* Welcome Text */}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    Welcome back, <span className="text-cyan-400">{adminName}!</span>
                  </h2>
                  <p className="text-gray-400 text-xl mb-6">{adminEmail}</p>
                  <p className="text-gray-300 text-lg mb-8">
                    You have full control over the research portal. Monitor activities, manage content, and track performance from here.
                  </p>
                  
                  {/* Real Stats from Firebase */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-900/30">
                          <Database className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">{datasets?.length || 0}</div>
                          <div className="text-sm text-gray-400">Datasets</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-900/30">
                          <Cpu className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">{models?.length || 0}</div>
                          <div className="text-sm text-gray-400">Models</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-emerald-900/30">
                          <FolderKanban className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">{projects?.length || 0}</div>
                          <div className="text-sm text-gray-400">Projects</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-amber-900/30">
                          <FileText className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">{publications?.length || 0}</div>
                          <div className="text-sm text-gray-400">Publications</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Team & System Status */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Team & System</h3>
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Team Members</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{teamMembers?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Total Activities</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{logs?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Today's Date</span>
                    </div>
                    <span className="text-amber-400 font-bold">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Server Uptime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-emerald-400 font-bold">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity - Real Data */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm text-cyan-400">{recentLogs.length}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {logsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />
                      <span className="ml-2 text-gray-400 text-sm">Loading activities...</span>
                    </div>
                  ) : recentLogs.length > 0 ? (
                    recentLogs.map((log, index) => {
                      const ActionIcon = getActionIcon(log.action);
                      const actionColor = getActionColor(log.action);
                      const actionText = getActionText(log);
                      const targetName = getTargetName(log);
                      
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg ${actionColor.replace('bg-', 'bg-').replace('-500', '-900/30')}`}>
                            <ActionIcon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">
                              <span className="font-medium">{log.adminName || 'Admin'}</span>
                              <span className="text-gray-300"> {actionText}</span>
                              {targetName !== 'item' && (
                                <span className="text-cyan-300"> "{targetName}"</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <Activity className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No recent activities</p>
                      <p className="text-gray-500 text-xs mt-1">Activities will appear here when you perform actions</p>
                    </div>
                  )}
                </div>
                {logs && logs.length > 4 && (
                  <button
                    onClick={() => setActiveSection('logs')}
                    className="w-full mt-6 flex items-center justify-center gap-2 p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors text-sm text-cyan-400"
                  >
                    <ChevronRight className="h-4 w-4" />
                    View All {logs.length} Activities
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveSection('datasets')}
                    className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="h-4 w-4 text-cyan-400" />
                      <span className="text-white text-sm">Add Dataset</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-cyan-400" />
                  </button>
                  <button
                    onClick={() => setActiveSection('models')}
                    className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="h-4 w-4 text-purple-400" />
                      <span className="text-white text-sm">Create Model</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
                  </button>
                  <button
                    onClick={() => setActiveSection('publications')}
                    className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="h-4 w-4 text-amber-400" />
                      <span className="text-white text-sm">Add Publication</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-amber-400" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-emerald-400" />
                      <span className="text-white text-sm">Export Report</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Platform Performance</h3>
                  <p className="text-gray-400 text-sm">Real-time metrics</p>
                </div>
                <TrendingUp className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{datasets?.length || 0}</div>
                  <div className="text-sm text-gray-400">Active Datasets</div>
                  <div className="text-xs text-cyan-400 mt-1">✓ Updated today</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{logs?.length || 0}</div>
                  <div className="text-sm text-gray-400">Total Actions</div>
                  <div className="text-xs text-emerald-400 mt-1">↑ 24h activity</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{teamMembers?.length || 0}</div>
                  <div className="text-sm text-gray-400">Team Members</div>
                  <div className="text-xs text-purple-400 mt-1">✓ Active team</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400 mb-1">100%</div>
                  <div className="text-sm text-gray-400">System Uptime</div>
                  <div className="text-xs text-amber-400 mt-1">✓ All systems go</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'datasets':
        return (
          <ErrorBoundary fallback={<LoadingSpinner />}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDatasets />
            </Suspense>
          </ErrorBoundary>
        );

      case 'models':
        return (
          <ErrorBoundary fallback={<LoadingSpinner />}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminModels />
            </Suspense>
          </ErrorBoundary>
        );

      case 'projects':
        return (
          <ErrorBoundary fallback={<LoadingSpinner />}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProjects />
            </Suspense>
          </ErrorBoundary>
        );

      case 'publications':
        return (
          <ErrorBoundary fallback={<LoadingSpinner />}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPublications />
            </Suspense>
          </ErrorBoundary>
        );
      
      case 'logs':
        return (
          <ErrorBoundary fallback={<LoadingSpinner />}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLogs />
            </Suspense>
          </ErrorBoundary>
        );

      default:
        return (
          <div className="p-4 md:p-6">
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 text-center">
              <div className="inline-block p-6 rounded-full bg-gray-700/30 mb-4">
                {(() => {
                  const Icon = activeSectionData?.icon || BarChart3;
                  return <Icon className="h-10 w-10 text-cyan-400" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {activeSectionData?.name} Management
              </h3>
              <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
                {activeSectionData?.description}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02081a] to-[#0a1025] flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/80 rounded-lg text-white"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - Fixed with scrolling and better spacing */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:sticky lg:top-0
        w-64 h-screen
        bg-gray-900/95 backdrop-blur-sm
        border-r border-gray-800
        transition-transform duration-300
        z-40
        left-0 top-0
        flex flex-col
      `}>
        {/* Admin Profile with negative top margin */}
        <div className="p-6 border-b border-gray-800 mb-3 -mt-1"> {/* Added negative margin */}
          <div className="flex items-center gap-3">
            {/* Profile picture container - forced circle */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-800">
                <img 
                  src={adminPhoto} 
                  alt={adminName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', adminPhoto);
                    e.target.onerror = null; // Prevent infinite loop
                    
                    // Create fallback with initials
                    const canvas = document.createElement('canvas');
                    canvas.width = 48;
                    canvas.height = 48;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw circle background
                    ctx.beginPath();
                    ctx.arc(24, 24, 24, 0, Math.PI * 2);
                    ctx.fillStyle = '#1f2937'; // gray-800
                    ctx.fill();
                    
                    // Draw border
                    ctx.beginPath();
                    ctx.arc(24, 24, 24, 0, Math.PI * 2);
                    ctx.strokeStyle = '#06b6d4'; // cyan-500
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Draw initials
                    ctx.fillStyle = '#22d3ee'; // cyan-400
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const initials = adminName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
                    ctx.fillText(initials.substring(0, 2), 24, 24);
                    
                    e.target.src = canvas.toDataURL();
                  }}
                />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white truncate">{adminName}</h1>
              <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation - Scrollable area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                    ${activeSection === section.id 
                      ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/50' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-left flex-1">{section.name}</span>
                  {activeSection === section.id && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Footer - Stays at bottom */}
        <div className="mt-auto border-t border-gray-800 pt-4">
          <div className="text-center mb-4 px-4">
            <div className="text-xs text-gray-500 mb-1">Server Status</div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-sm font-medium text-emerald-400">All Systems Operational</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mx-4 mb-4 flex items-center justify-center gap-2 p-3 text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-gradient-to-b from-[#02081a] to-[#0a1025]/95 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-400">
                {sections.find(s => s.id === activeSection)?.description || 'Admin Panel'}
              </p>
            </div>
            
            {/* Current Time Display - Transparent background */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg">
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{formatHeaderTime(currentTime)}</div>
                  <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-400">Role:</span>
                <span className="px-2 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-medium">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        {renderContent()}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;