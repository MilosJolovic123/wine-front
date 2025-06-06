import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Autocomplete, Box, Button, FormLabel, Grid2, Stack, styled, TextField, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

const initialRows = []

const FormGrid = styled(Grid2)(() => ({
  display: "flex",
  flexDirection: "column",
}));

function EditToolbar(props) {
  const { setRows, setRowModesModel, nextId } = props;
  
  const handleClick = () => {
    const id = nextId();
    setRows((oldRows) => [
      ...oldRows,
      {
        redniBrojStavkeProizvodnogLista: id,
        naziv: '',
        kolicina: 0,
      },
        
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nazivEnoloskogAditiva' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Dodaj stavku
      </Button>
    </GridToolbarContainer>
  );
}

const KreirajPL = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [success,setSuccess] = React.useState('');
  const [opisIDodatneNapomene,setOpisIDodatneNapomene] = React.useState('');
  const [plans,setPlans] = React.useState([]);
  const [stavke,setStavke] = React.useState([]);
  const [kolicina,setKolicina] = React.useState(0);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [selectedStavka,setSelectedStavka] = React.useState(null);
  const [grozdje,setGrozdje] = React.useState([]);
  const [selectedGrozdje,setSelectedGrozdje] = React.useState(null);
  const [koncentracijaSecera,setKoncentracijaSecera] = React.useState(0);
  const [nivoKiselina,setNivoKiselina] = React.useState(0);
  const navigate = useNavigate();
  //Hendler za POST req
  const handleSubmit = async(e)=>{
    e.preventDefault();

    const token = sessionStorage.getItem('jwt');
    const payloadBase64 = token.split('.')[1]; 
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const email = decodedPayload.email;
    
    const grozdje = {
      idGrozdja:selectedGrozdje.idGrozdja
    }

    const sira = {
      koncentracijaSecera:koncentracijaSecera,
      nivoKiselina:nivoKiselina,
      kolicina:kolicina
    }

    const proizvodniList = {
      opisINapomene:opisIDodatneNapomene,
      mejlEnologa:email,
      idGodPlana:selectedPlan.idGodisnjegPlana,
      idStavkeGodPlana:selectedPlan.redniBrStavke,
      stavke:rows
    }

    try {
      const response = await axios.post('http://localhost:3000/proizvodni-list',{
        grozdje,
        sira,
        proizvodniList
      });
      setSuccess("Uspešno ste kreirali novi proizvodni list!");
    } catch (error) {
      console.error("Neuspešno kreiran proizvodni list!");
    }

  }

  React.useEffect(() => {
    if (success) {
      setKolicina(0);
      
      const timer = setTimeout(() => {
        setSuccess('');
        navigate('/kreiraj-proizvodni-list')
        window.location.reload(); 
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  const getNextId = () => {
    return rows.length ? Math.max(...rows.map((row) => row.redniBrojStavkeProizvodnogLista)) + 1 : 1;
  };
  
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const newRows = rows.filter((row) => row.redniBrojStavkeProizvodnogLista !== id);
    const renumberedRows = newRows.map((row, index) => ({
      ...row,
      redniBrojStavkeProizvodnogLista: index + 1,
    }));
    setRows(renumberedRows);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.redniBrojStavkeProizvodnogLista === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.redniBrojStavkeProizvodnogLista !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.redniBrojStavkeProizvodnogLista === newRow.redniBrojStavkeProizvodnogLista ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

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

  useEffect(()=>{
    const fetchGrozdje = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/proizvodni-list/grozdje');
        setGrozdje(response.data);
      } catch (error) {
        
      }
    }
    fetchGrozdje();
  },[])

  const columns = [
    { type: "number", field: 'redniBrojStavkeProizvodnogLista', headerName: 'Redni broj stavke', flex: 0.5, minWidth: 90, align: 'left', headerAlign: 'left' },
    { type: 'singleSelect', field: 'naziv', headerName: 'Naziv enološkog aditiva', flex: 0.5, minWidth: 120, editable: true, valueOptions: ['Kvasac','Sumpor dioksid','Kalijum bitartrat','Tanin','Šećer','Enzim','Glicerol'] },
    { type: "number", field: 'kolicina', headerName: 'Količina', flex: 0.5, minWidth: 90, editable: true, align: 'left', headerAlign: 'left' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 140,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          
        ];
      },
    },
  ];

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
  <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginTop:"1rem"}}>
      Kreiraj novi Proizvodni list
  </Typography>
 
  <Grid2 container spacing={4}
                sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
                >
                  <FormGrid size={{ xs: 12, md: 6 }} >
                  <Stack direction="row" sx={{width:"100%"}} spacing={2}>
              <Stack sx={{width:"50%"}}>
              <FormLabel required>
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
              <FormLabel required>
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
                  <FormLabel sx={{marginTop:"1rem"}} htmlFor="opisIDodatneNapomene" required>
                    Opis aktivnosti i dodatne napomene za plan
                  </FormLabel>
                  <TextField
                    id="opisIDodatneNapomene"
                    name="opisIDodatneNapomene"
                    type="textField"
                    placeholder="Opis i dodatne napomene plana"
                    required
                    size="medium"
                    value = {opisIDodatneNapomene}
                    onChange={(e) => setOpisIDodatneNapomene(e.target.value)}
                    />
                    <Stack direction="row" sx={{width:"100%"}} spacing={2}>
                    <Stack>
                    <FormLabel sx={{marginTop:"1rem"}} required>
                      Koncentracija šećera (briks)
                    </FormLabel>
                    <TextField
                    id="koncentracijaSecera"
                    name = "koncentracijaSecera"
                    type = "number"
                    required
                    size = "medium"
                    value = {koncentracijaSecera}
                    onChange = {(e)=>setKoncentracijaSecera(e.target.value)}
                    
                    />
                    </Stack>
                    <Stack>

                    <FormLabel sx={{marginTop:"1rem"}} required>
                      Nivo kiselina (gram po litru)
                    </FormLabel>
                    <TextField
                    id="nivoKiselina"
                    name = "nivoKiselina"
                    type = "number"
                    required
                    size = "medium"
                    value = {nivoKiselina}
                    onChange = {(e)=>setNivoKiselina(e.target.value)}
                    />
                    </Stack>
                    <Stack>

                    <FormLabel sx={{marginTop:"1rem"}} required>
                      Količina (u litrima)
                    </FormLabel>
                    <TextField
                    id="kolicina"
                    name = "kolicina"
                    type = "number"
                    required
                    size = "medium"
                    value = {kolicina}
                    onChange = {(e)=>setKolicina(e.target.value)}
                    />
                    </Stack>
                    </Stack>
                    <FormLabel required>
                    Grožđe
                    </FormLabel>
                    <Autocomplete
              
              options={grozdje} 
              value = {selectedGrozdje}
              getOptionLabel={(option) => option.nazivGrozdja || ""}
              onChange={(event, newValue) => {
                setSelectedGrozdje(newValue);  
              }}
              renderInput={(params) => <TextField {...params} label="Grožđe" variant='filled'/>}
              />
                    </FormGrid>
                    <Accordion sx={{width:"100%"}}>
        <AccordionSummary sx={{width:"100%"}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Dodaj stavke
        </AccordionSummary>
                  <AccordionDetails sx={{display:"flex", justifyContent:"center",alignItems:"center",width:"100%"}}>
                  <Grid2 size={{ md: 12, lg: 20 }} sx={{ height: 400, width: "80%" }}>
                  <DataGrid
                
                  sx={{marginTop:"1rem"}}
                  rows={rows}
                  editMode="row"
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      }
                    },
                  }}
                  getRowId={(row) => row.redniBrojStavkeProizvodnogLista}
                  pageSizeOptions={[5, 10, 20]}
                  checkBoxSelection
                  disableRowSelectionOnClick
                  
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  slots={{
                    toolbar: EditToolbar,
                  }}
                  slotProps={{
                    toolbar: { setRows, setRowModesModel, nextId: getNextId },
                  }}
                />
              </Grid2>
                  </AccordionDetails>
                  </Accordion>
              <Button onClick={handleSubmit}>Kreiraj novi proizvodni list</Button>
              
              </Grid2>
              {success && (
                <Alert icon={<CheckIcon  fontSize="inherit" />} color="success" severity="success" onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
                   
  </Box>
  </Stack>
  </Box>
  )
}

export default KreirajPL