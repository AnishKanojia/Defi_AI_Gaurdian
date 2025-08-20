import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Security from '@mui/icons-material/Security';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/Error';
import { subscribeToMonitoredContracts, MonitoredContract } from '../services/contracts.ts';
import { useAlerts } from '../context/AlertContext.tsx';

const riskColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'error';
};

const getRiskIcon = (score: number) => {
  if (score < 40) return <CheckCircle sx={{ color: '#00FF88' }} />;
  if (score < 70) return <Warning sx={{ color: '#FFA502' }} />;
  return <Error sx={{ color: '#FF4757' }} />;
};

const RiskDashboard: React.FC = () => {
  const [contracts, setContracts] = useState<MonitoredContract[]>([]);
  const { alerts } = useAlerts();

  useEffect(() => {
    const unsub = subscribeToMonitoredContracts(100, setContracts);
    return () => unsub();
  }, []);

  const latestAlerts = useMemo(() => alerts.slice(0, 10), [alerts]);

  // Mock data for demonstration
  const mockContracts: MonitoredContract[] = [
    { id: '1', address: '0x1234...5678', name: 'Uniswap V3', riskScore: 85, lastUpdated: new Date() },
    { id: '2', address: '0x8765...4321', name: 'Aave V3', riskScore: 45, lastUpdated: new Date() },
    { id: '3', address: '0x1111...2222', name: 'Compound V3', riskScore: 65, lastUpdated: new Date() },
    { id: '4', address: '0x3333...4444', name: 'Curve Finance', riskScore: 25, lastUpdated: new Date() },
    { id: '5', address: '0x5555...6666', name: 'Balancer V2', riskScore: 75, lastUpdated: new Date() },
  ];

  const displayContracts = contracts.length > 0 ? contracts : mockContracts;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          #0A0A0A
        `,
        backgroundAttachment: 'fixed',
        py: 4,
      }}
    >
      <Container maxWidth={false}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Risk Scoring Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Monitor contract risks and live security alerts in real-time
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Monitored Contracts */}
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 212, 255, 0.2)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Security sx={{ fontSize: 32, color: '#000000' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                  Monitored Contracts
                </Typography>
              </Box>
              <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
                <List sx={{ p: 0 }}>
                  {displayContracts.map((contract, index) => (
                    <ListItem 
                      key={contract.id} 
                      divider={index < displayContracts.length - 1}
                      sx={{
                        px: 3,
                        py: 2,
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.05)',
                        }
                      }}
                      secondaryAction={
                        <Chip 
                          size="small" 
                          color={riskColor(contract.riskScore)} 
                          label={`${contract.riskScore}`}
                          icon={getRiskIcon(contract.riskScore)}
                          sx={{
                            fontWeight: 600,
                            borderRadius: '12px',
                          }}
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                            {contract.name || contract.address}
                          </Typography>
                        }
                        secondary={
                          contract.name && (
                            <Typography variant="body2" sx={{ color: '#B3B3B3', fontFamily: 'monospace' }}>
                              {contract.address}
                            </Typography>
                          )
                        }
                      />
                    </ListItem>
                  ))}
                  {!displayContracts.length && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                        No contracts monitored yet.
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Live Alerts */}
          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 136, 0.2)',
                overflow: 'hidden',
                position: 'relative',
                height: '100%',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00FF88 0%, #8B5CF6 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Warning sx={{ fontSize: 32, color: '#000000' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                  Live Alerts
                </Typography>
              </Box>
              <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
                <List sx={{ p: 0 }}>
                  {latestAlerts.length > 0 ? (
                    latestAlerts.map((alert, index) => (
                      <ListItem 
                        key={alert.id} 
                        alignItems="flex-start" 
                        divider={index < latestAlerts.length - 1}
                        sx={{
                          px: 3,
                          py: 2,
                          '&:hover': {
                            background: 'rgba(0, 255, 136, 0.05)',
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                              {alert.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ color: '#B3B3B3', mb: 1 }}>
                                {alert.message}
                              </Typography>
                              {typeof alert.metadata?.riskScore === 'number' && (
                                <Chip 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(0, 212, 255, 0.1)',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                    color: '#00D4FF',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                  }} 
                                  label={`Risk: ${alert.metadata.riskScore}`} 
                                  color={riskColor(alert.metadata.riskScore)} 
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                        No alerts at the moment. All systems are secure! 🛡️
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            🔴 Demo Mode: This dashboard updates live as alerts stream in and monitored contract risk scores change.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RiskDashboard;


