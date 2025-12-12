import React from 'react';
import './TeamAvatar.css';

/**
 * TeamAvatar - Gradient circle with team initials
 * Props:
 *   - teamName (string): The team name
 *   - size (string): 'sm' | 'md' | 'lg' - default 'md'
 *   - colorTheme (string): Predefined color theme
 */
const TeamAvatar = ({ teamName = 'Team', size = 'md', colorTheme = 'blue' }) => {
  // Get initials from team name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Predefined color themes with gradients
  const colorThemes = {
    blue: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    green: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    rose: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
    amber: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    teal: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
    indigo: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  };

  const sizeMap = {
    sm: '32px',
    md: '48px',
    lg: '64px',
  };

  const fontSizeMap = {
    sm: '12px',
    md: '16px',
    lg: '24px',
  };

  const initials = getInitials(teamName);
  const gradient = colorThemes[colorTheme] || colorThemes.blue;
  const avatarSize = sizeMap[size] || sizeMap.md;
  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  return (
    <div
      className="team-avatar"
      style={{
        width: avatarSize,
        height: avatarSize,
        fontSize: fontSize,
        background: gradient,
      }}
      title={teamName}
    >
      {initials}
    </div>
  );
};

export default TeamAvatar;
