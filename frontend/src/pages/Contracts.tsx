import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { subscribeToMonitoredContracts, MonitoredContract, addMonitoredContract, updateMonitoredContract, deleteMonitoredContract } from '../services/contracts.ts';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const riskColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'error';
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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Contracts</Typography>
      <Paper sx={(t) => ({ p: 2, background: t.palette.background.paper, border: `1px solid ${t.palette.divider}` })}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={5}>
            <TextField fullWidth size="small" label="Filter by name/address" value={filter} onChange={(e)=>setFilter(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
            <TextField size="small" label="Address" value={newAddress} onChange={(e)=>setNewAddress(e.target.value)} sx={{ minWidth: 280 }} />
            <TextField size="small" label="Name (optional)" value={newName} onChange={(e)=>setNewName(e.target.value)} sx={{ minWidth: 200 }} />
            <Button
              variant="contained"
              onClick={async ()=>{
                if (!newAddress.trim()) return;
                await addMonitoredContract({ address: newAddress.trim(), name: newName.trim() || undefined });
                setNewAddress(''); setNewName('');
              }}
            >Add</Button>
          </Grid>
        </Grid>

        <List>
          {contracts
            .filter(c => (c.name || c.address).toLowerCase().includes(filter.toLowerCase()))
            .map((c) => (
            <ListItem key={c.id} divider secondaryAction={
              editing === c.id ? (
                <>
                  <IconButton size="small" onClick={async ()=>{ await updateMonitoredContract(c.id, { name: editName, riskScore: editRisk }); setEditing(null); }}><SaveOutlinedIcon /></IconButton>
                  <IconButton size="small" onClick={()=> setEditing(null)}><CancelOutlinedIcon /></IconButton>
                </>
              ) : (
                <>
                  <Chip size="small" label={c.riskScore} color={riskColor(c.riskScore)} sx={{ mr: 1 }} />
                  <IconButton size="small" onClick={()=>{ setEditing(c.id); setEditName(c.name || ''); setEditRisk(c.riskScore); }}><EditOutlinedIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={async ()=>{ await deleteMonitoredContract(c.id); }}><DeleteOutlineIcon /></IconButton>
                </>
              )
            }>
              {editing === c.id ? (
                <ListItemText
                  primary={<TextField size="small" value={editName} onChange={(e)=>setEditName(e.target.value)} placeholder="Name" />}
                  secondary={<TextField size="small" type="number" inputProps={{ min: 0, max: 100 }} value={editRisk} onChange={(e)=>setEditRisk(Number(e.target.value))} />}
                />
              ) : (
                <ListItemText primary={c.name || c.address} secondary={c.name ? c.address : undefined} />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Contracts;


