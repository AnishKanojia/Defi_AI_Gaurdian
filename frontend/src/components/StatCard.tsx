import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string; // hex or theme color
  minHeight?: number; // for consistent alignment
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = '#00d4aa', minHeight = 140 }) => {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, #151515 0%, #0f0f0f 100%)',
      border: '1px solid #2c2c2c',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      minHeight,
    }} className="hover-card">
      <Box sx={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: `${color}22` }} />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {icon && <Box sx={{ color }}>{icon}</Box>}
          <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#b0b0b0' }}>{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#8a8a8a', mt: 0.5 }}>{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
