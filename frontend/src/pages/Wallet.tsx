import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useWallet } from '../context/WalletContext.tsx';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Send from '@mui/icons-material/Send';
import History from '@mui/icons-material/History';
import Refresh from '@mui/icons-material/Refresh';

function formatEth(weiHex: string | null): string {
  if (!weiHex) return '0';
  const wei = BigInt(weiHex);
  const ethInt = wei / (10n ** 18n);
  const frac = (wei % (10n ** 18n)).toString().padStart(18, '0').slice(0, 4);
  return `${ethInt.toString()}.${frac}`;
}

const WalletPage: React.FC = () => {
  const { hasProvider, account, chainId, balanceWei, connect, sendTransaction, refresh } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txs, setTxs] = useState<{ hash: string; to: string; value: string; time: string }[]>([]);

  const chain = useMemo(() => chainId ? parseInt(chainId, 16) : null, [chainId]);

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
            Wallet Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Connect, manage, and transact with your Web3 wallet
          </Typography>
        </Box>

        {/* Wallet Status */}
        <Card
          sx={{
            background: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 212, 255, 0.2)',
            overflow: 'hidden',
            position: 'relative',
            mb: 3,
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
            <AccountBalanceWallet sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Wallet Status
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      label={`Provider: ${hasProvider ? 'Detected' : 'Not found'}`}
                      color={hasProvider ? 'success' : 'error'}
                      sx={{ 
                        background: hasProvider ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                        border: hasProvider ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255, 71, 87, 0.3)',
                        color: hasProvider ? '#00FF88' : '#FF4757',
                        fontWeight: 600,
                        borderRadius: '12px',
                      }}
                    />
                    <Chip 
                      label={`Chain: ${chain ?? '-'}`}
                      sx={{ 
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#8B5CF6',
                        fontWeight: 600,
                        borderRadius: '12px',
                      }}
                    />
                    <Chip 
                      label={`Balance: ${formatEth(balanceWei)} ETH`}
                      sx={{ 
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        color: '#00D4FF',
                        fontWeight: 600,
                        borderRadius: '12px',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#B3B3B3', fontFamily: 'monospace' }}>
                    Account: {account || 'Not connected'}
                  </Typography>
                  {!account ? (
                    <Button 
                      variant="contained" 
                      onClick={connect} 
                      disabled={!hasProvider}
                      startIcon={<AccountBalanceWallet />}
                      sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                        color: '#000000',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 3,
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
                      Connect MetaMask
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      onClick={refresh}
                      startIcon={<Refresh />}
                      sx={{
                        borderColor: '#00FF88',
                        color: '#00FF88',
                        borderRadius: '12px',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(0, 255, 136, 0.1)',
                          borderColor: '#00FF88',
                          boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
                        },
                      }}
                    >
                      Refresh Balance
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Send Transaction */}
        <Card
          sx={{
            background: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 136, 0.2)',
            overflow: 'hidden',
            position: 'relative',
            mb: 3,
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
            <Send sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Send Transaction
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="To Address" 
                  placeholder="0x..." 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)}
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
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Amount (ETH)" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(34, 34, 34, 0.8)',
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 255, 136, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0, 255, 136, 0.7)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#00FF88',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  disabled={!account || !to || !amount} 
                  onClick={async () => { 
                    const hash = await sendTransaction(to, amount); 
                    setTxs(prev => [{ hash, to, value: amount, time: new Date().toLocaleTimeString() }, ...prev]); 
                  }}
                  startIcon={<Send />}
                  sx={{
                    background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                    color: '#000000',
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 3,
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
                  Send
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
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
            <History sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Recent Transactions (Session)
            </Typography>
          </Box>
          <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: 'rgba(34, 34, 34, 0.8)' }}>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      Hash
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      To
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      Value (ETH)
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, borderBottom: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {txs.length > 0 ? (
                    txs.map((tx) => (
                      <TableRow 
                        key={tx.hash}
                        sx={{
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.05)',
                          }
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'monospace', color: '#B3B3B3', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                          {tx.hash.slice(0, 10)}…
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', color: '#B3B3B3', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                          {tx.to}
                        </TableCell>
                        <TableCell sx={{ color: '#00FF88', fontWeight: 600, borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                          {tx.value}
                        </TableCell>
                        <TableCell sx={{ color: '#B3B3B3', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                          {tx.time}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#B3B3B3' }}>
                        No transactions yet. Send your first transaction above!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            🔴 Demo Mode: Transactions are simulated for demonstration purposes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WalletPage;


