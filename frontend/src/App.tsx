import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { AlertContext } from './context/AlertContext';
import { SettingsProvider } from './context/SettingsContext';
import { WalletProvider } from './context/WalletContext';

// Components
import Header from './components/Header';
import ChatbotFab from './components/ChatbotFab';

// Pages
import Dashboard from './pages/Dashboard';
import RiskDashboard from './pages/RiskDashboard';
import Contracts from './pages/Contracts';
import Wallet from './pages/Wallet';
import Markets from './pages/Markets';
import SecurityCenter from './pages/SecurityCenter';
import FeaturePage from './pages/Feature';
import SignIn from './pages/SignIn';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';

// Theme
import { theme } from './theme/theme';

// Config
import { API_BASE } from './config';

// Socket.IO connection
const socket = io(API_BASE);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: '#0A0A0A',
          color: '#FFFFFF'
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SettingsProvider>
          <AlertContext.Provider value={{ alerts: [], addAlert: () => {}, clearAlerts: () => {} }}>
            <WalletProvider>
              <Router>
                <div className="App">
                  {isAuthenticated ? (
                    <>
                      <Header />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/risk" element={<RiskDashboard />} />
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/markets" element={<Markets />} />
                        <Route path="/security" element={<SecurityCenter />} />
                        <Route path="/feature/:slug" element={<FeaturePage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                      <ChatbotFab />
                    </>
                  ) : (
                    <Routes>
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="*" element={<Navigate to="/signin" replace />} />
                    </Routes>
                  )}
                </div>
              </Router>
            </WalletProvider>
          </AlertContext.Provider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
