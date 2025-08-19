import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

function generateSeries(points: number, base: number, noise: number) {
  const now = Date.now();
  const step = 1000 * 60 * 5; // 5 min
  const x: number[] = [];
  const y: number[] = [];
  for (let i = points - 1; i >= 0; i--) {
    x.push(now - i * step);
    const last = y.length ? y[y.length - 1] : base;
    const next = Math.max(0, last + (Math.random() - 0.5) * noise);
    y.push(+next.toFixed(2));
  }
  return { x, y };
}

const Analytics: React.FC = () => {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');

  const points = range === '24h' ? 48 : range === '7d' ? 7 * 24 : 30 * 24;

  const txSeries = useMemo(() => generateSeries(points, 1_000_000, 120_000), [points]);
  const riskSeries = useMemo(() => generateSeries(points, 45, 6), [points]);
  const tpsSeries = useMemo(() => generateSeries(points, 8, 2), [points]);

  const tpsLabels = useMemo(
    () => tpsSeries.x.map((ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit' })),
    [tpsSeries.x]
  );

  const topRisks = useMemo(() => [
    { label: 'Reentrancy', value: 34 },
    { label: 'Flash Loan', value: 19 },
    { label: 'Oracle', value: 14 },
    { label: 'Access Control', value: 21 },
    { label: 'Others', value: 12 },
  ], []);

  // Smart Contract Analyzer state
  const [source, setSource] = useState<string>(`// Paste your Solidity code here\npragma solidity ^0.8.0;\n\ncontract Sample {\n    address public owner;\n    constructor(){ owner = msg.sender; }\n    function deposit() external payable {}\n}`);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const analyze = async () => {
    try {
      setAnalyzing(true);
      setResult(null);
      const res = await fetch('/api/analyze/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: 'Failed to analyze contract' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Analytics</Typography>

      <Paper sx={(theme) => ({ p: 2, mb: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette.text.secondary }}>Time Range</Typography>
            <TextField select size="small" value={range} onChange={(e)=>setRange(e.target.value as any)}>
              {['24h','7d','30d'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>Mock data shown. Wire to backend when available.</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 2 }}>Transactions Volume</Typography>
            <LineChart
              xAxis={[{ data: txSeries.x, scaleType: 'time' }]}
              series={[{ label: 'Volume', data: txSeries.y }]}
              height={320}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 2 }}>Risk Category Distribution</Typography>
            <PieChart
              series={[{
                data: topRisks.map((r, i) => ({ id: i, value: r.value, label: r.label })),
                innerRadius: 40,
                outerRadius: 100,
                paddingAngle: 3,
              }]}
              height={320}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 2 }}>Network Risk Score</Typography>
            <LineChart
              xAxis={[{ data: riskSeries.x, scaleType: 'time' }]}
              series={[{ label: 'Risk', data: riskSeries.y, color: '#f7931e' }]}
              height={280}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
            <Typography variant="h6" sx={{ mb: 2 }}>TPS</Typography>
            <BarChart
              xAxis={[{ data: tpsLabels, scaleType: 'band' }]}
              series={[{ label: 'TPS', data: tpsSeries.y }]}
              height={280}
            />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: (theme) => theme.palette.divider }} />

      <Paper sx={(theme) => ({ p: 2, background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` })}>
        <Typography variant="h6" sx={{ mb: 1 }}>AI-Powered Smart Contract Analyzer (Pre-deployment)</Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 2 }}>Paste Solidity code to receive a quick risk assessment and recommendations.</Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              multiline
              minRows={12}
              fullWidth
              value={source}
              onChange={(e)=>setSource(e.target.value)}
              placeholder="// Solidity code"
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button variant="contained" color="primary" onClick={analyze} disabled={analyzing}>
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
              <Button variant="text" onClick={()=>setSource('')}>Clear</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 2, border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, height: '100%', background: (theme) => theme.palette.background.default, overflow: 'auto' }}>
              {result ? (
                <Box>
                  {result.error && <Typography color="error">{result.error}</Typography>}
                  {!result.error && (
                    <>
                      <Typography variant="subtitle1">Risk Score: <b>{result.risk_score}</b> ({result.risk_level})</Typography>
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, mb: 1 }}>Confidence: {Math.round((result.confidence||0)*100)/100}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {(result.detected_patterns||[]).map((p: string, i: number) => (
                          <Chip key={i} label={p} size="small" />
                        ))}
                      </Box>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>Recommendations</Typography>
                      <ul style={{ marginTop: 4 }}>
                        {(result.recommendations||[]).map((r: string, i: number) => (
                          <li key={i}><Typography variant="body2">{r}</Typography></li>
                        ))}
                      </ul>
                    </>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>Run an analysis to see results here.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3, borderColor: (theme) => theme.palette.divider }} />
      <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>Note: Charts use mock data. The analyzer runs lightweight heuristic checks server-side.</Typography>
    </Box>
  );
};

export default Analytics;
