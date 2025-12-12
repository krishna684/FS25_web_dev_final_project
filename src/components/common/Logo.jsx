import PropTypes from 'prop-types';

/**
 * TaskFlow Logo Component
 * Professional branding with icon + text combination
 */
const Logo = ({ size = 'default', showText = true, variant = 'default' }) => {
    const sizes = {
        small: {
            icon: 24,
            text: 'text-base',
            iconClass: 'w-6 h-6'
        },
        default: {
            icon: 36,
            text: 'text-xl',
            iconClass: 'w-9 h-9'
        },
        large: {
            icon: 48,
            text: 'text-2xl',
            iconClass: 'w-12 h-12'
        }
    };

    const currentSize = sizes[size] || sizes.default;

    // Logo icon as SVG
    const LogoIcon = () => (
        <div
            className={`${currentSize.iconClass} bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105`}
            style={{
                background: variant === 'light'
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
            }}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-2/3 h-2/3"
            >
                {/* Checkmark with flow lines */}
                <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Flow lines suggest movement/productivity */}
                <path
                    d="M4 8h4M4 16h4M16 8h4M16 16h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.5"
                />
            </svg>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            <LogoIcon />
            {showText && (
                <div className="flex flex-col">
                    <span
                        className={`${currentSize.text} font-bold text-[var(--text-main)] dark:text-white tracking-tight leading-none`}
                    >
                        TaskFlow
                    </span>
                    {size === 'large' && (
                        <span className="text-xs text-[var(--text-secondary)] leading-none mt-0.5">
                            Organize. Collaborate. Succeed.
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

Logo.propTypes = {
    size: PropTypes.oneOf(['small', 'default', 'large']),
    showText: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'light'])
};

export default Logo;
