import { Box, Button, Grid, Grid2, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import CustomizedDataGrid from '../home-component/components/CustomizedDataGrid'
import axios from 'axios'
import StatCard from '../home-component/components/StatCard'

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

const PregledajSvePlanove = () => {
  const token = sessionStorage.getItem('jwt');
  const [selectedRow,setSelectedRow] = useState(null);
  const [refreshKey,setRefreshKey] = useState(0);
  const handleRowSelection = (selectedRow) =>{
    setSelectedRow(selectedRow);
  }

  const handleActivate = async() =>{
    if(selectedRow){
      
      try {
        console.log(token);
        await axios.patch(`http://localhost:3000/godisnji-plan/activate/${selectedRow.idGodisnjegPlana}`,{},{headers:{'Authorization':`Bearer ${token}`}});
        alert('Uspešno ste aktivirali plan!');
        setRefreshKey((oldKey)=>oldKey+1);
      } catch (error) {
        console.error('Plan nije aktiviran!');
      }
    }
  } 

  const handleDeactivate = async() =>{
    if(selectedRow){
      try {
        console.log(token)
        await axios.patch(`http://localhost:3000/godisnji-plan/deactivate/${selectedRow.idGodisnjegPlana}`,{},{headers:{'Authorization':`Bearer ${token}`}});
        alert('Uspešno ste deaktivirali plan!');
        setRefreshKey((oldKey)=>oldKey+1);
      } catch (error) {
        console.error('Plan nije deaktiviran!');
      }
    }
  }

  const handleClose = async() =>{
    if(selectedRow){
      try {
        console.log('jwt')
        await axios.patch(`http://localhost:3000/godisnji-plan/close/${selectedRow.idGodisnjegPlana}`,{},{headers:{'Authorization':`Bearer ${token}`}});
        alert('Uspešno ste označili plan proizvodnje kao završen!');
        setRefreshKey((oldKey)=>oldKey+1);
      } catch (error) {
        console.error('Plan nije zatvoren!');
      }
    }
  }

  const handleDelete = async()=>{
    try {
      await axios.delete(`http://localhost:3000/godisnji-plan/${selectedRow.idGodisnjegPlana}`,{headers:{'Authorization':`Bearer ${token}`}});
      alert('Uspešno ste izbrisali plan proizvodnje!');
      setRefreshKey((oldKey)=>oldKey+1);
    } catch (error) {
      console.error('Plan nije zatvoren!');
    }
  }
  

  return (
    <Box
    component="main"
    sx={(theme) => ({
      position: { sm: 'relative', md: '' },
      top: { sm: '48px', md: '60px' },
      height: { sm: 'calc(100vh - 48px)', md: '100vh' },
      flexGrow: 1,
      //backgroundColor: alpha(theme.palette.background.default, 1),
      overflow: 'auto',
    })}
  >
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        mx: 3,
        pb: 10,
        mt: { xs: 16, sm: 10, md: 0 },
      }}
    >
         <Box sx={{ width: '80%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginTop:"2rem"}}>
            Pregled svih proizvodnih planova
        </Typography>
        <Grid2
        container
        spacing={4}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid2>
        ))}
      </Grid2>
      
        <Grid2 size={{ md: 12, lg: 20 }}>
          <CustomizedDataGrid key={refreshKey} onRowSelected={handleRowSelection} />
        </Grid2>
        <Button sx={{marginTop:"1rem"}} onClick={handleDelete} disabled={!selectedRow || (selectedRow.aktivan)} >Izbriši izabrani</Button>
        <Button  sx={{marginTop:"1rem"}} onClick={handleActivate} disabled={!selectedRow || ((selectedRow.zavrsen)) || (selectedRow.aktivan && !selectedRow.zavrsen)}>Aktiviraj izabrani</Button>
        <Button sx={{marginTop:"1rem"}} onClick={handleDeactivate} disabled={!selectedRow  || (selectedRow.zavrsen) || (!selectedRow.aktivan && !selectedRow.zavrsen)}>Deaktiviraj izabrani</Button>
        <Button sx={{marginTop:"1rem"}} onClick={handleClose} disabled={!selectedRow ||(!selectedRow.aktivan)}>Označi završen plan</Button>
      </Box> 
    </Stack>
  </Box>
  )
}

export default PregledajSvePlanove