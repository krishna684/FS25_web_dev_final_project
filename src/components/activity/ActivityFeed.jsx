import React, { useState, useEffect, useMemo } from 'react';
import { getActivityIcon } from './activityIcons';
import {
  getRelativeTime,
  formatActivityMessage,
  groupActivitiesByDate,
  filterActivities,
  generateActivityCSV,
  downloadCSV
} from './activityUtils';

const ActivityFeed = ({ items = [], teamId, showFilters = true, showExport = true }) => {
  const [filters, setFilters] = useState({ type: 'all', userId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  // Filter and group activities
  const filteredActivities = useMemo(() => {
    return filterActivities(items, filters);
  }, [items, filters]);

  const groupedActivities = useMemo(() => {
    return groupActivitiesByDate(filteredActivities);
  }, [filteredActivities]);

  // Get paginated activities
  const paginatedActivities = useMemo(() => {
    const allActivities = Object.values(groupedActivities).flat();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [groupedActivities, currentPage]);

  // Regroup paginated activities for display
  const displayGroups = useMemo(() => {
    return groupActivitiesByDate(paginatedActivities);
  }, [paginatedActivities]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    const csvContent = generateActivityCSV(filteredActivities);
    downloadCSV(csvContent, `activity-log-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (!items?.length) {
    return (
      <div className="activity-feed-empty">
        <p>No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="activity-feed-container">
      {/* Filters */}
      {showFilters && (
        <div className="activity-filters">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
            className="activity-filter-select"
          >
            <option value="all">All Activities</option>
            <option value="tasks">Tasks</option>
            <option value="comments">Comments</option>
            <option value="members">Members</option>
            <option value="notifications">Notifications</option>
          </select>
        </div>
      )}

      {/* Export Button */}
      {showExport && (
        <div className="activity-export">
          <button onClick={handleExport} className="btn-secondary">
            Export as CSV
          </button>
        </div>
      )}

      {/* Activity Groups */}
      <div className="activity-feed">
        {Object.entries(displayGroups).map(([dateGroup, activities]) => (
          <div key={dateGroup} className="activity-group">
            <div className="activity-group-divider">
              <span className="activity-group-title">{dateGroup}</span>
            </div>
            <ul className="activity-list">
              {activities.map((activity) => (
                <ActivityItem key={activity._id} activity={activity} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {paginatedActivities.length < filteredActivities.length && (
        <div className="activity-load-more">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

// Individual activity item component
const ActivityItem = ({ activity }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <li className="activity-item">
      <div className="activity-icon">
        {getActivityIcon(activity.type)}
      </div>

      <div className="activity-content">
        <div className="activity-message">
          <FormattedMessage message={activity.message} meta={activity.meta} />
        </div>

        <div className="activity-meta">
          <div className="activity-actor">
            {activity.actor?.avatar && (
              <img
                src={activity.actor.avatar}
                alt={activity.actor.name}
                className="activity-avatar"
              />
            )}
            <span className="activity-actor-name">
              {activity.actor?.name || 'Unknown'}
            </span>
          </div>

          <div
            className="activity-timestamp"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {getRelativeTime(activity.createdAt)}
            {showTooltip && (
              <div className="activity-tooltip">
                {new Date(activity.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

// Formatted message component with clickable elements
const FormattedMessage = ({ message, meta = {} }) => {
  const formattedMessage = formatActivityMessage(message, meta);

  // Simple text formatting - replace **text** with bold
  const parts = formattedMessage.split(/(\*\*.*?\*\*)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const text = part.slice(2, -2);
          return <strong key={index}>{text}</strong>;
        }
        return part;
      })}
    </span>
  );
};

export default ActivityFeed;
