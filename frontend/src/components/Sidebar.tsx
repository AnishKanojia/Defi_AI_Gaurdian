import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', to: '/', icon: <DashboardOutlinedIcon /> },
  { label: 'Monitoring', to: '/monitoring', icon: <TimelineOutlinedIcon /> },
  { label: 'Alerts', to: '/alerts', icon: <ReportProblemOutlinedIcon /> },
  { label: 'Analytics', to: '/analytics', icon: <InsightsOutlinedIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const drawerWidth = open ? 240 : 64;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          background: 'linear-gradient(180deg, #111 0%, #0d0d0d 100%)',
          borderRight: '1px solid #222',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ px: open ? 2 : 0, py: 2 }}>
        {open && (
          <Typography variant="overline" sx={{ color: '#7a7a7a', letterSpacing: 1 }}>
            Navigation
          </Typography>
        )}
      </Box>
      <List sx={{ py: 0 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={(theme) => ({
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 1.5,
                '&.active': {
                  backgroundColor: '#1f1f1f',
                  borderLeft: '3px solid #00d4aa',
                },
                '&:hover': { backgroundColor: '#1a1a1a' },
              })}
            >
              <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 1.5 : 'auto',
                justifyContent: 'center',
                color: '#c9c9c9',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: '#c9c9c9',
                  opacity: open ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: '#222', mt: 'auto' }} />
    </Drawer>
  );
};

export default Sidebar;
