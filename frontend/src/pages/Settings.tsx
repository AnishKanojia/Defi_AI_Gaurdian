import React from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Avatar,
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useSettings } from "../context/SettingsContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { auth } from "../firebase.ts";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { useTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaletteIcon from "@mui/icons-material/Palette";
import Logo from "../components/Logo.tsx";

const Settings: React.FC = () => {
  const { settings, update } = useSettings();
  const { currentUser, signOut } = useAuth();
  const theme = useTheme();

  const toggleDarkMode = () => update({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  const toggleEmail = () =>
    update({ notifications: { ...settings.notifications, email: !settings.notifications.email } });
  const togglePush = () =>
    update({ notifications: { ...settings.notifications, push: !settings.notifications.push } });
  const toggleSms = () =>
    update({ notifications: { ...settings.notifications, sms: !settings.notifications.sms } });
  const toggleProfileVisible = () =>
    update({ privacy: { ...settings.privacy, profileVisible: !settings.privacy.profileVisible } });
  const toggleTwoFactor = () => update({ twoFactorEnabled: !settings.twoFactorEnabled });

  const onChangePassword = async () => {
    try {
      const email = currentUser?.email;
      if (!email) {
        window.alert("No email associated with this account.");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      window.alert("Password reset email sent.");
    } catch (e: any) {
      window.alert(e?.message || "Failed to send reset email");
    }
  };

  const onDeleteAccount = async () => {
    try {
      if (!currentUser) return;
      const confirmed = window.confirm("This will permanently delete your account. Continue?");
      if (!confirmed) return;
      await deleteUser(currentUser);
      window.alert("Account deleted");
    } catch (e: any) {
      window.alert(e?.message || "Failed to delete account. You may need to reauthenticate.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Logo variant="full" size="large" color="gradient" showTagline={true} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mt: 2,
          }}
        >
          Customize your CryptoVault Sentinel experience
        </Typography>
      </Box>

      {/* Profile Section */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: '20px',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(99, 102, 241, 0.2)' 
            : 'rgba(99, 102, 241, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccountCircleIcon sx={{ color: '#6366f1', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Profile Information
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              alt={currentUser?.displayName || "User Profile"}
              src={currentUser?.photoURL || "https://i.pravatar.cc/150?img=3"}
              sx={{ 
                width: 80, 
                height: 80,
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {currentUser?.displayName || "Anonymous User"}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                {currentUser?.email || "no-email@example.com"}
              </Typography>
              <Button
                variant="outlined"
                size="medium"
                sx={{ 
                  textTransform: "none",
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  borderWidth: '2px',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: '20px',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(99, 102, 241, 0.2)' 
            : 'rgba(99, 102, 241, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PaletteIcon sx={{ color: '#6366f1', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Preferences
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, opacity: 0.3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PaletteIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Theme
                </Typography>
              </Box>
              <ToggleButtonGroup
                color="primary"
                exclusive
                size="large"
                value={settings.theme || (settings.darkMode ? 'dark' : 'light')}
                onChange={(e, v) => v && update({ theme: v })}
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    border: `2px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(99, 102, 241, 0.2)' 
                      : 'rgba(99, 102, 241, 0.1)'}`,
                    '&.Mui-selected': {
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ToggleButton value="light">Light</ToggleButton>
                <ToggleButton value="dark">Dark</ToggleButton>
                <ToggleButton value="system">System</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LanguageIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Language
                </Typography>
              </Box>
              <TextField 
                fullWidth 
                size="medium" 
                select 
                value={settings.language || 'en'} 
                onChange={(e) => update({ language: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              >
                {[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'hi', label: 'Hindi' },
                ].map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MonetizationOnIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Currency
                </Typography>
              </Box>
              <TextField 
                fullWidth 
                size="medium" 
                select 
                value={settings.currency || 'USD'} 
                onChange={(e) => update({ currency: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              >
                {[
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'BTC', label: 'BTC - Bitcoin' },
                  { value: 'INR', label: 'INR - Indian Rupee' },
                ].map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: '20px',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(16, 185, 129, 0.2)' 
            : 'rgba(16, 185, 129, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <NotificationsIcon sx={{ color: '#10b981', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, opacity: 0.3 }} />
          <List sx={{ p: 0 }}>
            {[
              { key: 'email', label: 'Email Notifications', icon: '📧' },
              { key: 'push', label: 'Push Notifications', icon: '🔔' },
              { key: 'sms', label: 'SMS Alerts', icon: '📱' },
            ].map((item) => (
              <ListItem 
                key={item.key}
                sx={{ 
                  borderRadius: '12px', 
                  mb: 1, 
                  p: 2,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : 'rgba(16, 185, 129, 0.02)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(16, 185, 129, 0.05)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                  <Typography variant="h6">{item.icon}</Typography>
                </Box>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Receive {item.label.toLowerCase()} for important updates
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                    onChange={
                      item.key === 'email' ? toggleEmail :
                      item.key === 'push' ? togglePush :
                      toggleSms
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10b981',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#10b981',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: '20px',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(239, 68, 68, 0.2)' 
            : 'rgba(239, 68, 68, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(239, 68, 68, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SecurityIcon sx={{ color: '#ef4444', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Privacy & Security
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, opacity: 0.3 }} />
          <List sx={{ p: 0 }}>
            {[
              { key: 'profileVisible', label: 'Profile Visibility', description: 'Make your profile visible to other users' },
              { key: 'twoFactorEnabled', label: 'Two-Factor Authentication (2FA)', description: 'Add an extra layer of security to your account' },
            ].map((item) => (
              <ListItem 
                key={item.key}
                sx={{ 
                  borderRadius: '12px', 
                  mb: 1, 
                  p: 2,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(239, 68, 68, 0.05)' 
                    : 'rgba(239, 68, 68, 0.02)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(239, 68, 68, 0.05)',
                  },
                }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {item.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={
                      item.key === 'profileVisible' ? toggleProfileVisible :
                      toggleTwoFactor
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ef4444',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ef4444',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: '20px',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(99, 102, 241, 0.2)' 
            : 'rgba(99, 102, 241, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccountCircleIcon sx={{ color: '#6366f1', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Account Actions
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, opacity: 0.3 }} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onChangePassword}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Change Password
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={signOut}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                borderWidth: '2px',
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.main,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Logout
            </Button>
            <Button 
              variant="text" 
              color="error" 
              onClick={onDeleteAccount}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings;
