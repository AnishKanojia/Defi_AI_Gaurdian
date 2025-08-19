import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchTopMarkets, Market, subscribeBinanceTickers } from '../services/markets.ts';

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
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Markets</Typography>
      <Paper sx={(t)=>({ p:2, mb:2, background:t.palette.background.paper, border:`1px solid ${t.palette.divider}` })}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField fullWidth size="small" label="Search" value={filter} onChange={(e)=>setFilter(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select fullWidth size="small" label="Currency" value={vs} onChange={(e)=>setVs(e.target.value as any)}>
              {['usd','eur','btc','inr'].map((v)=>(<MenuItem key={v} value={v}>{v.toUpperCase()}</MenuItem>))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={(t)=>({ p:1, background:t.palette.background.paper, border:`1px solid ${t.palette.divider}` })}>
        <div style={{ height: 640, width: '100%' }}>
          <DataGrid rows={filtered} columns={cols} getRowId={(r)=> (r as any).id} disableRowSelectionOnClick />
        </div>
      </Paper>
    </Box>
  );
};

export default Markets;


