import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Glow: React.FC<{ size?: number; color?: string; opacity?: number; top?: string|number; left?: string|number }> = ({ size = 420, color = '#a855f7', opacity = 0.25, top = '-20%', left = '50%' }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      transform: 'translate(-50%, 0)',
      background: `radial-gradient(circle at center, ${color} ${Math.round(opacity*100)}%, transparent 60%)`,
      filter: 'blur(64px)',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

const NeonCard: React.FC<{ title: string; body: string; cta?: string; onClick?: () => void }>
  = ({ title, body, cta, onClick }) => (
  <Card sx={(t)=>({
    height: '100%',
    borderRadius: 3,
    background: t.palette.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(24,24,35,0.9) 0%, rgba(18,18,28,0.9) 100%)'
      : 'linear-gradient(180deg, #fff 0%, #faf5ff 100%)',
    border: `1px solid ${t.palette.mode==='dark' ? '#312e81' : '#e9d5ff'}`,
    boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.2), 0 20px 60px rgba(168,85,247,.15)',
    position: 'relative',
    overflow: 'hidden',
  })}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{body}</Typography>
      {cta && (
        <Button variant="contained" size="small" onClick={onClick}> {cta} </Button>
      )}
    </CardContent>
  </Card>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Glow size={520} color="#8b5cf6" opacity={0.28} top="-10%" left="55%" />
      <Glow size={420} color="#06b6d4" opacity={0.22} top="20%" left="30%" />
      <Box
        sx={(t)=>({
          background: t.palette.mode==='dark'
            ? 'radial-gradient(1200px 600px at 50% -10%, rgba(139,92,246,.20), transparent), radial-gradient(1200px 600px at 20% 10%, rgba(6,182,212,.15), transparent)'
            : 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
        })}
      >
        <Container sx={{ pt: 10, pb: 6, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Secure • Scalable • AI‑Assisted" size="small" sx={{ mb: 2, bgcolor: 'primary.main', color: 'black', fontWeight: 700 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
              Rebuilding the Future, One
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
              Block at a Time
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mx: 'auto' }}>
              From secure smart contracts to scalable digital assets, we give developers and innovators the tools to build with confidence.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" size="large" onClick={() => navigate('/monitoring')}>Get Started</Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>Explore Dashboard</Button>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <NeonCard
                title="Customizable Dashboard"
                body="Custom charts, filters, and tools tailored to your workflow."
                cta="Start Now"
                onClick={() => navigate('/dashboard')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NeonCard
                title="Advanced Trading Tools"
                body="Real‑time analytics with lightning‑fast execution and robust monitoring."
                cta="Open Markets"
                onClick={() => navigate('/markets')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NeonCard
                title="High‑Speed Transactions"
                body="Execute trades in seconds using our reliable routing engine."
                cta="Start Now"
                onClick={() => navigate('/monitoring')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {[
              { label: 'VALIDATORS SECURING NETWORK', value: '450K+' },
              { label: 'VALIDATED BLOCKS', value: '5M+' },
              { label: 'ACTIVE USERS', value: '54K+' },
              { label: 'AVG LATENCY', value: '4.9 ms' },
            ].map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Card sx={{ borderRadius: 3, backdropFilter: 'blur(8px)', border: '1px solid rgba(168,85,247,.25)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;


