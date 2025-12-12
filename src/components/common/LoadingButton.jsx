import { Loader2 } from 'lucide-react';

const LoadingButton = ({ 
  loading = false,
  disabled = false,
  children,
  className = 'btn btn-primary',
  loadingText = 'Loading...',
  icon: Icon,
  ...props 
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${className} ${loading ? 'loading' : ''}`}
      disabled={isDisabled}
      aria-busy={loading}
      aria-live="polite"
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
