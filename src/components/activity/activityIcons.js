// Activity icon mapping utility
export const activityIcons = {
  'task.created': '📝',
  'task.updated': '✏️',
  'task.status.changed': '🔄',
  'task.assigned': '👤',
  'task.comment.added': '💬',
  'team.member.joined': '👋',
  'team.member.left': '👋',
  'team.created': '🎉',
  'notification.sent': '🔔',
};

// Get icon for activity type
export const getActivityIcon = (type) => {
  return activityIcons[type] || '📋'; // Default icon
};

// Activity type categories for filtering
export const activityCategories = {
  tasks: ['task.created', 'task.updated', 'task.status.changed', 'task.assigned'],
  comments: ['task.comment.added'],
  members: ['team.member.joined', 'team.member.left', 'team.created'],
  notifications: ['notification.sent'],
};

// Get category for activity type
export const getActivityCategory = (type) => {
  if (activityCategories.tasks.includes(type)) return 'tasks';
  if (activityCategories.comments.includes(type)) return 'comments';
  if (activityCategories.members.includes(type)) return 'members';
  if (activityCategories.notifications.includes(type)) return 'notifications';
  return 'other';
};