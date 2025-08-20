import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, useTheme } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Security from '@mui/icons-material/Security';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Shield from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.tsx';

const Landing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: '#00D4FF' }} />,
      title: 'Advanced DeFi Security',
      description: 'Real-time monitoring and AI-powered threat detection for your crypto assets'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#00FF88' }} />,
      title: 'Live Market Analytics',
      description: 'Comprehensive insights and risk scoring for informed trading decisions'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Smart Contract Monitoring',
      description: 'Continuous surveillance of DeFi protocols and contract vulnerabilities'
    }
  ];

  const stats = [
    { label: 'Monitored Contracts', value: '500+', color: '#00D4FF' },
    { label: 'Security Alerts', value: '24/7', color: '#00FF88' },
    { label: 'User Protection', value: '99.9%', color: '#8B5CF6' }
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
        color: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          py: 2
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo variant="compact" size="medium" color="primary" showTagline={false} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderColor: '#00FF88',
                  color: '#00FF88',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(0, 255, 136, 0.1)',
                    borderColor: '#00FF88',
                  }
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/signin')}
                sx={{
                  borderColor: '#00D4FF',
                  color: '#00D4FF',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderColor: '#00D4FF',
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signin')}
                sx={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                  color: '#000000',
                  borderRadius: '12px',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00A3CC 0%, #00CC6A 100%)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ pt: 16, pb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="PREMIER DEFI SECURITY PLATFORM"
              sx={{
                background: 'rgba(0, 212, 255, 0.1)',
                color: '#00D4FF',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 1
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2
              }}
            >
              The World's Premier
              <br />
              DeFi Security Platform
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#B3B3B3',
                fontWeight: 400,
                mb: 4,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Monitor Bitcoin, Ethereum, and 400+ cryptocurrencies with AI-powered security
            </Typography>
            
            {/* Feature List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 6, alignItems: 'center' }}>
              {[
                'Trade with 20+ currencies and advanced security protocols',
                'Leader in regulatory compliance and security certifications',
                'Trusted by over 150,000+ users worldwide'
              ].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle sx={{ color: '#00FF88', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                color: '#000000',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #00A3CC 0%, #00CC6A 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 212, 255, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Sign up and get up to 1 BTC worth of rewards
              <ArrowForward sx={{ ml: 2 }} />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.95)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#00D4FF',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 212, 255, 0.2)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#FFFFFF',
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#B3B3B3',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2
              }}
            >
              Trusted by Millions
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#B3B3B3',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Join our growing community of security-conscious crypto traders
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: stat.color,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#B3B3B3',
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '32px',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              p: 6
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 3
              }}
            >
              Ready to Secure Your Crypto?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#B3B3B3',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Get started today and experience the most advanced DeFi security platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                color: '#000000',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #00A3CC 0%, #00CC6A 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 212, 255, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Now
              <ArrowForward sx={{ ml: 2 }} />
            </Button>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: 'rgba(26, 26, 26, 0.95)',
          borderTop: '1px solid rgba(0, 212, 255, 0.2)',
          py: 4,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Logo variant="compact" size="medium" color="primary" showTagline={true} />
            <Typography
              variant="body2"
              sx={{
                color: '#666666',
                mt: 2
              }}
            >
              © 2024 CryptoVault Sentinel. Advanced DeFi Security & Monitoring Platform.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;


