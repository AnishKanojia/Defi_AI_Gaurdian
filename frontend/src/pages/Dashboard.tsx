import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Warning,
  CheckCircle,
  ArrowForward,
  AccountBalanceWallet,
  Shield,
  Analytics,
  Notifications,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useWallet } from '../context/WalletContext';
import { LineChart } from '@mui/x-charts/LineChart';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { alerts } = useAlerts();
  const { account, balanceWei } = useWallet();

  const [riskScore, setRiskScore] = useState(75);
  const [monitoredContracts, setMonitoredContracts] = useState(12);
  const [totalAlerts, setTotalAlerts] = useState(alerts.length);
  const [highRiskAlerts, setHighRiskAlerts] = useState(
    alerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical').length
  );

  // Mock data for charts
  const chartData = [
    { time: '00:00', value: 65 },
    { time: '04:00', value: 70 },
    { time: '08:00', value: 75 },
    { time: '12:00', value: 80 },
    { time: '16:00', value: 75 },
    { time: '20:00', value: 70 },
    { time: '23:59', value: 75 },
  ];

  const recentAlerts = alerts.slice(0, 5);

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#FF4757';
    if (score >= 60) return '#FFA502';
    if (score >= 40) return '#FBBF24';
    return '#00FF88';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  useEffect(() => {
    setTotalAlerts(alerts.length);
    setHighRiskAlerts(
      alerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical').length
    );
  }, [alerts]);

  const quickActions = [
    {
      title: 'Risk Dashboard',
      description: 'Monitor contract risks',
      icon: <Security sx={{ fontSize: 32, color: '#00D4FF' }} />,
      path: '/risk',
      color: 'rgba(0, 212, 255, 0.1)',
    },
    {
      title: 'Contracts',
      description: 'Manage monitored contracts',
      icon: <Shield sx={{ fontSize: 32, color: '#00FF88' }} />,
      path: '/contracts',
      color: 'rgba(0, 255, 136, 0.1)',
    },
    {
      title: 'Markets',
      description: 'Real-time market data',
      icon: <TrendingUp sx={{ fontSize: 32, color: '#8B5CF6' }} />,
      path: '/markets',
      color: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Analytics',
      description: 'Advanced insights',
      icon: <Analytics sx={{ fontSize: 32, color: '#EC4899' }} />,
      path: '/analytics',
      color: 'rgba(236, 72, 153, 0.1)',
    },
  ];

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
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
            Welcome back, {currentUser?.displayName || 'User'}! 👋
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Here's what's happening with your DeFi security today
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 255, 0.1)',
                '&:hover': {
                  borderColor: '#00D4FF',
                  boxShadow: '0 12px 40px rgba(0, 212, 255, 0.2), 0 0 0 1px #00D4FF',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(0, 212, 255, 0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Security sx={{ fontSize: 28, color: '#00D4FF' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {riskScore}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#B3B3B3', mb: 2 }}>
                  Overall Risk Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={riskScore}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${getRiskColor(riskScore)} 0%, ${getRiskColor(riskScore)}80 100%)`,
                      borderRadius: 4,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#B3B3B3' }}>
                    Low
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B3B3B3' }}>
                    High
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 255, 136, 0.1)',
                '&:hover': {
                  borderColor: '#00FF88',
                  boxShadow: '0 12px 40px rgba(0, 255, 136, 0.2), 0 0 0 1px #00FF88',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(0, 255, 136, 0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Shield sx={{ fontSize: 28, color: '#00FF88' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {monitoredContracts}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                  Monitored Contracts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 165, 2, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 165, 2, 0.1)',
                '&:hover': {
                  borderColor: '#FFA502',
                  boxShadow: '0 12px 40px rgba(255, 165, 2, 0.2), 0 0 0 1px #FFA502',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(255, 165, 2, 0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Notifications sx={{ fontSize: 28, color: '#FFA502' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {totalAlerts}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                  Total Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 71, 87, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 71, 87, 0.1)',
                '&:hover': {
                  borderColor: '#FF4757',
                  boxShadow: '0 12px 40px rgba(255, 71, 87, 0.2), 0 0 0 1px #FF4757',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(255, 71, 87, 0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <Warning sx={{ fontSize: 28, color: '#FF4757' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {highRiskAlerts}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                  High Risk Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Risk Chart */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 255, 0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Risk Score Trend
                  </Typography>
                  <IconButton
                    sx={{
                      color: '#00D4FF',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
                <Box sx={{ height: 300 }}>
                  <LineChart
                    dataset={chartData}
                    xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
                    series={[
                      {
                        dataKey: 'value',
                        color: '#00D4FF',
                        area: true,
                        showMark: true,
                      },
                    ]}
                    height={300}
                    sx={{
                      '.MuiChartsAxis-line': {
                        stroke: '#333333',
                      },
                      '.MuiChartsAxis-tick': {
                        stroke: '#333333',
                      },
                      '.MuiChartsAxis-label': {
                        fill: '#B3B3B3',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 255, 0.1)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 3 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => navigate(action.path)}
                      sx={{
                        justifyContent: 'flex-start',
                        p: 2,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        background: action.color,
                        color: '#FFFFFF',
                        '&:hover': {
                          borderColor: '#00D4FF',
                          background: `${action.color}80`,
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box sx={{ mr: 2 }}>{action.icon}</Box>
                      <Box sx={{ textAlign: 'left', flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B3B3B3', fontSize: '0.75rem' }}>
                          {action.description}
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ fontSize: 20, color: '#B3B3B3' }} />
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Alerts */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 255, 0.1)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Recent Alerts
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/alerts')}
                    sx={{
                      color: '#00D4FF',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    View All
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map((alert, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(0, 212, 255, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: alert.severity === 'high' || alert.severity === 'critical'
                              ? 'rgba(255, 71, 87, 0.2)'
                              : 'rgba(0, 255, 136, 0.2)',
                            color: alert.severity === 'high' || alert.severity === 'critical'
                              ? '#FF4757'
                              : '#00FF88',
                          }}
                        >
                          {alert.severity === 'high' || alert.severity === 'critical' ? (
                            <Warning />
                          ) : (
                            <CheckCircle />
                          )}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                            {alert.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                            {alert.message}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={alert.severity}
                            size="small"
                            sx={{
                              background: alert.severity === 'high' || alert.severity === 'critical'
                                ? 'rgba(255, 71, 87, 0.2)'
                                : 'rgba(0, 255, 136, 0.2)',
                              color: alert.severity === 'high' || alert.severity === 'critical'
                                ? '#FF4757'
                                : '#00FF88',
                              fontWeight: 600,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 4,
                        color: '#B3B3B3',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 48, color: '#00FF88', mb: 2 }} />
                      <Typography variant="h6">No alerts at the moment</Typography>
                      <Typography variant="body2">Your DeFi security is looking good!</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
