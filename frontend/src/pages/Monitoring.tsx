import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Divider from '@mui/material/Divider';

interface MonitoringRow {
  id: string;
  type: 'Transaction' | 'Contract' | 'Wallet';
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  address: string;
  value: number; // in BNB
  timestamp: number;
}

const randomAddress = () => `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`;
const now = () => Date.now();

function generateMockRow(): MonitoringRow {
  const types: MonitoringRow['type'][] = ['Transaction', 'Contract', 'Wallet'];
  const risks: MonitoringRow['risk'][] = ['Low', 'Medium', 'High', 'Critical'];
  return {
    id: Math.random().toString(36).slice(2),
    type: types[Math.floor(Math.random() * types.length)],
    risk: risks[Math.floor(Math.random() * risks.length)],
    address: randomAddress(),
    value: +(Math.random() * 100).toFixed(2),
    timestamp: now() - Math.floor(Math.random() * 60_000),
  };
}

const riskColor = (risk: MonitoringRow['risk']) => ({
  Low: 'success',
  Medium: 'warning',
  High: 'error',
  Critical: 'error',
}[risk] as any);

const Monitoring: React.FC = () => {
  const [data, setData] = useState<MonitoringRow[]>(() => Array.from({ length: 25 }, generateMockRow));
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'All' | MonitoringRow['type']>('All');
  const [risk, setRisk] = useState<'All' | MonitoringRow['risk']>('All');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortBy, setSortBy] = useState<'timestamp' | 'value'>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Auto-refresh new mock events
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setData((prev) => [generateMockRow(), ...prev].slice(0, 50));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filtered = useMemo(() => {
    let rows = data.filter((r) =>
      r.address.toLowerCase().includes(query.toLowerCase())
    );
    if (kind !== 'All') rows = rows.filter((r) => r.type === kind);
    if (risk !== 'All') rows = rows.filter((r) => r.risk === risk);

    rows = rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'timestamp') return (a.timestamp - b.timestamp) * dir;
      return (a.value - b.value) * dir;
    });
    return rows;
  }, [data, query, kind, risk, sortBy, sortDir]);

  const toggleSort = (field: 'timestamp' | 'value') => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Monitoring</Typography>

      <Paper sx={(theme) => ({ p: 2, mb: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by address/hash"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ) }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth label="Type" size="small" value={kind} onChange={(e) => setKind(e.target.value as any)}>
              {['All', 'Transaction', 'Contract', 'Wallet'].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth label="Risk" size="small" value={risk} onChange={(e) => setRisk(e.target.value as any)}>
              {['All', 'Low', 'Medium', 'High', 'Critical'].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />} label="Auto-refresh" />
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setData((prev) => [generateMockRow(), ...prev].slice(0, 50))}>Refresh</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={(theme) => ({ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Address / Hash</TableCell>
                <TableCell align="right">
                  Value (BNB)
                  <IconButton size="small" onClick={() => toggleSort('value')} sx={{ ml: 1 }}>
                    {sortBy === 'value' && sortDir === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
                  </IconButton>
                </TableCell>
                <TableCell>Risk</TableCell>
                <TableCell align="right">
                  Time
                  <IconButton size="small" onClick={() => toggleSort('timestamp')} sx={{ ml: 1 }}>
                    {sortBy === 'timestamp' && sortDir === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.type}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{row.address}</TableCell>
                  <TableCell align="right">{row.value.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.risk} color={riskColor(row.risk)} variant={row.risk === 'Low' ? 'outlined' : 'filled'} />
                  </TableCell>
                  <TableCell align="right">{new Date(row.timestamp).toLocaleTimeString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', color: (theme) => theme.palette.text.secondary }}>
          <span>{filtered.length} results</span>
          <span>Auto-refresh: {autoRefresh ? 'On' : 'Off'}</span>
        </Box>
      </Paper>
    </Box>
  );
};

export default Monitoring;
