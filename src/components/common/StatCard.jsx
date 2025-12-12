import PropTypes from 'prop-types';

/**
 * Enhanced Stat Card Component
 * Displays statistics with gradient background, icon, and animations
 */
const StatCard = ({ icon: Icon, label, value, color = 'blue', trend, className = '' }) => {
    const colorVariants = {
        blue: {
            bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
            icon: 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-400',
            text: 'text-blue-600 dark:text-blue-400',
            ring: 'ring-blue-500/20'
        },
        green: {
            bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
            icon: 'bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400',
            text: 'text-green-600 dark:text-green-400',
            ring: 'ring-green-500/20'
        },
        red: {
            bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
            icon: 'bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-400',
            text: 'text-red-600 dark:text-red-400',
            ring: 'ring-red-500/20'
        },
        purple: {
            bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
            icon: 'bg-purple-100 text-purple-600 dark:bg-purple-800/50 dark:text-purple-400',
            text: 'text-purple-600 dark:text-purple-400',
            ring: 'ring-purple-500/20'
        }
    };

    const variant = colorVariants[color] || colorVariants.blue;

    return (
        <div
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${variant.bg} p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-[var(--border)] ${className}`}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-[var(--text-main)] m-0">{value}</h3>
                        {trend && (
                            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
                            </span>
                        )}
                    </div>
                </div>

                <div className={`p-3 rounded-lg ${variant.icon} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
            </div>
        </div>
    );
};

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.oneOf(['blue', 'green', 'red', 'purple']),
    trend: PropTypes.number,
    className: PropTypes.string
};

export default StatCard;
