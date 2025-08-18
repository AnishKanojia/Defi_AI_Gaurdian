import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StatCard from '../components/StatCard.tsx';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BoltIcon from '@mui/icons-material/Bolt';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Overview</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="NETWORK RISK" value={"42.5"} subtitle="Updated just now" icon={<SecurityIcon />} color="#00d4aa" minHeight={140} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="ACTIVE ALERTS" value={15} subtitle="Past 24 hours" icon={<WarningIcon />} color="#f7931e" minHeight={140} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="TX VOLUME" value={'1.2M'} subtitle="Past 24 hours" icon={<ShowChartIcon />} color="#5b8def" minHeight={140} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="TPS" value={'7.3'} subtitle="Live" icon={<BoltIcon />} color="#a855f7" minHeight={140} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card className="hover-card" sx={{ background: '#151515', border: '1px solid #2c2c2c', height: 420, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Risk Trend</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderRadius: 1, border: '1px dashed #2b2b2b' }}>
                Chart placeholder (connect to data later)
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="hover-card" sx={{ background: '#151515', border: '1px solid #2c2c2c', height: 420, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Alerts</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderRadius: 1, border: '1px dashed #2b2b2b' }}>
                Alerts list placeholder
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
