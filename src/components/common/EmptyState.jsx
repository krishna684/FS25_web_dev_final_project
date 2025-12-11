import PropTypes from 'prop-types';
import { CheckCircle2, Plus, ArrowRight, FileQuestion, Inbox, Users, Search, CalendarX } from 'lucide-react';

/**
 * Empty State Component
 * Displays friendly messages and actions when there's no data
 */
const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel = "Create New",
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    variant = 'default', // default, success, info
    type = 'default' // default, tasks, teams, search, calendar
}) => {
    // Type-based defaults
    const typeDefaults = {
        default: {
            icon: FileQuestion,
            title: "Nothing here yet",
            description: "Get started by adding some content."
        },
        tasks: {
            icon: Inbox,
            title: "No tasks yet",
            description: "Create your first task to get started with organizing your work."
        },
        teams: {
            icon: Users,
            title: "No teams found",
            description: "Join a team or create your own to start collaborating."
        },
        search: {
            icon: Search,
            title: "No results found",
            description: "Try adjusting your search terms or filters."
        },
        calendar: {
            icon: CalendarX,
            title: "No events scheduled",
            description: "Your calendar is clear. Add tasks with due dates to see them here."
        }
    };

    const typeConfig = typeDefaults[type] || typeDefaults.default;
    const DisplayIcon = Icon || typeConfig.icon;
    const displayTitle = title || typeConfig.title;
    const displayDescription = description || typeConfig.description;

    const variants = {
        default: {
            iconColor: 'text-gray-400',
            bgColor: 'bg-gray-100 dark:bg-gray-800'
        },
        success: {
            iconColor: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        info: {
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        }
    };

    const config = variants[variant] || variants.default;

    return (
        <div className="empty-state" role="status" aria-label={displayTitle}>
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} mb-4 empty-state-icon`}>
                <DisplayIcon size={32} className={config.iconColor} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-[var(--text-main)] mb-2 empty-state-title">
                {displayTitle}
            </h3>

            {/* Description */}
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto empty-state-message">
                {displayDescription}
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                {onAction && (
                    <button
                        onClick={onAction}
                        className="btn btn-primary gap-2"
                    >
                        <Plus size={18} />
                        {actionLabel}
                    </button>
                )}

                {onSecondaryAction && secondaryActionLabel && (
                    <button
                        onClick={onSecondaryAction}
                        className="btn btn-secondary gap-2"
                    >
                        {secondaryActionLabel}
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string,
    description: PropTypes.string,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
    secondaryActionLabel: PropTypes.string,
    onSecondaryAction: PropTypes.func,
    variant: PropTypes.oneOf(['default', 'success', 'info'])
};

export default EmptyState;
