// TaskFlow Design System Tokens
// Version 2.0 - Professional Design System

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Primary - Professional Blue
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB', // Main primary
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3A70',
  },

  // Accent - Refined Green
  accent: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Main accent
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Team Collaboration - Purple
  team: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Main team color
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Status Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },

  // Priority Colors
  priority: {
    high: '#EF4444',    // Red
    medium: '#F59E0B',  // Orange
    low: '#10B981',     // Green
  },

  // Neutral Colors (Light Mode)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',      // Warm background
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Dark Mode Overrides
  dark: {
    bg: {
      primary: '#0F172A',   // Deep blue-black
      secondary: '#1E293B', // Card background
      tertiary: '#334155',  // Elevated surfaces
    },
    text: {
      primary: '#F1F5F9',   // Almost white
      secondary: '#CBD5E1', // Muted text
      tertiary: '#94A3B8',  // Disabled text
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
    },
  },
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Consolas", "Monaco", monospace',
  },

  fontSize: {
    h1: '28px',
    h2: '22px',
    h3: '18px',
    body: '15px',
    small: '13px',
    caption: '12px',
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    h1: 1.2,
    h2: 1.3,
    h3: 1.4,
    body: 1.6,
    small: 1.4,
    caption: 1.4,
  },

  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
  },
};

// ============================================
// SPACING (8px Grid System)
// ============================================

export const spacing = {
  xs: '8px',      // 1 unit
  sm: '16px',     // 2 units
  md: '24px',     // 3 units
  lg: '32px',     // 4 units
  xl: '48px',     // 6 units
  '2xl': '64px',  // 8 units
  '3xl': '96px',  // 12 units
};

// Component-specific spacing
export const componentSpacing = {
  navbar: {
    height: '64px',
    paddingX: '24px',
  },
  sidebar: {
    width: '280px',
    paddingX: '24px',
    paddingY: '16px',
  },
  card: {
    padding: '24px',
    gap: '16px',
  },
  button: {
    paddingY: '12px',
    paddingX: '24px',
    gap: '8px',
  },
  input: {
    height: '48px',
    paddingX: '16px',
  },
  modal: {
    padding: '32px',
    gap: '24px',
  },
};

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Dark mode shadows (more subtle)
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
  },
};

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  properties: {
    colors: 'background-color, border-color, color, fill, stroke',
    opacity: 'opacity',
    shadow: 'box-shadow',
    transform: 'transform',
    all: 'all',
  },
};

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// EXPORT UTILITIES
// ============================================

// CSS Variable generator helper
export const generateCSSVariables = () => {
  const cssVars = {
    // Colors
    '--color-primary': colors.primary[500],
    '--color-primary-hover': colors.primary[600],
    '--color-primary-light': colors.primary[50],
    
    '--color-accent': colors.accent[500],
    '--color-accent-hover': colors.accent[600],
    '--color-accent-light': colors.accent[50],
    
    '--color-team': colors.team[500],
    '--color-team-hover': colors.team[600],
    '--color-team-light': colors.team[50],
    
    '--color-success': colors.success[500],
    '--color-warning': colors.warning[500],
    '--color-danger': colors.danger[500],
    '--color-info': colors.info[500],
    
    // Priority
    '--color-priority-high': colors.priority.high,
    '--color-priority-medium': colors.priority.medium,
    '--color-priority-low': colors.priority.low,
    
    // Neutral
    '--color-bg-primary': colors.neutral[50],
    '--color-bg-secondary': colors.neutral[0],
    '--color-bg-tertiary': colors.neutral[100],
    
    '--color-text-primary': colors.neutral[900],
    '--color-text-secondary': colors.neutral[600],
    '--color-text-tertiary': colors.neutral[500],
    
    '--color-border': colors.neutral[200],
    '--color-border-hover': colors.neutral[300],
    
    // Typography
    '--font-family': typography.fontFamily.primary,
    '--font-size-h1': typography.fontSize.h1,
    '--font-size-h2': typography.fontSize.h2,
    '--font-size-h3': typography.fontSize.h3,
    '--font-size-body': typography.fontSize.body,
    '--font-size-small': typography.fontSize.small,
    '--font-size-caption': typography.fontSize.caption,
    
    // Spacing
    '--spacing-xs': spacing.xs,
    '--spacing-sm': spacing.sm,
    '--spacing-md': spacing.md,
    '--spacing-lg': spacing.lg,
    '--spacing-xl': spacing.xl,
    '--spacing-2xl': spacing['2xl'],
    
    // Border Radius
    '--radius-sm': borderRadius.sm,
    '--radius-md': borderRadius.md,
    '--radius-lg': borderRadius.lg,
    '--radius-full': borderRadius.full,
    
    // Shadows
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--shadow-xl': shadows.xl,
    
    // Transitions
    '--transition-fast': transitions.fast,
    '--transition-base': transitions.base,
    '--transition-slow': transitions.slow,
  };
  
  return cssVars;
};

export default {
  colors,
  typography,
  spacing,
  componentSpacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  generateCSSVariables,
};
