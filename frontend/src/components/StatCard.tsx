import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string; // hex or theme color
  minHeight?: number; // for consistent alignment
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = '#6366f1', 
  minHeight = 160, 
  onClick,
  trend,
  trendValue 
}) => {
  const theme = useTheme();
  
  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <Card 
      onClick={onClick} 
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(30, 41, 59, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${theme.palette.mode === 'dark' 
          ? 'rgba(99, 102, 241, 0.15)' 
          : 'rgba(99, 102, 241, 0.1)'}`,
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        minHeight,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        '&:hover': onClick ? { 
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)'
            : '0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.1)',
        } : undefined,
      }}
      className="card-hover"
    >
      {/* Background gradient circle */}
      <Box 
        sx={{ 
          position: 'absolute', 
          right: -40, 
          top: -40, 
          width: 140, 
          height: 140, 
          borderRadius: '50%', 
          background: `radial-gradient(circle, ${color}15 0%, ${color}05 70%, transparent 100%)`,
          opacity: 0.6,
        }} 
      />
      
      {/* Accent line */}
      <Box 
        sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          width: '4px', 
          background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
          borderRadius: '2px',
        }} 
      />

      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box 
                sx={{ 
                  color: color,
                  p: 1.5,
                  borderRadius: '12px',
                  background: `${color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
            )}
            <Typography 
              variant="overline" 
              sx={{ 
                letterSpacing: 1.2, 
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {trend && trendValue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: getTrendColor(),
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {getTrendIcon()} {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800,
            mb: 1,
            background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.5rem',
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary, 
              mt: 1,
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
