import { Accordion, AccordionDetails, AccordionSummary, Button, Grid2 } from '@mui/material';
import { DataGrid, GridExpandMoreIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';



const CustomizedDataGridPL = ({ onRowSelection }) => {
  const [rows, setRows] = useState([]);
  const [itemRows, setItemRows] = useState([]);
  const [SelectedRowId,setSelectedRowId] = useState(null);
  const [refreshKey,setRefreshKey] = useState(0);
  const [role,setRole] = useState('');
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedId = selectionModel[0];
      setSelectedRowId(selectedId);
      if (onRowSelection) {
        onRowSelection(selectedId); 
      }
      fetchStavke(selectedId); 
    }
    else {
    
    setSelectedRowId(null);
    setItemRows([]);
  }
  };
  useEffect(() => {
  const fetchListovi = async () => {
    const token = sessionStorage.getItem('jwt');
    const payloadBase64 = token.split('.')[1]; 
    const decodedPayload = JSON.parse(atob(payloadBase64));
    setRole(decodedPayload.role);
    
    try {
      const response = await axios.get('http://localhost:3000/proizvodni-list');
      const remappedData = response.data.map(item => ({
        idPLista: item.idPLista,
        opisIDodatneNapomene: item.opisINapomene,
        datumPrvogIzdavanja: item.datumPrvogIzdavanja,
        nazivGrozdja:item.sira[0].grozdje.nazivGrozdja,
        koncentracijaSecera:item.sira[0].koncentracijaSecera,
        nivoKiselina:item.sira[0].nivoKiselina,
        kolicina:item.sira[0].kolicina
      }));
      setRows(remappedData);
      
    } catch (error) {
      console.error('Greška prilikom preuzimanja proizvodnih listova', error);
    }
  };
  fetchListovi();
},[refreshKey])
  const fetchStavke = async (idPLista) => {
    try {
      const response = await axios.get(`http://localhost:3000/proizvodni-list/${idPLista}`);
      const stavkeData = response.data.stavkeProizvodnogLista.map(item => ({
        redniBrojStavkeProizvodnogLista: item.redniBrojStavkeProizvodnogLista,
        naziv: item.enoloskiAditiv.naziv,
        kolicina: item.kolicina,
      }));
      setItemRows(stavkeData);
    } catch (error) {
      console.error('Greška prilikom preuzimanja stavki', error);
    }
  };

  const handleDelete = async() =>{
    try {
      await axios.delete(`http://localhost:3000/proizvodni-list/${SelectedRowId}`);
      alert("Uspešno ste izbrisali proizvodni list");
      setRefreshKey((oldKey)=>oldKey+1);
    } catch (error) {
      console.error("Neuspelo brisanje kreiranog rada!");
    }
  };
    
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    idPLista:false,
    opisIDodatneNapomene:true,
    datumPrvogIzdavanja:true,
    nazivGrozdja:true,
    koncentracijaSecera:true,
    nivoKiselina:true,
    kolicina:true
  });
  

  const columns = [
    {
      type: 'number',
      field: 'idPLista',
      headerName: 'ID Proizvodnog lista',
      flex: 0.5,
      minWidth: 120,
    },
    {
      type: 'string',
      field: 'opisIDodatneNapomene',
      headerName: 'Opis i dodatne napomene',
      flex: 0.5,
      minWidth: 80
    },
    {
      type:'string',
      field:'nazivGrozdja',
      headerName:'Naziv grožđa',
      flex:0.5,
      minWidth:100
    },
    {
      type:'number',
      field:'koncentracijaSecera',
      headerName:'Koncentracija šećera (briks)',
      flex:0.5,
      minWidth:80
    },
    {
      type:'number',
      field:'nivoKiselina',
      headerName:'Nivo kiselina (gram po litru)',
      flex:0.5,
      minWidth:80
    },
    {
      type:'number',
      field:'kolicina',
      headerName:'Količina šire u litrima',
      flex:0.5,
      minWidth:80
    },
    {
      type: 'Date',
      field: 'datumPrvogIzdavanja',
      headerName: 'Datum izdavanja',
      flex: 0.5,
      minWidth: 200,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('sr-RS', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
   
  ];

  const subColumns = [
    { type: "number", field: 'redniBrojStavkeProizvodnogLista', headerName: 'Redni broj stavke', flex: 0.5, minWidth: 90, align: 'left', headerAlign: 'left' },
    { type: 'string', field: 'naziv', headerName: 'Naziv enološkog aditiva', flex: 0.5, minWidth: 120 },
    { type: "number", field: 'kolicina', headerName: 'Količina', flex: 0.5, minWidth: 90, align: 'left', headerAlign: 'left' },
  ];

  return (
    <Grid2 size={{ md: 12, lg: 20 }}>
      <DataGrid
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        columnVisibilityModel={columnVisibilityModel}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.idPLista}
        onRowSelectionModelChange={handleRowSelection}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
      <Accordion sx={{ width: "100%", marginTop: "1rem" }}>
        <AccordionSummary
          sx={{ width: "100%" }}
          expandIcon={<GridExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Pogledaj stavke izabranog lista
        </AccordionSummary>
        <AccordionDetails sx={{ width: "100%" }}>
          <Grid2 size={{ md: 12, lg: 20 }} sx={{ height: 300, width: "80%" }}>
            <DataGrid
              sx={{ marginTop: "1rem" }}
              rows={itemRows}
              editMode="row"
              columns={subColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  }
                },
              }}
              getRowId={(row) => row.redniBrojStavkeProizvodnogLista}
              pageSizeOptions={[5, 10, 20]}
            />
          </Grid2>
        </AccordionDetails>
      </Accordion>
      <Button disabled={SelectedRowId===null||role!='Enolog'} sx={{marginTop:"1rem"}} onClick={handleDelete}>Obriši kreirani list</Button>
    </Grid2>
  );
};

export default CustomizedDataGridPL;
