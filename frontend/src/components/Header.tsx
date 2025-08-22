import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Security from '@mui/icons-material/Security';
import Dashboard from '@mui/icons-material/Dashboard';
import Analytics from '@mui/icons-material/Analytics';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Wallet from '@mui/icons-material/Wallet';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Shield from '@mui/icons-material/Shield';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useAlerts } from '../context/AlertContext.tsx';
import { useWallet } from '../context/WalletContext.tsx';
import Logo from './Logo.tsx';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  const { alerts } = useAlerts();
  const { account, balanceWei, connect, isCorrectChain } = useWallet();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const unreadAlerts = alerts.filter(alert => !alert.acknowledged).length;
  const isConnected = !!account;
  const balance = balanceWei ? parseFloat(balanceWei) / 10**18 : 0;

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/risk', label: 'Risk Dashboard', icon: <Security /> },
    { path: '/contracts', label: 'Contracts', icon: <Shield /> },
    { path: '/markets', label: 'Markets', icon: <TrendingUp /> },
    { path: '/analytics', label: 'Analytics', icon: <Analytics /> },
    { path: '/alerts', label: 'Alerts', icon: <NotificationsIcon /> },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Logo variant="compact" size="medium" color="primary" showTagline={false} />
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: isActiveRoute(item.path) ? '#00D4FF' : '#B3B3B3',
                  background: isActiveRoute(item.path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  border: isActiveRoute(item.path) ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid transparent',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderColor: '#00D4FF',
                    color: '#00D4FF',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          {/* Wallet Connection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isConnected ? (
              <Chip
                icon={<Wallet />}
                label={`${balance.toFixed(4)} BNB`}
                onClick={() => navigate('/wallet')}
                sx={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  color: '#00FF88',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderColor: '#00FF88',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ) : (
              <Button
                variant="outlined"
                startIcon={<Wallet />}
                onClick={connect}
                sx={{
                  borderColor: '#00D4FF',
                  color: '#00D4FF',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderColor: '#00D4FF',
                    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
                  },
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Box>

          {/* Alerts Badge */}
          <IconButton
            color="inherit"
            onClick={() => handleNavigation('/alerts')}
            sx={{
              color: '#B3B3B3',
              '&:hover': {
                color: '#00D4FF',
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            <Badge badgeContent={unreadAlerts} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Profile */}
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              color: '#B3B3B3',
              '&:hover': {
                color: '#00D4FF',
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            {currentUser?.photoURL ? (
              <Avatar src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '16px',
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={() => handleNavigation('/settings')} sx={{ color: '#FFFFFF' }}>
            <Settings sx={{ mr: 2, color: '#00D4FF' }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleSignOut} sx={{ color: '#FFFFFF' }}>
            <Logout sx={{ mr: 2, color: '#FF4757' }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '16px',
              mt: 1,
              minWidth: 250,
            },
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                color: isActiveRoute(item.path) ? '#00D4FF' : '#FFFFFF',
                background: isActiveRoute(item.path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              {item.icon}
              <Typography sx={{ ml: 2 }}>{item.label}</Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={() => handleNavigation('/settings')} sx={{ color: '#FFFFFF' }}>
            <Settings sx={{ mr: 2, color: '#00D4FF' }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleSignOut} sx={{ color: '#FFFFFF' }}>
            <Logout sx={{ mr: 2, color: '#FF4757' }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
