import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import CustomizedDataGridStavke from './CustomizedDataGridStavke';

const data = [
  //proveri bazu jos jednom
  {
    title: 'Količine vina koje se proizvodi',
    value: '240 litara',
    interval: 'Poslednjih godinu dana',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Broj aktivnih proizvodnih planova',
    value: '3',
    interval: 'Poslednjih godinu dana',
    trend: 'up',
    data: [
      1, 2, 3, 3, 7, 6, 6, 8, 15, 5, 4, 4, 3, 3, 2,
      16, 12, 9, 11, 16, 9, 7, 10, 9, 4, 9, 8, 8, 6, 8,
    ],
  },
  {
    title: 'Broj završenih godišnjih planova',
    value: '57',
    interval: 'Poslednjih 5 godina',
    trend: 'neutral',
    data: [
      1, 2, 3, 3, 7, 6, 6, 8, 15, 5, 4, 4, 3, 3, 2,
      16, 12, 9, 11, 16, 9, 7, 10, 9, 4, 9, 17, 8, 6, 20,
    ],
  },
  {
    title: 'Broj sorti vina koje proizvodimo',
    value: '26',
    interval: 'Poslednje 2 godine',
    trend: 'neutral',
    data: [
      1, 2, 3, 3, 7, 6, 4
    ],
  }
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '90%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Pregled
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
       
        <Grid size={{ sm: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Proizvodni planovi
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ md: 12, lg: 20 }}>
          <CustomizedDataGrid sx={{height:'300px'}} />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
       
