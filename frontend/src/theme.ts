import { createTheme, ThemeOptions } from '@mui/material/styles';

export const buildTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  const palette: ThemeOptions['palette'] = {
    mode,
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Emerald green
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: isDark ? '#0f172a' : '#f8fafc',
      paper: isDark ? '#1e293b' : '#ffffff',
    },
    surface: {
      main: isDark ? '#334155' : '#f1f5f9',
      light: isDark ? '#475569' : '#e2e8f0',
    },
    text: {
      primary: isDark ? '#f8fafc' : '#0f172a',
      secondary: isDark ? '#cbd5e1' : '#475569',
      disabled: isDark ? '#64748b' : '#94a3b8',
    },
    divider: isDark ? '#334155' : '#e2e8f0',
    action: {
      active: isDark ? '#6366f1' : '#6366f1',
      hover: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
      selected: isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.08)',
    },
  };

  const components: ThemeOptions['components'] = {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: {
          backgroundImage: isDark
            ? 'radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,.08), transparent), radial-gradient(1200px 600px at 10% 20%, rgba(16,185,129,.06), transparent)'
            : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          backgroundAttachment: 'fixed',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: isDark ? '#1e293b' : '#f1f5f9',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: isDark ? '#475569' : '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            background: isDark ? '#6366f1' : '#6366f1',
          },
        },
      }),
    },
    MuiButton: {
      defaultProps: { 
        disableElevation: true,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          '&:hover': {
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
          },
        },
        text: {
          color: isDark ? '#6366f1' : '#6366f1',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'}`,
          background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark 
              ? '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)'
              : '0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: isDark 
            ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
            : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: isDark 
            ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: isDark 
            ? '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
          borderBottom: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}`,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: '28px',
        },
        colorPrimary: {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#6366f1',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        },
        colorSecondary: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        outlined: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}`,
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            borderColor: '#6366f1',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            borderBottom: `2px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}`,
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)',
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#6366f1',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'}`,
          borderRadius: 12,
          fontSize: '0.75rem',
          boxShadow: isDark 
            ? '0 10px 25px rgba(0, 0, 0, 0.3)'
            : '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          color: isDark ? '#1e293b' : '#ffffff',
        },
      },
    },
  };

  const typography: ThemeOptions['typography'] = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: isDark ? '#cbd5e1' : '#475569',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: isDark ? '#cbd5e1' : '#475569',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: isDark ? '#f1f5f9' : '#1e293b',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: isDark ? '#cbd5e1' : '#64748b',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: isDark ? '#6366f1' : '#6366f1',
    },
  };

  const shape: ThemeOptions['shape'] = {
    borderRadius: 12,
  };

  const shadows: ThemeOptions['shadows'] = [
    'none',
    isDark 
      ? '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 4px 1px rgba(0, 0, 0, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 8px 1px rgba(0, 0, 0, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 8px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px 1px rgba(0, 0, 0, 0.2)'
      : '0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px 1px rgba(0, 0, 0, 0.2)'
      : '0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 6px 12px rgba(0, 0, 0, 0.3), 0 12px 24px 1px rgba(0, 0, 0, 0.2)'
      : '0 6px 12px rgba(0, 0, 0, 0.05), 0 12px 24px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 8px 16px rgba(0, 0, 0, 0.3), 0 16px 32px 1px rgba(0, 0, 0, 0.2)'
      : '0 8px 16px rgba(0, 0, 0, 0.05), 0 16px 32px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 12px 24px rgba(0, 0, 0, 0.3), 0 24px 48px 1px rgba(0, 0, 0, 0.2)'
      : '0 12px 24px rgba(0, 0, 0, 0.05), 0 24px 48px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 16px 32px rgba(0, 0, 0, 0.3), 0 32px 64px 1px rgba(0, 0, 0, 0.2)'
      : '0 16px 32px rgba(0, 0, 0, 0.05), 0 32px 64px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 24px 48px rgba(0, 0, 0, 0.3), 0 48px 96px 1px rgba(0, 0, 0, 0.2)'
      : '0 24px 48px rgba(0, 0, 0, 0.05), 0 48px 96px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 32px 64px rgba(0, 0, 0, 0.3), 0 64px 128px 1px rgba(0, 0, 0, 0.2)'
      : '0 32px 64px rgba(0, 0, 0, 0.05), 0 64px 128px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 40px 80px rgba(0, 0, 0, 0.3), 0 80px 160px 1px rgba(0, 0, 0, 0.2)'
      : '0 40px 80px rgba(0, 0, 0, 0.05), 0 80px 160px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 48px 96px rgba(0, 0, 0, 0.3), 0 96px 192px 1px rgba(0, 0, 0, 0.2)'
      : '0 48px 96px rgba(0, 0, 0, 0.05), 0 96px 192px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 56px 112px rgba(0, 0, 0, 0.3), 0 112px 224px 1px rgba(0, 0, 0, 0.2)'
      : '0 56px 112px rgba(0, 0, 0, 0.05), 0 112px 224px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 64px 128px rgba(0, 0, 0, 0.3), 0 128px 256px 1px rgba(0, 0, 0, 0.2)'
      : '0 64px 128px rgba(0, 0, 0, 0.05), 0 128px 256px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 72px 144px rgba(0, 0, 0, 0.3), 0 144px 288px 1px rgba(0, 0, 0, 0.2)'
      : '0 72px 144px rgba(0, 0, 0, 0.05), 0 144px 288px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 80px 160px rgba(0, 0, 0, 0.3), 0 160px 320px 1px rgba(0, 0, 0, 0.2)'
      : '0 80px 160px rgba(0, 0, 0, 0.05), 0 160px 320px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 88px 176px rgba(0, 0, 0, 0.3), 0 176px 352px 1px rgba(0, 0, 0, 0.2)'
      : '0 88px 176px rgba(0, 0, 0, 0.05), 0 176px 352px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 96px 192px rgba(0, 0, 0, 0.3), 0 192px 384px 1px rgba(0, 0, 0, 0.2)'
      : '0 96px 192px rgba(0, 0, 0, 0.05), 0 192px 384px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 104px 208px rgba(0, 0, 0, 0.3), 0 208px 416px 1px rgba(0, 0, 0, 0.2)'
      : '0 104px 208px rgba(0, 0, 0, 0.05), 0 208px 416px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 112px 224px rgba(0, 0, 0, 0.3), 0 224px 448px 1px rgba(0, 0, 0, 0.2)'
      : '0 112px 224px rgba(0, 0, 0, 0.05), 0 224px 448px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 120px 240px rgba(0, 0, 0, 0.3), 0 240px 480px 1px rgba(0, 0, 0, 0.2)'
      : '0 120px 240px rgba(0, 0, 0, 0.05), 0 240px 480px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 128px 256px rgba(0, 0, 0, 0.3), 0 256px 512px 1px rgba(0, 0, 0, 0.2)'
      : '0 128px 256px rgba(0, 0, 0, 0.05), 0 256px 512px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 136px 272px rgba(0, 0, 0, 0.3), 0 272px 544px 1px rgba(0, 0, 0, 0.2)'
      : '0 136px 272px rgba(0, 0, 0, 0.05), 0 272px 544px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 144px 288px rgba(0, 0, 0, 0.3), 0 288px 576px 1px rgba(0, 0, 0, 0.2)'
      : '0 144px 288px rgba(0, 0, 0, 0.05), 0 288px 576px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 152px 304px rgba(0, 0, 0, 0.3), 0 304px 608px 1px rgba(0, 0, 0, 0.2)'
      : '0 152px 304px rgba(0, 0, 0, 0.05), 0 304px 608px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 160px 320px rgba(0, 0, 0, 0.3), 0 320px 640px 1px rgba(0, 0, 0, 0.2)'
      : '0 160px 320px rgba(0, 0, 0, 0.05), 0 320px 640px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 168px 336px rgba(0, 0, 0, 0.3), 0 336px 672px 1px rgba(0, 0, 0, 0.2)'
      : '0 168px 336px rgba(0, 0, 0, 0.05), 0 336px 672px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 176px 352px rgba(0, 0, 0, 0.3), 0 352px 704px 1px rgba(0, 0, 0, 0.2)'
      : '0 176px 352px rgba(0, 0, 0, 0.05), 0 352px 704px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 184px 368px rgba(0, 0, 0, 0.3), 0 368px 736px 1px rgba(0, 0, 0, 0.2)'
      : '0 184px 368px rgba(0, 0, 0, 0.05), 0 368px 736px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 192px 384px rgba(0, 0, 0, 0.3), 0 384px 768px 1px rgba(0, 0, 0, 0.2)'
      : '0 192px 384px rgba(0, 0, 0, 0.05), 0 384px 768px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 200px 400px rgba(0, 0, 0, 0.3), 0 400px 800px 1px rgba(0, 0, 0, 0.2)'
      : '0 200px 400px rgba(0, 0, 0, 0.05), 0 400px 800px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 208px 416px rgba(0, 0, 0, 0.3), 0 416px 832px 1px rgba(0, 0, 0, 0.2)'
      : '0 208px 416px rgba(0, 0, 0, 0.05), 0 416px 832px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 216px 432px rgba(0, 0, 0, 0.3), 0 432px 864px 1px rgba(0, 0, 0, 0.2)'
      : '0 216px 432px rgba(0, 0, 0, 0.05), 0 432px 864px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 224px 448px rgba(0, 0, 0, 0.3), 0 448px 896px 1px rgba(0, 0, 0, 0.2)'
      : '0 224px 448px rgba(0, 0, 0, 0.05), 0 448px 896px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 232px 464px rgba(0, 0, 0, 0.3), 0 464px 928px 1px rgba(0, 0, 0, 0.2)'
      : '0 232px 464px rgba(0, 0, 0, 0.05), 0 464px 928px 1px rgba(0, 0, 0, 0.1)',
    isDark 
      ? '0 240px 480px rgba(0, 0, 0, 0.3), 0 480px 960px 1px rgba(0, 0, 0, 0.2)'
      : '0 240px 480px rgba(0, 0, 0, 0.05), 0 480px 960px 1px rgba(0, 0, 0, 0.1)',
  ];

  return createTheme({ 
    palette, 
    components, 
    typography, 
    shape,
    shadows,
    spacing: 8,
  });
};


