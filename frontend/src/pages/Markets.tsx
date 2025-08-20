import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, MenuItem, Chip, Container, Divider } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchTopMarkets, Market, subscribeBinanceTickers } from '../services/markets.ts';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Search from '@mui/icons-material/Search';
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';

const Markets: React.FC = () => {
  const [vs, setVs] = useState<'usd'|'eur'|'btc'|'inr'>('usd');
  const [rows, setRows] = useState<Market[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let active = true;
    fetchTopMarkets(vs, 50).then((data) => { if (active) setRows(data); }).catch(() => undefined);
    return () => { active = false; };
  }, [vs]);

  useEffect(() => {
    // Try binance price live updates for top symbols
    const symbols = rows.slice(0, 20).map((m) => (m.symbol + 'usdt').toUpperCase());
    if (!symbols.length) return;
    const unsub = subscribeBinanceTickers(symbols, (sym, price) => {
      setRows((prev) => prev.map((r) => (sym.startsWith(r.symbol.toUpperCase()) ? { ...r, current_price: price } : r)));
    });
    return () => unsub();
  }, [rows.map(r => r.symbol).join(',')]);

  const cols: GridColDef[] = useMemo(() => ([
    { field: 'market_cap_rank', headerName: '#', width: 70, valueGetter: (params) => (params.row?.market_cap_rank ?? params.value ?? '-') },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180, renderCell: (p) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src={p.row.image} alt={p.value} width={20} height={20} />
        <span>{p.value}</span>
        <Chip size="small" label={p.row.symbol.toUpperCase()} />
      </Box>
    ) },
    { field: 'current_price', headerName: `Price (${vs.toUpperCase()})`, width: 140, valueFormatter: (p) => p.value ? p.value.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '-' },
    { field: 'price_change_percentage_1h_in_currency', headerName: '1h %', width: 100, valueFormatter: (p) => p.value != null ? `${p.value.toFixed(2)}%` : '-' },
    { field: 'price_change_percentage_24h_in_currency', headerName: '24h %', width: 100, valueFormatter: (p) => p.value != null ? `${p.value.toFixed(2)}%` : '-' },
    { field: 'price_change_percentage_7d_in_currency', headerName: '7d %', width: 100, valueFormatter: (p) => p.value != null ? `${p.value.toFixed(2)}%` : '-' },
    { field: 'market_cap', headerName: 'Market Cap', width: 160, valueFormatter: (p) => p.value ? p.value.toLocaleString() : '-' },
    { field: 'total_volume', headerName: 'Volume 24h', width: 160, valueFormatter: (p) => p.value ? p.value.toLocaleString() : '-' },
  ]), [vs]);

  const filtered = rows
    .filter((r) => (r?.name && r?.symbol) ? (r.name + r.symbol).toLowerCase().includes(filter.toLowerCase()) : false)
    .map((r, idx) => ({ ...r, market_cap_rank: r.market_cap_rank ?? idx + 1 }));

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
            Market Overview
          </Typography>
          <Typography variant="h6" sx={{ color: '#B3B3B3', fontWeight: 500 }}>
            Real-time cryptocurrency market data and live price updates
          </Typography>
        </Box>

        {/* Controls Section */}
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
            <TrendingUp sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Market Controls
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Search Markets" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: '#B3B3B3', mr: 1 }} />,
                  }}
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
              <Grid item xs={12} md={2}>
                <TextField 
                  select 
                  fullWidth 
                  size="small" 
                  label="Currency" 
                  value={vs} 
                  onChange={(e) => setVs(e.target.value as any)}
                  InputProps={{
                    startAdornment: <CurrencyExchange sx={{ color: '#B3B3B3', mr: 1 }} />,
                  }}
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
                >
                  {['usd','eur','btc','inr'].map((v) => (
                    <MenuItem key={v} value={v} sx={{ color: '#000000' }}>
                      {v.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Data Grid */}
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
            <TrendingUp sx={{ fontSize: 32, color: '#000000' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
              Market Data ({filtered.length} assets)
            </Typography>
          </Box>
          <CardContent sx={{ p: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ height: 640, width: '100%' }}>
              <DataGrid 
                rows={filtered} 
                columns={cols} 
                getRowId={(r) => (r as any).id} 
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                    color: '#FFFFFF',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgba(34, 34, 34, 0.8)',
                    borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    },
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: 'rgba(34, 34, 34, 0.8)',
                    borderTop: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#FFFFFF',
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            🔴 Live Data: Prices update in real-time via Binance WebSocket feeds
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Markets;


