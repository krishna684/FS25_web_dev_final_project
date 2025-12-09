import PropTypes from 'prop-types';
import { Check, Circle } from 'lucide-react';

/**
 * Priority Badge Component
 * Displays task priority with colored indicator
 */
const PriorityBadge = ({ priority = 'medium', size = 'default', showLabel = true }) => {
    const priorities = {
        high: {
            color: 'var(--priority-high)',
            bg: 'var(--priority-high-light)',
            label: 'High',
            icon: '🔴'
        },
        medium: {
            color: 'var(--priority-medium)',
            bg: 'var(--priority-medium-light)',
            label: 'Medium',
            icon: '🟠'
        },
        low: {
            color: 'var(--priority-low)',
            bg: 'var(--priority-low-light)',
            label: 'Low',
            icon: '🟢'
        }
    };

    const config = priorities[priority] || priorities.medium;
    const sizeClasses = {
        small: 'text-xs px-1.5 py-0.5',
        default: 'text-xs px-2 py-1',
        large: 'text-sm px-3 py-1.5'
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
            style={{
                backgroundColor: config.bg,
                color: config.color
            }}
            title={`Priority: ${config.label}`}
        >
            <span className="text-xs">{config.icon}</span>
            {showLabel && <span>{config.label}</span>}
        </span>
    );
};

PriorityBadge.propTypes = {
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    showLabel: PropTypes.bool
};

export default PriorityBadge;
