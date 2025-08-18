import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { io, Socket } from 'socket.io-client';

// Components
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Monitoring from './pages/Monitoring.tsx';
import Alerts from './pages/Alerts.tsx';
import Analytics from './pages/Analytics.tsx';
import Settings from './pages/Settings.tsx';
import SignIn from './pages/SignIn.tsx';

// Context
import { AlertContext } from './context/AlertContext.tsx';
import { SocketContext } from './context/SocketContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

// Types
import { Alert } from './types/Alert';

// Firebase Alerts Service
import { subscribeToAlerts, addAlert as addAlertToFirestore } from './services/alerts.ts';

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Subscribe to Firestore alerts
    const unsubscribe = subscribeToAlerts(100, (items) => {
      setAlerts(items);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('alert', async (alert: Alert) => {
      // Add to local state (optimistic)
      setAlerts(prev => [alert, ...prev.slice(0, 99)]);
      try {
        await addAlertToFirestore(alert);
      } catch (e) {
        console.error('Failed to persist alert to Firestore', e);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    addAlertToFirestore(alert).catch(() => undefined);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <AuthProvider>
      <SocketContext.Provider value={{ socket }}>
        <AlertContext.Provider value={{ alerts, addAlert, clearAlerts }}>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

              <Container maxWidth={false} sx={{ flexGrow: 1, py: 3, pr: 3, pl: 0 }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/signin" element={<SignIn />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </AlertContext.Provider>
      </SocketContext.Provider>
    </AuthProvider>
  );
};

export default App;
