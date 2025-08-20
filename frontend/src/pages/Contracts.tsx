import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { subscribeToMonitoredContracts, MonitoredContract, addMonitoredContract, updateMonitoredContract, deleteMonitoredContract } from '../services/contracts.ts';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Add from '@mui/icons-material/Add';
import Security from '@mui/icons-material/Security';
import Shield from '@mui/icons-material/Shield';

const riskColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'error';
};

const getRiskIcon = (score: number) => {
  if (score < 40) return <Shield sx={{ color: '#00FF88' }} />;
  if (score < 70) return <Security sx={{ color: '#FFA502' }} />;
  return <Security sx={{ color: '#FF4757' }} />;
};

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<MonitoredContract[]>([]);
  const [filter, setFilter] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRisk, setEditRisk] = useState<number>(0);

  useEffect(() => {
    const unsub = subscribeToMonitoredContracts(200, setContracts);
    return () => unsub();
  }, []);

  // Mock data for demonstration
  const mockContracts: MonitoredContract[] = [
    { id: '1', address: '0x1234...5678', name: 'Uniswap V3', riskScore: 85, lastUpdated: new Date() },
    { id: '2', address: '0x8765...4321', name: 'Aave V3', riskScore: 45, lastUpdated: new Date() },
    { id: '3', address: '0x1111...2222', name: 'Compound V3', riskScore: 65, lastUpdated: new Date() },
    { id: '4', address: '0x3333...4444', name: 'Curve Finance', riskScore: 25, lastUpdated: new Date() },
    { id: '5', address: '0x5555...6666', name: 'Balancer V2', riskScore: 75, lastUpdated: new Date() },
  ];

  const displayContracts = contracts.length > 0 ? contracts : mockContracts;
  const filteredContracts = displayContracts.filter(c => 
    (c.name || c.address).toLowerCase().includes(filter.toLowerCase())
  );

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
            Contract Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Monitor and manage smart contracts for security risks
          </Typography>
        </Box>

        {/* Add New Contract Section */}
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
            <Add sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Add New Contract
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Filter by name/address" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
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
              <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                <TextField 
                  size="small" 
                  label="Address" 
                  value={newAddress} 
                  onChange={(e) => setNewAddress(e.target.value)} 
                  sx={{ 
                    minWidth: 280,
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
                <TextField 
                  size="small" 
                  label="Name (optional)" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  sx={{ 
                    minWidth: 200,
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
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!newAddress.trim()) return;
                    await addMonitoredContract({ address: newAddress.trim(), name: newName.trim() || undefined });
                    setNewAddress(''); 
                    setNewName('');
                  }}
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
                  }}
                >
                  Add Contract
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contracts List */}
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
              Monitored Contracts ({filteredContracts.length})
            </Typography>
          </Box>
          <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
            <List sx={{ p: 0 }}>
              {filteredContracts.map((contract, index) => (
                <ListItem 
                  key={contract.id} 
                  divider={index < filteredContracts.length - 1}
                  sx={{
                    px: 3,
                    py: 2,
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.05)',
                    }
                  }}
                  secondaryAction={
                    editing === contract.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={async () => { 
                            await updateMonitoredContract(contract.id, { name: editName, riskScore: editRisk }); 
                            setEditing(null); 
                          }}
                          sx={{
                            color: '#00FF88',
                            '&:hover': {
                              background: 'rgba(0, 255, 136, 0.1)',
                            }
                          }}
                        >
                          <SaveOutlinedIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditing(null)}
                          sx={{
                            color: '#FFA502',
                            '&:hover': {
                              background: 'rgba(255, 165, 2, 0.1)',
                            }
                          }}
                        >
                          <CancelOutlinedIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          size="small" 
                          label={contract.riskScore} 
                          color={riskColor(contract.riskScore)} 
                          icon={getRiskIcon(contract.riskScore)}
                          sx={{ 
                            mr: 1,
                            fontWeight: 600,
                            borderRadius: '12px',
                          }} 
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => { 
                            setEditing(contract.id); 
                            setEditName(contract.name || ''); 
                            setEditRisk(contract.riskScore); 
                          }}
                          sx={{
                            color: '#00D4FF',
                            '&:hover': {
                              background: 'rgba(0, 212, 255, 0.1)',
                            }
                          }}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={async () => { 
                            await deleteMonitoredContract(contract.id); 
                          }}
                          sx={{
                            '&:hover': {
                              background: 'rgba(255, 71, 87, 0.1)',
                            }
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    )
                  }
                >
                  {editing === contract.id ? (
                    <ListItemText
                      primary={
                        <TextField 
                          size="small" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          placeholder="Contract Name"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(34, 34, 34, 0.8)',
                              borderRadius: '8px',
                              '& fieldset': {
                                borderColor: 'rgba(0, 212, 255, 0.3)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#B3B3B3',
                            },
                          }}
                        />
                      }
                      secondary={
                        <TextField 
                          size="small" 
                          type="number" 
                          inputProps={{ min: 0, max: 100 }} 
                          value={editRisk} 
                          onChange={(e) => setEditRisk(Number(e.target.value))}
                          label="Risk Score"
                          sx={{
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(34, 34, 34, 0.8)',
                              borderRadius: '8px',
                              '& fieldset': {
                                borderColor: 'rgba(0, 212, 255, 0.3)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#B3B3B3',
                            },
                          }}
                        />
                      }
                    />
                  ) : (
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                          {contract.name || contract.address}
                        </Typography>
                      }
                      secondary={
                        contract.name && (
                          <Typography variant="body2" sx={{ color: '#B3B3B3', fontFamily: 'monospace', mt: 0.5 }}>
                            {contract.address}
                          </Typography>
                        )
                      }
                    />
                  )}
                </ListItem>
              ))}
              {filteredContracts.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                    {filter ? 'No contracts match your filter.' : 'No contracts monitored yet. Add your first contract above!'}
                  </Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            🔴 Demo Mode: Contract data is simulated for demonstration purposes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Contracts;


