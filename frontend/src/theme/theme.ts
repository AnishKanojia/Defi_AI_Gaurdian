import { createTheme, ThemeOptions } from '@mui/material/styles';

// Encrypted Minds inspired color palette
const colors = {
  // Primary colors - Neon blue/cyan
  primary: {
    main: '#00D4FF', // Bright neon cyan
    light: '#33DDFF',
    dark: '#00A3CC',
    contrastText: '#000000',
  },
  // Secondary colors - Neon green
  secondary: {
    main: '#00FF88', // Bright neon green
    light: '#33FFAA',
    dark: '#00CC6A',
    contrastText: '#000000',
  },
  // Accent colors
  accent: {
    purple: '#8B5CF6', // Neon purple
    pink: '#EC4899', // Neon pink
    orange: '#F97316', // Neon orange
    yellow: '#FBBF24', // Neon yellow
  },
  // Background colors - Dark cyberpunk theme
  background: {
    default: '#0A0A0A', // Deep black
    paper: '#111111', // Slightly lighter black
    card: '#1A1A1A', // Card background
    elevated: '#222222', // Elevated elements
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
  },
  // Text colors
  text: {
    primary: '#FFFFFF', // Pure white
    secondary: '#B3B3B3', // Light gray
    disabled: '#666666', // Medium gray
    hint: '#999999', // Lighter gray
  },
  // Border colors
  border: {
    primary: '#00D4FF', // Neon cyan
    secondary: '#00FF88', // Neon green
    subtle: '#333333', // Subtle borders
    accent: '#8B5CF6', // Neon purple
  },
  // Success/Error/Warning colors
  success: {
    main: '#00FF88', // Neon green
    light: '#33FFAA',
    dark: '#00CC6A',
  },
  error: {
    main: '#FF4757', // Bright red
    light: '#FF6B7A',
    dark: '#CC3745',
  },
  warning: {
    main: '#FFA502', // Bright orange
    light: '#FFB733',
    dark: '#CC8401',
  },
  info: {
    main: '#00D4FF', // Neon cyan
    light: '#33DDFF',
    dark: '#00A3CC',
  },
};

// Custom theme options
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: colors.background,
    text: colors.text,
    divider: colors.border.subtle,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: colors.text.secondary,
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
          `,
          backgroundAttachment: 'fixed',
          color: colors.text.primary,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: colors.background.paper,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.border.subtle,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.border.subtle}`,
          '&:hover': {
            borderColor: colors.primary.main,
            boxShadow: `0 12px 40px rgba(0, 212, 255, 0.2), 0 0 0 1px ${colors.primary.main}`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px rgba(0, 212, 255, 0.3)`,
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
          color: '#000000',
          fontWeight: 700,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.secondary.dark} 100%)`,
            boxShadow: `0 8px 25px rgba(0, 212, 255, 0.4)`,
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            borderColor: colors.primary.light,
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            boxShadow: `0 4px 20px rgba(0, 212, 255, 0.2)`,
          },
        },
        text: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.background.elevated,
            borderRadius: 12,
            '& fieldset': {
              borderColor: colors.border.subtle,
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.text.secondary,
            '&.Mui-focused': {
              color: colors.primary.main,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border.subtle}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.paper,
          borderRight: `1px solid ${colors.border.subtle}`,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
            borderLeft: `4px solid ${colors.primary.main}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.elevated,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: 20,
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid`,
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderColor: colors.success.main,
          color: colors.success.main,
        },
        standardError: {
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          borderColor: colors.error.main,
          color: colors.error.main,
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 165, 2, 0.1)',
          borderColor: colors.warning.main,
          color: colors.warning.main,
        },
        standardInfo: {
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderColor: colors.info.main,
          color: colors.info.main,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.elevated,
          borderRadius: 8,
        },
        bar: {
          background: `linear-gradient(90deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
          borderRadius: 8,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            backgroundColor: colors.background.elevated,
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: colors.primary.main,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.text.secondary,
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
          '& .MuiSlider-track': {
            background: `linear-gradient(90deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: colors.primary.main,
            boxShadow: `0 0 20px ${colors.primary.main}`,
          },
        },
      },
    },
  },
};

// Create and export the theme
export const theme = createTheme(themeOptions);

// Export colors for use in components
export { colors };

// Light theme variant (if needed)
export const lightTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
      card: '#FFFFFF',
      elevated: '#F1F3F4',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#999999',
      hint: '#B3B3B3',
    },
    divider: '#E0E0E0',
  },
});
