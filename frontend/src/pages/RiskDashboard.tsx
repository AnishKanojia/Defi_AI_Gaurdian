import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { subscribeToMonitoredContracts, MonitoredContract } from '../services/contracts.ts';
import { useAlerts } from '../context/AlertContext.tsx';

const riskColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'error';
};

const RiskDashboard: React.FC = () => {
  const [contracts, setContracts] = useState<MonitoredContract[]>([]);
  const { alerts } = useAlerts();

  useEffect(() => {
    const unsub = subscribeToMonitoredContracts(100, setContracts);
    return () => unsub();
  }, []);

  const latestAlerts = useMemo(() => alerts.slice(0, 10), [alerts]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Risk Scoring Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 1 }}>Monitored Contracts</Typography>
            <List>
              {contracts.map((c) => (
                <ListItem key={c.id} divider secondaryAction={<Chip size="small" color={riskColor(c.riskScore)} label={`${c.riskScore}`} />}>
                  <ListItemText
                    primary={c.name || c.address}
                    secondary={c.name ? c.address : undefined}
                  />
                </ListItem>
              ))}
              {!contracts.length && (
                <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary, p: 1 }}>No contracts yet.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, height: '100%' })}>
            <Typography variant="h6" sx={{ mb: 1 }}>Live Alerts</Typography>
            <List>
              {latestAlerts.map((a) => (
                <ListItem key={a.id} alignItems="flex-start" divider>
                  <ListItemText
                    primary={a.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span" sx={{ color: (t) => t.palette.text.secondary }}>
                          {a.message}
                        </Typography>
                        {typeof a.metadata?.riskScore === 'number' && (
                          <Chip size="small" sx={{ ml: 1 }} label={`risk ${a.metadata.riskScore}`} color={riskColor(a.metadata.riskScore)} />
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
              {!latestAlerts.length && (
                <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary, p: 1 }}>No alerts yet.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2, borderColor: (t) => t.palette.divider }} />
      <Typography variant="body2" sx={{ mt: 1, color: (t) => t.palette.text.secondary }}>
        Demo: This page updates live as alerts stream in and as monitored contract risk scores change.
      </Typography>
    </Box>
  );
};

export default RiskDashboard;


