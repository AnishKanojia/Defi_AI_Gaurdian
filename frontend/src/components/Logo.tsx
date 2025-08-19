import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import { SvgIcon } from '@mui/material';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'gradient' | 'white';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'medium', 
  color = 'gradient',
  showTagline = true 
}) => {
  const theme = useTheme();
  
  const getSize = () => {
    switch (size) {
      case 'small': return { icon: 24, text: 'h6', tagline: 'caption' };
      case 'large': return { icon: 48, text: 'h3', tagline: 'h6' };
      default: return { icon: 32, text: 'h5', tagline: 'subtitle2' };
    }
  };
  
  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'white':
        return '#ffffff';
      case 'gradient':
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)';
    }
  };
  
  const { icon: iconSize, text: textVariant, tagline: taglineVariant } = getSize();
  
  // Custom Shield Icon Component
  const CustomShieldIcon = () => (
    <SvgIcon
      sx={{
        width: iconSize,
        height: iconSize,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      }}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l6 2.67v4.15c0 4.16-2.84 8.02-6 9.32-3.16-1.3-6-5.16-6-9.32V7.85l6-2.67z"
      />
      <path
        fill="currentColor"
        d="M12 6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
      />
      <path
        fill="currentColor"
        d="M12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
      />
    </SvgIcon>
  );

  if (variant === 'icon') {
    return (
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '12px',
          background: getColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
          },
        }}
      >
        <CustomShieldIcon />
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: '12px',
            background: getColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          }}
        >
          <CustomShieldIcon />
        </Box>
        <Typography
          variant={textVariant as any}
          sx={{
            fontWeight: 800,
            color: color === 'gradient' ? 'transparent' : 'inherit',
            background: color === 'gradient' ? getColor() : 'none',
            WebkitBackgroundClip: color === 'gradient' ? 'text' : 'none',
            WebkitTextFillColor: color === 'gradient' ? 'transparent' : 'inherit',
            backgroundClip: color === 'gradient' ? 'text' : 'none',
          }}
        >
          CryptoVault
        </Typography>
      </Box>
    );
  }

  // Full variant
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: '16px',
            background: getColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #6366f1, #10b981, #f59e0b)',
              zIndex: -1,
              opacity: 0.3,
            },
          }}
        >
          <CustomShieldIcon />
        </Box>
        <Box>
          <Typography
            variant={textVariant as any}
            sx={{
              fontWeight: 800,
              color: color === 'gradient' ? 'transparent' : 'inherit',
              background: color === 'gradient' ? getColor() : 'none',
              WebkitBackgroundClip: color === 'gradient' ? 'text' : 'none',
              WebkitTextFillColor: color === 'gradient' ? 'transparent' : 'inherit',
              backgroundClip: color === 'gradient' ? 'text' : 'none',
              lineHeight: 1.2,
            }}
          >
            CryptoVault
          </Typography>
          <Typography
            variant={taglineVariant as any}
            sx={{
              fontWeight: 600,
              color: color === 'white' ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.75em',
            }}
          >
            Sentinel
          </Typography>
        </Box>
      </Box>
      
      {showTagline && (
        <Typography
          variant="caption"
          sx={{
            color: color === 'white' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
            textAlign: 'center',
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          Advanced DeFi Security & Monitoring
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
