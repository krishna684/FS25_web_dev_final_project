// Activity utility functions
import { getActivityCategory } from './activityIcons';

// Convert timestamp to relative time (e.g., "2 hours ago")
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';

  // Minutes
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Days
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  // Weeks
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  // Months
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  // Years
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

// Format activity message with clickable elements
export const formatActivityMessage = (message, meta = {}) => {
  if (!message) return '';

  let formattedMessage = message;

  // Bold important words (task names, user names, team names)
  if (meta.taskTitle) {
    formattedMessage = formattedMessage.replace(meta.taskTitle, `**${meta.taskTitle}**`);
  }
  if (meta.userName) {
    formattedMessage = formattedMessage.replace(meta.userName, `**${meta.userName}**`);
  }
  if (meta.teamName) {
    formattedMessage = formattedMessage.replace(meta.teamName, `**${meta.teamName}**`);
  }

  return formattedMessage;
};

// Group activities by date
export const groupActivitiesByDate = (activities) => {
  const groups = {};
  const now = new Date();

  activities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let groupKey;
    const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      groupKey = 'Today';
    } else if (diffDays === 1) {
      groupKey = 'Yesterday';
    } else if (diffDays <= 7) {
      groupKey = 'Last Week';
    } else if (diffDays <= 30) {
      groupKey = 'Last Month';
    } else {
      groupKey = activityDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(activity);
  });

  // Sort groups by date (most recent first)
  const groupOrder = ['Today', 'Yesterday', 'Last Week', 'Last Month'];
  const sortedGroups = {};

  groupOrder.forEach(key => {
    if (groups[key]) {
      sortedGroups[key] = groups[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  });

  // Add other date groups
  Object.keys(groups).forEach(key => {
    if (!groupOrder.includes(key)) {
      sortedGroups[key] = groups[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  });

  return sortedGroups;
};

// Filter activities by type and user
export const filterActivities = (activities, filters) => {
  return activities.filter(activity => {
    // Filter by activity type
    if (filters.type && filters.type !== 'all') {
      const category = getActivityCategory(activity.type);
      if (category !== filters.type) return false;
    }

    // Filter by user
    if (filters.userId && activity.actor?._id !== filters.userId) {
      return false;
    }

    return true;
  });
};

// Generate CSV content for export
export const generateActivityCSV = (activities) => {
  const headers = ['Date', 'Time', 'User', 'Activity Type', 'Message'];
  const rows = activities.map(activity => [
    new Date(activity.createdAt).toLocaleDateString(),
    new Date(activity.createdAt).toLocaleTimeString(),
    activity.actor?.name || 'Unknown',
    activity.type,
    activity.message
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

// Download CSV file
export const downloadCSV = (csvContent, filename = 'activity-log.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};