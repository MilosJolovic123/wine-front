import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Button, FormLabel, Stack, styled, TextField, Typography, Alert, Snackbar } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {DataGrid} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SubTableDialog from './components/SubTableComponent'
import CheckIcon from '@mui/icons-material/Check';

import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
 
} from '@mui/x-data-grid';
import axios from "axios";

const initialRows = [];

const FormGrid = styled(Grid)(() => ({
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
        redniBrStavke: id,
        opisIDodatneNapomene: '',
        nazivVina: '',
        kolicina: 0,
        subRows: [], // Initialize with an empty array
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'opisIDodatneNapomene' },
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

export default function KreirajPlan() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [success,setSuccess] = React.useState('');
  const [opisIDodatneNapomene,setOpisIDodatneNapomene] = React.useState('');
  const [datumPocetkaRealizacije,setDatumPocetkaRealizacije] = React.useState(null);
  const [datumZavrsetkaRealizacije,setDatumZavrsetkaRealizacije] = React.useState(null);
  
  const handleSubmit = async(e)=>{
    e.preventDefault();

    const token = sessionStorage.getItem('jwt');
    
        const stavkeSaRepromaterijalima = rows.map((row) => ({
          redniBrStavke: row.redniBrStavke,
          opisIDodatneNapomene: row.opisIDodatneNapomene,
          nazivVina: row.nazivVina,
          kolicina: row.kolicina,
          repromaterijali: row.subRows // Ugnježdeni elementi (repromaterijali)
        }));
        
        try {
          const response = await axios.post('http://localhost:3000/godisnji-plan',{
            opisIDodatneNapomene,
            datumPocetkaRealizacije,
            datumZavrsetkaRealizacije,
            stavke:stavkeSaRepromaterijalima,
            
          },{headers:{'Authorization':`Bearer ${token}`}}).then((response)=>{
            setSuccess('Uspešno ste kreirali novi plan proizvodnje!');
          });
    
        } catch (error) {
          console.log('Neuspesno predavanje obrasca!');
        }
      }
  
      React.useEffect(() => {
        if (success) {
          setDatumPocetkaRealizacije(null);
          setDatumZavrsetkaRealizacije(null);
          setOpisIDodatneNapomene('');
          setRows(initialRows);
          const timer = setTimeout(() => {
            setSuccess(''); 
          }, 5000);
          
          return () => clearTimeout(timer);
        }
      }, [success]);
      
      const handleOpenDialog = (id) => {
        setSelectedRowId(id);
        setOpenDialog(true);
      };
      
      const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRowId(null);
      };
      
      const getNextId = () => {
        return rows.length ? Math.max(...rows.map((row) => row.redniBrStavke)) + 1 : 1;
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
        const newRows = rows.filter((row) => row.redniBrStavke !== id);
        const renumberedRows = newRows.map((row, index) => ({
          ...row,
          redniBrStavke: index + 1, // Start numbering from 1
        }));
        setRows(renumberedRows);
      };
    
      const handleCancelClick = (id) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = rows.find((row) => row.redniBrStavke === id);
        if (editedRow.isNew) {
          setRows(rows.filter((row) => row.redniBrStavke !== id));
        }
      };
    
      const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.redniBrStavke === newRow.redniBrStavke ? updatedRow : row)));
        return updatedRow;
      };
    
      const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
      };
    
      const columns = [
        { type: "number", field: 'redniBrStavke', headerName: 'Redni broj stavke', flex: 0.5, minWidth: 90, align: 'left', headerAlign: 'left' },
        { type: "string", field: 'opisIDodatneNapomene', headerName: 'Opis stavke', flex: 0.5, minWidth: 90, editable: true },
        { type: 'singleSelect', field: 'nazivVina', headerName: 'Naziv vina', flex: 0.5, minWidth: 120, editable: true, valueOptions: ['Merlot', 'Chardonnay', 'Cabernet Sauvignon', 'Sauvignon Blanc', 'Pinot Noir'] },
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
              <GridActionsCellItem
                icon={<AddIcon />}
                label="Manage Sub-Table"
                onClick={() => handleOpenDialog(id)}
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
            <Box sx={{ width: '90%', maxWidth: { sm: '100%', md: '1700px' } }}>
              <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Kreiranje novog proizvodnog plana
              </Typography>
              
              {success && (
                <Alert icon={<CheckIcon  fontSize="inherit" />} color="success" severity="success" onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
                
              <Grid container spacing={4}
                sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
              >
                <FormGrid size={{ xs: 12, md: 6 }} >
                  <FormLabel htmlFor="opisIDodatneNapomene" required>
                    Naziv plana
                  </FormLabel>
                  <TextField
                    id="opisIDodatneNapomene"
                    name="opisIDodatneNapomene"
                    type="textField"
                    placeholder="Naziv plana"
                    required
                    size="medium"
                    value = {opisIDodatneNapomene}
                    onChange={(e) => setOpisIDodatneNapomene(e.target.value)}
                  />
                  <FormLabel>
                    Datum početka realizacije
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={datumPocetkaRealizacije} name="datumPocetkaRealizacije" sx={{ width: "100%" }} onChange={(e) => setDatumPocetkaRealizacije(e)} />
                    </DemoContainer>
                  </LocalizationProvider>
                  <FormLabel>
                    Datum završetka realizacije
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} >
                      <DatePicker value={datumZavrsetkaRealizacije} name="datumZavrsetkaRealizacije" sx={{ width: "100%" }} onChange={(e) => setDatumZavrsetkaRealizacije(e)}/>
                    </DemoContainer>
                  </LocalizationProvider>
                </FormGrid>
              </Grid>
              <Grid size={{ md: 12, lg: 20 }} sx={{ height: 320, width: "80%" }}>
                <DataGrid
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
                  getRowId={(row) => row.redniBrStavke}
                  pageSizeOptions={[5, 10, 20]}
                  checkBoxSelection
                  disableRowSelectionOnClick
                  sx={{ marginTop: "1rem" }}
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
              </Grid>
            </Box>
            <Button onClick={handleSubmit} sx={{ marginTop: "1rem" }} variant="outlined">Kreiraj plan proizvodnje</Button>
            <SubTableDialog
              open={openDialog}
              onClose={handleCloseDialog}
              rows={rows.find((row) => row.redniBrStavke === selectedRowId)?.subRows || []}
              setRows={(subRows) => {
                const updatedRows = rows.map((row) =>
                  row.redniBrStavke === selectedRowId ? { ...row, subRows } : row
                );
                setRows(updatedRows);
              }}
              rowId={selectedRowId}
            />
          </Stack>
        </Box>
      );
    }
      
      
  





   
   














         
            

 
