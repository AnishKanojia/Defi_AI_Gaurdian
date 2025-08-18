import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#101010', borderBottom: '1px solid #232323', boxShadow: 'none', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800 }}>
          <span style={{ color: '#00d4aa' }}>DeFi</span> Guardian AI
        </Typography>
        <Box>
          {currentUser ? (
            <Button variant="outlined" color="inherit" onClick={signOut} sx={{ borderColor: '#2c2c2c' }}>
              Sign out
            </Button>
          ) : (
            <Button variant="contained" onClick={() => navigate('/signin')} sx={{ backgroundColor: '#00d4aa', color: '#000', fontWeight: 700, '&:hover': { backgroundColor: '#00c4a0' } }}>
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
