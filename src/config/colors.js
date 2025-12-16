export const colors = {
  // Brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Component-specific colors
  components: {
    // Role colors for People page
    roles: {
      core: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
      researchers: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      engineers: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      contributors: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      advisors: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    },
    
    // Status colors for Projects page
    status: {
      published: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      released: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
      active: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      pilot: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    },
    
    // Gradients
    gradients: {
      hero: 'from-cyan-500 via-sky-500 to-indigo-500',
      section: 'from-cyan-50 to-sky-50',
      card: 'from-cyan-400 to-blue-500',
    },
  },
};

// Helper functions for Tailwind classes
export const colorClasses = {
  // Background classes
  bg: {
    primary: 'bg-cyan-500',
    primaryLight: 'bg-cyan-50',
    primaryDark: 'bg-cyan-800',
    neutral: 'bg-gray-100',
    white: 'bg-white',
    black: 'bg-black',
  },
  
  // Text classes
  text: {
    primary: 'text-cyan-600',
    primaryDark: 'text-cyan-800',
    neutral: 'text-gray-600',
    neutralDark: 'text-gray-800',
    white: 'text-white',
    black: 'text-black',
  },
  
  // Border classes
  border: {
    primary: 'border-cyan-300',
    neutral: 'border-gray-300',
    light: 'border-gray-200',
    dark: 'border-gray-800',
  },
  
  // Shadow classes
  shadow: {
    card: 'shadow-sm hover:shadow-xl',
    section: 'shadow-md',
    button: 'shadow-sm',
  },
};

// Theme configuration
export const theme = {
  fontFamily: "font-['Manrope']",
  borderRadius: {
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-2xl',
    full: 'rounded-3xl',
  },
  transition: 'transition-all duration-300',
};