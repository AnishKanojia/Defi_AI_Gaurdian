import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Chip, CircularProgress, Card, CardContent } from '@mui/material';
import { useWallet } from '../context/WalletContext.tsx';

async function getJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const ScoreCard: React.FC<{ title: string; value: string; subtitle?: string }> = ({ title, value, subtitle }) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
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
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Security Center</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={(t)=>({ p:2, border:`1px solid ${t.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 1 }}>Wallet Safety Score</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField fullWidth size="small" placeholder="0x..." value={address} onChange={(e)=>setAddress(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button fullWidth variant="contained" onClick={runWallet} disabled={!address || loading==='wallet'}>
                  {loading==='wallet' ? <CircularProgress size={18} /> : 'Score'}
                </Button>
              </Grid>
            </Grid>
            {walletResult && (
              <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1 }}>
                <ScoreCard title="Score" value={`${walletResult.score}`} subtitle={walletResult.level} />
                <ScoreCard title="Address" value={(walletResult.address || '').slice(0,8)+'…'} />
                <ScoreCard title="Factors" value={`${walletResult.factors?.length || 0}`} />
                <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                  {(walletResult.factors || []).map((f: string, i: number) => <Chip key={i} label={f} sx={{ mr: 1, mb: 1 }} />)}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <TextField size="small" placeholder="Protocol (e.g., uniswap)" onKeyDown={async (e: any)=>{
                      if (e.key==='Enter' && e.currentTarget.value) { await subscribe(walletResult.address, e.currentTarget.value); e.currentTarget.value=''; }
                    }} />
                    {account && (
                      <>
                        <Button size="small" variant="outlined" onClick={()=> setAddress(account)}>Use My Wallet</Button>
                        <Button size="small" variant="contained" onClick={async ()=>{
                          const p = prompt('Protocol to subscribe (e.g., uniswap)');
                          if (p) await subscribeToProtocol(p);
                        }}>Subscribe My Wallet</Button>
                      </>
                    )}
                    <Typography variant="caption" color="text.secondary">Subscribe to exploit alerts for a protocol</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={(t)=>({ p:2, border:`1px solid ${t.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 1 }}>Rug Pull Prediction</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField fullWidth size="small" placeholder="Token address" value={token} onChange={(e)=>setToken(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button fullWidth variant="contained" onClick={runRug} disabled={!token || loading==='rug'}>
                  {loading==='rug' ? <CircularProgress size={18} /> : 'Assess'}
                </Button>
              </Grid>
            </Grid>
            {rugResult && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <ScoreCard title="Risk" value={`${rugResult.risk_score}`} subtitle={rugResult.risk_level} />
                  <ScoreCard title="Flags" value={`${(rugResult.red_flags||[]).length}`} />
                </Box>
                <Box sx={{ mt: 1 }}>
                  {(rugResult.red_flags || []).map((f: string, i: number) => <Chip key={i} label={f} sx={{ mr: 1, mb: 1 }} />)}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <Paper sx={(t)=>({ p:2, border:`1px solid ${t.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 1 }}>Phishing Detection</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField fullWidth size="small" placeholder="https://..." value={url} onChange={(e)=>setUrl(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="outlined" onClick={runPhishing} disabled={!url || loading==='phish'}>
                  {loading==='phish' ? <CircularProgress size={18} /> : 'Check URL'}
                </Button>
              </Grid>
            </Grid>
            {phishResult && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <ScoreCard title="Label" value={phishResult.label} />
                <ScoreCard title="Score" value={`${phishResult.score}`} />
                <Box sx={{ flexGrow: 1 }}>
                  {(phishResult.matches || []).map((m: string, i: number) => <Chip key={i} label={m} sx={{ mr: 1, mb: 1 }} />)}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityCenter;


