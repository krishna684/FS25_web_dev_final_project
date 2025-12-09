const SkeletonLoader = ({ 
  variant = 'text', 
  width = '100%', 
  height,
  count = 1,
  className = ''
}) => {
  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'title':
        return '32px';
      case 'text':
        return '16px';
      case 'avatar':
        return '48px';
      case 'card':
        return '200px';
      case 'button':
        return '48px';
      default:
        return '16px';
    }
  };

  const getClassName = () => {
    const baseClass = 'skeleton';
    const variantClass = variant === 'avatar' ? 'skeleton-avatar' : '';
    return `${baseClass} ${variantClass} ${className}`.trim();
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={getClassName()}
      style={{
        width,
        height: getHeight(),
        marginBottom: count > 1 && i < count - 1 ? '12px' : '0'
      }}
      role="status"
      aria-label="Loading..."
    />
  ));

  return <>{skeletons}</>;
};

// Skeleton Card for common loading states
export const SkeletonCard = () => (
  <div className="card" role="status" aria-label="Loading card...">
    <div className="flex items-center gap-md mb-md">
      <SkeletonLoader variant="avatar" width="48px" />
      <div style={{ flex: 1 }}>
        <SkeletonLoader variant="title" width="60%" height="20px" />
        <SkeletonLoader variant="text" width="40%" height="14px" className="mt-xs" />
      </div>
    </div>
    <SkeletonLoader variant="text" count={3} />
    <div className="flex gap-sm mt-md">
      <SkeletonLoader variant="button" width="100px" height="36px" />
      <SkeletonLoader variant="button" width="100px" height="36px" />
    </div>
  </div>
);

// Skeleton List
export const SkeletonList = ({ count = 5 }) => (
  <div className="space-y-md" role="status" aria-label="Loading list...">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card">
        <div className="flex items-center gap-sm mb-sm">
          <SkeletonLoader width="24px" height="24px" />
          <SkeletonLoader variant="title" width="70%" height="18px" />
        </div>
        <SkeletonLoader variant="text" count={2} />
      </div>
    ))}
  </div>
);

// Skeleton Table
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="card" role="status" aria-label="Loading table...">
    {/* Header */}
    <div className="flex gap-md mb-md pb-md" style={{ borderBottom: '1px solid var(--border)' }}>
      {Array.from({ length: columns }, (_, i) => (
        <SkeletonLoader key={i} variant="text" width={`${100 / columns}%`} height="16px" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-md mb-sm">
        {Array.from({ length: columns }, (_, j) => (
          <SkeletonLoader key={j} variant="text" width={`${100 / columns}%`} height="16px" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
