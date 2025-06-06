import { Alert, Autocomplete, Box, Button, FormLabel, Grid, Grid2, Stack, styled, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));



const KreirajPorudzbenicu = () => {

  const [plans,setPlans] = useState([]);
  const [stavke,setStavke] = useState([]);
  const [kolicina,setKolicina] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedStavka,setSelectedStavka] = useState(null);
  const [kupci,setKupci] = useState([]);
  const [selectedKupac,setSelectedKupac] = useState(null);
  const [success,setSuccess] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();

    const token = sessionStorage.getItem('jwt');
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const email = decodedPayload.email;

    try {
        const response = await axios.post('http://localhost:3000/rezervisane-kolicine',{
        PIB:selectedKupac.PIB,
        mejlKomercijaliste:email,
        kolicinaZaRezervaciju:kolicina,
        idGodisnjegPlanaFK:selectedPlan.idGodisnjegPlana,
        redniBrStavke:selectedStavka.redniBrStavke
      });
      
      setSuccess('Uspešno ste kreirali novu rezervisanu količinu!');

    } catch (error) {
      console.error('Nesacuvana forma!');
    }
  }

  React.useEffect(() => {
    if (success) {
      setKolicina(0);
      
      const timer = setTimeout(() => {
        setSuccess('');
        navigate('/kreiraj-porudzbenicu')
        window.location.reload(); 
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);



  useEffect(()=>{
    const fetchKupci = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/rezervisane-kolicine/kupci');
        setKupci(response.data);
      } catch (error) {
        console.error('Greška prilikom preuzimanja kupaca!');
    }
  }
    fetchKupci();
  },[])


  useEffect(()=>{
    const fetchPlans = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/godisnji-plan/all-active')
        setPlans(response.data);
      } catch (error) {
        console.error('Greška prilikom preuzimanja planova!');
      }
    }

    fetchPlans();
  },[])

  useEffect(()=>{
    const fetchPlans = async()=>{
      if(selectedPlan){
        try {
          setStavke(selectedPlan.stavke);
        } catch (error) {
          console.error('Ne valjaju ti stavke!');
        }
      }
    }
    fetchPlans();
  })
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
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2,marginTop:"2rem" }}>
        Kreiraj novu rezervisanu količinu
      </Typography>
      {success && (
                <Alert icon={<CheckIcon  fontSize="inherit" />} color="success" severity="success" onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
      <Grid2 container spacing={4}
            sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
      >
              <FormGrid size={{ xs: 12, md: 6 }} sx={{width:"60%"}} >

              <Stack direction="row" sx={{width:"100%"}} spacing={2}>
              <Stack sx={{width:"50%"}}>
              <FormLabel>
                Po godišnjem planu
              </FormLabel>
              <Autocomplete
              
              options={plans} 
              value = {selectedPlan}
              getOptionLabel={(option) => option.opisIDodatneNapomene || ""}
              onChange={(event, newValue) => {
                if(newValue==null){
                  setSelectedPlan(null)
                  setStavke([])
                }else{
                  setSelectedPlan(newValue);
                  
                }
              }}
              renderInput={(params) => <TextField {...params} label="Plan" variant='filled'/>}
              />
              </Stack> 

              <Stack sx={{width:"100%"}}>
              <FormLabel>
                Za stavku
              </FormLabel>
              <Autocomplete
              options={stavke}
              value = {selectedStavka}
              getOptionLabel={(option) => `Vino: ${option.vino.nazivVina} U proizvodnji: ${option.kolicina} litara Preostalo: ${option.preostalaKolicina} litara` || ""}
              onChange={(event, newValue) => {
                
                setSelectedStavka(newValue);
                  
              }}
              renderInput={(params) => <TextField {...params} label="Za stavku" variant='filled'/>}
              />
              </Stack>
              </Stack>
              
              
              <FormLabel htmlFor="kolicinaZaRezervaciju" required>
                Količina za rezervaciju
              </FormLabel>
              <TextField
                id="kolicinaZaRezervaciju"
                name="kolicinaZaRezervaciju"
                type="number"
                placeholder="Količina za rezervaciju"
                required
                size="medium"
                sx={{width:'100%'}}
                inputProps={{min:0}}
                value = {kolicina}
                onChange={(e) => setKolicina(e.target.value)}
              
              />
              
              <FormLabel requred>
                Kupac
              </FormLabel>
              <Autocomplete
              options={kupci}
              value = {selectedKupac}
              getOptionLabel={(option) => option.nazivFirme || ""}
              onChange={(event, newValue) => {
                setSelectedKupac(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Kupac" variant='filled'/>}
              />
              
              
               <Button onClick={handleSubmit} sx={{width:'100%', marginTop:'1rem'}}>Kreiraj rezervisanu količinu</Button>
              {/* <Button  sx={{width:'100%', marginTop:'1rem'}}>Kreiraj porudžbenicu</Button> */}
              
            </FormGrid>
              
      </Grid2>
      </Box>
    </Stack>
  </Box>
  )
}

export default KreirajPorudzbenicu