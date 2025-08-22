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
import Alert from '@mui/material/Alert';
import { useWallet } from '../context/WalletContext.tsx';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Send from '@mui/icons-material/Send';
import History from '@mui/icons-material/History';
import Refresh from '@mui/icons-material/Refresh';
import SwapHoriz from '@mui/icons-material/SwapHoriz';

function formatBnb(weiHex: string | null): string {
  if (!weiHex) return '0';
  const wei = BigInt(weiHex);
  const bnbInt = wei / (10n ** 18n);
  const frac = (wei % (10n ** 18n)).toString().padStart(18, '0').slice(0, 4);
  return `${bnbInt.toString()}.${frac}`;
}

const WalletPage: React.FC = () => {
  const { 
    hasProvider, 
    account, 
    chainId, 
    balanceWei, 
    isCorrectChain,
    connect, 
    disconnect,
    switchToBNBChain,
    addBNBChainManually,
    sendTransaction, 
    refresh 
  } = useWallet();
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txs, setTxs] = useState<{ hash: string; to: string; value: string; time: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chain = useMemo(() => chainId ? parseInt(chainId, 16) : null, [chainId]);

  const handleSendTransaction = async () => {
    if (!isCorrectChain) {
      setError('Please switch to BNB Chain first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hash = await sendTransaction(to, amount);
      setTxs(prev => [{ hash, to, value: amount, time: new Date().toLocaleTimeString() }, ...prev]);
      setTo('');
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChain = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log('Switch chain button clicked');
    console.log('Current chainId:', chainId);
    console.log('isCorrectChain:', isCorrectChain);
    
    try {
      await switchToBNBChain();
      console.log('Chain switch successful');
      // Refresh the page or force a re-render to update the UI
      window.location.reload();
    } catch (err: any) {
      console.error('Chain switch error:', err);
      setError(err.message || 'Failed to switch to BNB Chain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSwitch = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log('Manual switch attempt...');
    
    try {
      // Direct MetaMask call as fallback
      if (window.ethereum) {
        console.log('Direct MetaMask call...');
        
        // Try to switch to BNB Chain
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // BNB Chain ID
        });
        
        console.log('Manual switch successful');
        window.location.reload();
      } else {
        throw new Error('MetaMask not found');
      }
    } catch (err: any) {
      console.error('Manual switch error:', err);
      
      if (err.code === 4902) {
        // Chain not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38',
              chainName: 'BNB Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed1.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com/'],
            }],
          });
          
          // Now try to switch
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
          });
          
          console.log('Manual add and switch successful');
          window.location.reload();
        } catch (addErr: any) {
          setError(`Failed to add BNB Chain: ${addErr.message}`);
        }
      } else {
        setError(`Manual switch failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log('Force refreshing wallet...');
    
    try {
      // Disconnect first
      disconnect();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to reconnect
      await connect();
      
      console.log('Force refresh completed');
      setError('Wallet refreshed! Try switching to BNB Chain now.');
    } catch (err: any) {
      console.error('Force refresh error:', err);
      setError(`Force refresh failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
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
            BNB Chain Wallet
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Connect, manage, and transact with BNB on BNB Smart Chain
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: '12px' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Debug Info */}
        {account && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: '12px' }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Debug Info:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              Chain ID: {chainId} (Expected: 0x38)
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              Is Correct Chain: {isCorrectChain ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              Account: {account}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              Provider: {hasProvider ? 'Detected' : 'Not found'}
            </Typography>
          </Alert>
        )}

        {/* Instructions */}
        {account && !isCorrectChain && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: '12px' }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>How to Switch to BNB Chain:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              1. <strong>Try "Switch to BNB Chain"</strong> first (recommended)
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              2. If that doesn't work, try <strong>"Add BNB Chain"</strong> then switch
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              3. As a last resort, use <strong>"Manual Switch"</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              4. <strong>If you see "avalanche_selectWallet" errors:</strong> Click "Force Refresh" to clear stuck wallet state
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              5. Or manually add BNB Smart Chain in MetaMask with these settings:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 1 }}>
              Network Name: BNB Smart Chain
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              RPC URL: https://bsc-dataseed1.binance.org/
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              Chain ID: 56
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              Currency Symbol: BNB
            </Typography>
          </Alert>
        )}

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
                      color={isCorrectChain ? 'success' : 'warning'}
                      sx={{ 
                        background: isCorrectChain ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        border: isCorrectChain ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255, 193, 7, 0.3)',
                        color: isCorrectChain ? '#00FF88' : '#FFC107',
                        fontWeight: 600,
                        borderRadius: '12px',
                      }}
                    />
                    <Chip 
                      label={`Balance: ${formatBnb(balanceWei)} BNB`}
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
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {!isCorrectChain && (
                        <>
                          <Button 
                            variant="contained" 
                            onClick={handleSwitchChain}
                            disabled={isLoading}
                            startIcon={<SwapHoriz />}
                            sx={{
                              background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
                              color: '#000000',
                              fontWeight: 700,
                              borderRadius: '12px',
                              px: 3,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #E0A800 0%, #E68900 100%)',
                                boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)',
                              },
                            }}
                          >
                            Switch to BNB Chain
                          </Button>
                          <Button 
                            variant="outlined" 
                            onClick={async () => {
                              setIsLoading(true);
                              setError(null);
                              try {
                                await addBNBChainManually();
                                setError('BNB Chain added! Now click "Switch to BNB Chain"');
                              } catch (err: any) {
                                setError(err.message || 'Failed to add BNB Chain');
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                            disabled={isLoading}
                            startIcon={<SwapHoriz />}
                            sx={{
                              borderColor: '#00D4FF',
                              color: '#00D4FF',
                              borderRadius: '12px',
                              px: 3,
                              fontWeight: 600,
                              '&:hover': {
                                background: 'rgba(0, 212, 255, 0.1)',
                                borderColor: '#00D4FF',
                                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
                              },
                            }}
                          >
                            Add BNB Chain
                          </Button>
                          <Button 
                            variant="outlined" 
                            onClick={() => {
                              console.log('Testing wallet context...');
                              console.log('hasProvider:', hasProvider);
                              console.log('account:', account);
                              console.log('chainId:', chainId);
                              console.log('isCorrectChain:', isCorrectChain);
                              setError('Check browser console for debug info');
                            }}
                            sx={{
                              borderColor: '#8B5CF6',
                              color: '#8B5CF6',
                              borderRadius: '12px',
                              px: 3,
                              fontWeight: 600,
                              '&:hover': {
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderColor: '#8B5CF6',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                              },
                            }}
                          >
                            Test Wallet
                          </Button>
                          <Button 
                            variant="outlined" 
                            onClick={handleManualSwitch}
                            disabled={isLoading}
                            startIcon={<SwapHoriz />}
                            sx={{
                              borderColor: '#EC4899',
                              color: '#EC4899',
                              borderRadius: '12px',
                              px: 3,
                              fontWeight: 600,
                              '&:hover': {
                                background: 'rgba(236, 72, 153, 0.1)',
                                borderColor: '#EC4899',
                                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                              },
                            }}
                          >
                            Manual Switch
                          </Button>
                        </>
                      )}
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
                      <Button 
                        variant="outlined" 
                        onClick={handleForceRefresh}
                        disabled={isLoading}
                        startIcon={<Refresh />}
                        sx={{
                          borderColor: '#FF4757',
                          color: '#FF4757',
                          borderRadius: '12px',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(255, 71, 87, 0.1)',
                            borderColor: '#FF4757',
                            boxShadow: '0 4px 20px rgba(255, 71, 87, 0.3)',
                          },
                        }}
                      >
                        Force Refresh
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={disconnect}
                        sx={{
                          borderColor: '#FF4757',
                          color: '#FF4757',
                          borderRadius: '12px',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(255, 71, 87, 0.1)',
                            borderColor: '#FF4757',
                            boxShadow: '0 4px 20px rgba(255, 71, 87, 0.3)',
                          },
                        }}
                      >
                        Disconnect
                      </Button>
                    </Box>
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
              Send BNB Transaction
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            {!isCorrectChain ? (
              <Alert severity="warning" sx={{ borderRadius: '12px' }}>
                Please switch to BNB Chain to send transactions
              </Alert>
            ) : (
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
                    label="Amount (BNB)" 
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
                    disabled={!account || !to || !amount || isLoading} 
                    onClick={handleSendTransaction}
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
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </Grid>
              </Grid>
            )}
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
                      Value (BNB)
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
                        No transactions yet. Send your first BNB transaction above!
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
          <Typography variant="body2" sx={{ color: '#B3B3B3', mt: 1 }}>
            Make sure you're connected to BNB Smart Chain (Chain ID: 56) for real transactions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WalletPage;


