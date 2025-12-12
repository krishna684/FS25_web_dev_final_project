/**
 * Task Helper Utilities
 * Formatting and styling helpers for task components
 */

/**
 * Format due date with time in user-friendly format
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date like "Dec 15, 2:00pm" or "Tomorrow, 9am"
 */
export const formatDueDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Time formatting
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';
  const timeString = `${displayHours}${displayMinutes}${isPM ? 'pm' : 'am'}`;

  // Check if today or tomorrow
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return `Today, ${timeString}`;
  if (isTomorrow) return `Tomorrow, ${timeString}`;

  // Format as "Month Day, Time"
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${monthDay}, ${timeString}`;
};

/**
 * Get due date status for color coding
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {'overdue'|'today'|'tomorrow'|'future'} Status indicator
 */
export const getDueDateStatus = (dateString) => {
  if (!dateString) return 'future';

  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date < today) return 'overdue';
  if (date.toDateString() === today.toDateString()) return 'today';
  if (date.toDateString() === tomorrow.toDateString()) return 'tomorrow';
  return 'future';
};

/**
 * Get priority configuration with colors and styles
 * @param {string} priority - 'high', 'medium', or 'low'
 * @returns {object} Priority configuration
 */
export const getPriorityConfig = (priority = 'medium') => {
  const configs = {
    high: {
      label: 'HIGH',
      borderColor: '#F44336',
      bgColor: '#FEE2E2',
      textColor: '#991B1B',
      dotColor: '#EF4444'
    },
    medium: {
      label: 'MED',
      borderColor: '#FF9800',
      bgColor: '#FED7AA',
      textColor: '#9A3412',
      dotColor: '#F59E0B'
    },
    low: {
      label: 'LOW',
      borderColor: '#9CA3AF',
      bgColor: '#E5E7EB',
      textColor: '#374151',
      dotColor: '#6B7280'
    }
  };

  return configs[priority] || configs.medium;
};

/**
 * Get due date color based on status
 * @param {string} status - Due date status from getDueDateStatus
 * @returns {string} CSS color value
 */
export const getDueDateColor = (status) => {
  const colors = {
    overdue: '#DC2626', // red
    today: '#F59E0B', // orange
    tomorrow: '#F59E0B', // orange
    future: '#6B7280' // gray
  };
  return colors[status] || colors.future;
};

/**
 * Get comment count display text
 * @param {array|number} comments - Comments array or count
 * @returns {string|null} Display text or null if no comments
 */
export const getCommentCount = (comments) => {
  const count = Array.isArray(comments) ? comments.length : (comments || 0);
  return count > 0 ? count : null;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
