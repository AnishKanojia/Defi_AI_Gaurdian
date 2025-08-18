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
} from "@mui/material";

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [pushNotif, setPushNotif] = React.useState(false);
  const [smsNotif, setSmsNotif] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(true);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Profile Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              alt="User Profile"
              src="https://i.pravatar.cc/150?img=3"
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2" color="text.secondary">
                johndoe@email.com
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2, textTransform: "none" }}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Theme Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Appearance</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem>
              <ListItemText primary="Dark Mode" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Notifications</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem>
              <ListItemText primary="Email Notifications" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Push Notifications" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={pushNotif}
                  onChange={() => setPushNotif(!pushNotif)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="SMS Alerts" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={smsNotif}
                  onChange={() => setSmsNotif(!smsNotif)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Privacy</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem>
              <ListItemText primary="Profile Visibility" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={profileVisible}
                  onChange={() => setProfileVisible(!profileVisible)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Two-Factor Authentication (2FA)" />
              <ListItemSecondaryAction>
                <Switch edge="end" />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Account</Typography>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" flexDirection="column" gap={1}>
            <Button variant="contained" color="primary">
              Change Password
            </Button>
            <Button variant="outlined" color="error">
              Logout
            </Button>
            <Button variant="text" color="error">
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings;
