import React, { useMemo, useState } from 'react';
import { useAlerts } from '../context/AlertContext.tsx';
import { Alert as AlertType } from '../types/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const severityColor = (sev: AlertType['severity']) => ({
  low: 'default',
  medium: 'warning',
  high: 'error',
  critical: 'error',
} as const)[sev] as any;

const Alerts: React.FC = () => {
  const { alerts, clearAlerts } = useAlerts();

  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<'all' | AlertType['severity']>('all');
  const [status, setStatus] = useState<'all' | 'open' | 'acknowledged' | 'resolved'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<AlertType | null>(null);

  const rows = useMemo(() => {
    let r = alerts;
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((a) => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q) || a.metadata?.contractAddress?.toLowerCase().includes(q) || a.metadata?.walletAddress?.toLowerCase().includes(q));
    }
    if (severity !== 'all') r = r.filter((a) => a.severity === severity);
    if (status !== 'all') {
      r = r.filter((a) => {
        if (status === 'resolved') return a.resolved;
        if (status === 'acknowledged') return a.acknowledged && !a.resolved;
        return !a.acknowledged && !a.resolved;
      });
    }
    return [...r].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [alerts, query, severity, status]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const acknowledgeSelected = () => {
    // Simple local-only update since storage handled elsewhere
    const ids = new Set(selected);
    alerts.forEach((a) => {
      if (ids.has(a.id)) {
        a.acknowledged = true;
      }
    });
    setSelected(new Set());
  };

  const resolveSelected = () => {
    const ids = new Set(selected);
    alerts.forEach((a) => {
      if (ids.has(a.id)) {
        a.resolved = true;
      }
    });
    setSelected(new Set());
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Alerts</Typography>

      <Paper sx={{ p: 2, mb: 2, background: '#151515', border: '1px solid #2c2c2c' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search title, message, or address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ) }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth label="Severity" size="small" value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
              {['all', 'low', 'medium', 'high', 'critical'].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth label="Status" size="small" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {['all', 'open', 'acknowledged', 'resolved'].map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
            <Button variant="outlined" startIcon={<CheckIcon />} disabled={!selected.size} onClick={acknowledgeSelected}>Acknowledge</Button>
            <Button variant="contained" startIcon={<DoneAllIcon />} disabled={!selected.size} onClick={resolveSelected} sx={{ backgroundColor: '#00d4aa', color: '#000', '&:hover': { backgroundColor: '#00c4a0' } }}>Resolve</Button>
            <Button color="error" variant="text" onClick={clearAlerts}>Clear All</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ background: '#151515', border: '1px solid #2c2c2c' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox indeterminate={selected.size>0 && selected.size<rows.length} checked={rows.length>0 && selected.size===rows.length} onChange={(e)=>{ if(e.target.checked){ setSelected(new Set(rows.map(r=>r.id))); } else { setSelected(new Set()); } }} /></TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id} hover onClick={() => setDetail(a)} sx={{ cursor: 'pointer' }}>
                  <TableCell padding="checkbox" onClick={(e)=>{ e.stopPropagation(); toggleSelect(a.id); }}>
                    <Checkbox checked={selected.has(a.id)} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{a.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#8a8a8a' }}>{a.message}</Typography>
                  </TableCell>
                  <TableCell><Chip size="small" label={a.severity} color={severityColor(a.severity)} variant={a.severity==='low'?'outlined':'filled'} /></TableCell>
                  <TableCell>{a.source}</TableCell>
                  <TableCell>
                    {a.resolved ? <Chip size="small" color="success" label="Resolved" /> : a.acknowledged ? <Chip size="small" color="warning" label="Acknowledged" /> : <Chip size="small" label="Open" />}
                  </TableCell>
                  <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', color: '#8a8a8a' }}>
          <span>{rows.length} alerts</span>
          <span>Selected: {selected.size}</span>
        </Box>
      </Paper>

      <Drawer anchor="right" open={!!detail} onClose={() => setDetail(null)}>
        <Box sx={{ width: 420, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">Alert Details</Typography>
            <IconButton onClick={() => setDetail(null)}><CloseIcon /></IconButton>
          </Box>
          {detail && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{detail.title}</Typography>
              <Chip size="small" sx={{ mr: 1 }} label={detail.severity} color={severityColor(detail.severity)} />
              <Chip size="small" label={detail.source} />
              <Typography variant="body2" sx={{ mt: 2 }}>{detail.message}</Typography>
              {detail.metadata?.explanation && (
                <Typography variant="body2" sx={{ mt: 2, color: '#bdbdbd' }}>XAI: {detail.metadata.explanation}</Typography>
              )}
              <Box sx={{ mt: 2 }}>
                {detail.metadata?.contractAddress && <Typography variant="body2">Contract: <code>{detail.metadata.contractAddress}</code></Typography>}
                {detail.metadata?.walletAddress && <Typography variant="body2">Wallet: <code>{detail.metadata.walletAddress}</code></Typography>}
                {detail.metadata?.transactionHash && <Typography variant="body2">Tx: <code>{detail.metadata.transactionHash}</code></Typography>}
                {typeof detail.metadata?.riskScore === 'number' && <Typography variant="body2">Risk Score: {detail.metadata.riskScore}</Typography>}
                {typeof detail.metadata?.confidence === 'number' && <Typography variant="body2">Confidence: {Math.round(detail.metadata.confidence*100)}%</Typography>}
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Alerts;
