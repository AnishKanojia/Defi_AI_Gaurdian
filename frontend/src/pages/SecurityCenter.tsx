import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Chip, CircularProgress, Container, Divider } from '@mui/material';
import { useWallet } from '../context/WalletContext.tsx';
import Security from '@mui/icons-material/Security';
import Shield from '@mui/icons-material/Shield';
import Warning from '@mui/icons-material/Warning';
import Link from '@mui/icons-material/Link';

async function getJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const ScoreCard: React.FC<{ title: string; value: string; subtitle?: string; color?: string }> = ({ title, value, subtitle, color = '#00D4FF' }) => (
  <Card
    sx={{
      background: 'rgba(34, 34, 34, 0.8)',
      border: `1px solid ${color}40`,
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        borderColor: `${color}80`,
        boxShadow: `0 8px 25px ${color}20`,
      }
    }}
  >
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="subtitle2" sx={{ color: '#B3B3B3', mb: 1 }}>{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: color }}>{value}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: '#B3B3B3' }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
);

const SecurityCenter: React.FC = () => {
  const { account, subscribeToProtocol } = useWallet();
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [walletResult, setWalletResult] = useState<any>(null);
  const [rugResult, setRugResult] = useState<any>(null);
  const [phishResult, setPhishResult] = useState<any>(null);

  const runWallet = async () => {
    try {
      setLoading('wallet');
      const data = await getJSON(`/api/security/wallet-safety?address=${encodeURIComponent(address)}`);
      setWalletResult(data);
    } finally { setLoading(null); }
  };
  const runRug = async () => {
    try {
      setLoading('rug');
      const data = await getJSON(`/api/security/rug-pull?token=${encodeURIComponent(token)}`);
      setRugResult(data);
    } finally { setLoading(null); }
  };
  const runPhishing = async () => {
    try {
      setLoading('phish');
      const data = await getJSON(`/api/security/phishing?url=${encodeURIComponent(url)}`);
      setPhishResult(data);
    } finally { setLoading(null); }
  };

  const subscribe = async (addr: string, protocol: string) => {
    await fetch(`/api/security/subscribe?address=${encodeURIComponent(addr)}&protocol=${encodeURIComponent(protocol)}`, { method: 'POST' });
  };

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
            Security Center
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            AI-powered security tools for wallet safety, rug pull detection, and phishing prevention
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Wallet Safety Score */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 212, 255, 0.2)',
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
                <Shield sx={{ fontSize: 32, color: '#000000' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                  Wallet Safety Score
                </Typography>
              </Box>
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="0x..." 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(34, 34, 34, 0.8)',
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 212, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 212, 255, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(0, 212, 255, 0.7)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B3B3B3',
                          '&.Mui-focused': {
                            color: '#00D4FF',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={runWallet} 
                      disabled={!address || loading === 'wallet'}
                      sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                        color: '#000000',
                        fontWeight: 700,
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00A3CC 0%, #00CC6A 100%)',
                          boxShadow: '0 8px 25px rgba(0, 212, 255, 0.4)',
                        },
                        '&:disabled': {
                          background: 'rgba(102, 102, 102, 0.3)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      {loading === 'wallet' ? <CircularProgress size={18} /> : 'Score'}
                    </Button>
                  </Grid>
                </Grid>
                {walletResult && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <ScoreCard 
                          title="Score" 
                          value={`${walletResult.score}`} 
                          subtitle={walletResult.level}
                          color={walletResult.score >= 80 ? '#00FF88' : walletResult.score >= 60 ? '#FFA502' : '#FF4757'}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ScoreCard 
                          title="Address" 
                          value={(walletResult.address || '').slice(0, 8) + '…'} 
                          color="#00D4FF"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ScoreCard 
                          title="Factors" 
                          value={`${walletResult.factors?.length || 0}`} 
                          color="#8B5CF6"
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFFFFF', mb: 2 }}>
                        Security Factors:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(walletResult.factors || []).map((f: string, i: number) => (
                          <Chip 
                            key={i} 
                            label={f} 
                            sx={{ 
                              background: 'rgba(0, 212, 255, 0.1)',
                              border: '1px solid rgba(0, 212, 255, 0.3)',
                              color: '#00D4FF',
                              fontWeight: 600,
                              borderRadius: '12px',
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ p: 2, background: 'rgba(34, 34, 34, 0.8)', borderRadius: '12px' }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFFFFF', mb: 2 }}>
                        Subscribe to Exploit Alerts:
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <TextField 
                            size="small" 
                            placeholder="Protocol (e.g., uniswap)" 
                            fullWidth
                            onKeyDown={async (e: any) => {
                              if (e.key === 'Enter' && e.currentTarget.value) { 
                                await subscribe(walletResult.address, e.currentTarget.value); 
                                e.currentTarget.value = ''; 
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(0, 255, 136, 0.3)',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#B3B3B3',
                              },
                            }}
                          />
                        </Grid>
                        {account && (
                          <>
                            <Grid item xs={12} md={3}>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => setAddress(account)}
                                sx={{
                                  borderColor: '#00FF88',
                                  color: '#00FF88',
                                  borderRadius: '8px',
                                  '&:hover': {
                                    background: 'rgba(0, 255, 136, 0.1)',
                                    borderColor: '#00FF88',
                                  },
                                }}
                              >
                                Use My Wallet
                              </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                onClick={async () => {
                                  const p = prompt('Protocol to subscribe (e.g., uniswap)');
                                  if (p) await subscribeToProtocol(p);
                                }}
                                sx={{
                                  background: 'linear-gradient(135deg, #00FF88 0%, #8B5CF6 100%)',
                                  color: '#000000',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #00CC6A 0%, #7C3AED 100%)',
                                  },
                                }}
                              >
                                Subscribe My Wallet
                              </Button>
                            </Grid>
                          </>
                        )}
                      </Grid>
                      <Typography variant="caption" sx={{ color: '#B3B3B3', mt: 1, display: 'block' }}>
                        Subscribe to exploit alerts for a protocol
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Rug Pull Prediction */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 165, 2, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 165, 2, 0.2)',
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
                  background: 'linear-gradient(135deg, rgba(255, 165, 2, 0.1) 0%, rgba(255, 71, 87, 0.1) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #FFA502 0%, #FF4757 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Warning sx={{ fontSize: 32, color: '#000000' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                  Rug Pull Prediction
                </Typography>
              </Box>
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} md={8}>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="Token address" 
                      value={token} 
                      onChange={(e) => setToken(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(34, 34, 34, 0.8)',
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(255, 165, 2, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 165, 2, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 165, 2, 0.7)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B3B3B3',
                          '&.Mui-focused': {
                            color: '#FFA502',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={runRug} 
                      disabled={!token || loading === 'rug'}
                      sx={{
                        background: 'linear-gradient(135deg, #FFA502 0%, #FF4757 100%)',
                        color: '#000000',
                        fontWeight: 700,
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E09400 0%, #E03A4A 100%)',
                          boxShadow: '0 8px 25px rgba(255, 165, 2, 0.4)',
                        },
                        '&:disabled': {
                          background: 'rgba(102, 102, 102, 0.3)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      {loading === 'rug' ? <CircularProgress size={18} /> : 'Assess'}
                    </Button>
                  </Grid>
                </Grid>
                {rugResult && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <ScoreCard 
                          title="Risk" 
                          value={`${rugResult.risk_score}`} 
                          subtitle={rugResult.risk_level}
                          color={rugResult.risk_score >= 80 ? '#FF4757' : rugResult.risk_score >= 60 ? '#FFA502' : '#00FF88'}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <ScoreCard 
                          title="Flags" 
                          value={`${(rugResult.red_flags || []).length}`} 
                          color="#FF4757"
                        />
                      </Grid>
                    </Grid>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFFFFF', mb: 2 }}>
                        Red Flags:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(rugResult.red_flags || []).map((f: string, i: number) => (
                          <Chip 
                            key={i} 
                            label={f} 
                            sx={{ 
                              background: 'rgba(255, 71, 87, 0.1)',
                              border: '1px solid rgba(255, 71, 87, 0.3)',
                              color: '#FF4757',
                              fontWeight: 600,
                              borderRadius: '12px',
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Phishing Detection */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.2)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Link sx={{ fontSize: 32, color: '#000000' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                  Phishing Detection
                </Typography>
              </Box>
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} md={9}>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="https://..." 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(34, 34, 34, 0.8)',
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.7)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B3B3B3',
                          '&.Mui-focused': {
                            color: '#8B5CF6',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      onClick={runPhishing} 
                      disabled={!url || loading === 'phish'}
                      sx={{
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        borderRadius: '12px',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderColor: '#8B5CF6',
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(102, 102, 102, 0.3)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      {loading === 'phish' ? <CircularProgress size={18} /> : 'Check URL'}
                    </Button>
                  </Grid>
                </Grid>
                {phishResult && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <ScoreCard 
                          title="Label" 
                          value={phishResult.label} 
                          color={phishResult.label === 'phishing' ? '#FF4757' : '#00FF88'}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <ScoreCard 
                          title="Score" 
                          value={`${phishResult.score}`} 
                          color="#8B5CF6"
                        />
                      </Grid>
                    </Grid>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#FFFFFF', mb: 2 }}>
                        Matches:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(phishResult.matches || []).map((m: string, i: number) => (
                          <Chip 
                            key={i} 
                            label={m} 
                            sx={{ 
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              color: '#8B5CF6',
                              fontWeight: 600,
                              borderRadius: '12px',
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            🔴 Demo Mode: Security assessments are simulated for demonstration purposes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SecurityCenter;


