// src/utils/styleUtils.js
import { colors, colorClasses, theme } from '../config/colors';

export const getRoleColor = (role) => {
  const roleConfig = colors.components.roles[role.toLowerCase().replace(' ', '')] || 
                    colors.components.roles.contributors;
  return `${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`;
};

export const getStatusColor = (status) => {
  const statusKey = status.toLowerCase().replace(/ /g, '');
  const statusConfig = colors.components.status[statusKey] || 
                      colors.components.status.active;
  return `${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`;
};

export const getCardClass = () => {
  return `bg-white ${colorClasses.border.light} rounded-2xl p-6 ${colorClasses.shadow.card} ${theme.transition}`;
};

export const getSectionClass = () => {
  return `py-16 ${theme.fontFamily}`;
};

export const getButtonClass = (variant = 'primary') => {
  const base = `px-6 py-3 rounded-lg ${theme.transition} font-medium`;
  
  switch(variant) {
    case 'primary':
      return `${base} ${colorClasses.bg.black} ${colorClasses.text.white} hover:bg-gray-800`;
    case 'secondary':
      return `${base} border ${colorClasses.border.neutral} ${colorClasses.bg.white} hover:bg-gray-50`;
    case 'outline':
      return `${base} border ${colorClasses.border.primary} ${colorClasses.text.primary} hover:bg-cyan-50`;
    default:
      return base;
  }
};