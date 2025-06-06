import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
const CustomizedDataGrid = ({ onRowSelected,refreshKey,isEditing, editedRow ,handleChange}) => {
  const [porudzbenice,setPorudzbenice] = useState([]);

  useEffect(() => {
    const fetchPorudzbenice = async()=>{
      try {
        const response = await axios.get('http://localhost:3000/rezervisane-kolicine');
        
        const remappedData = response.data.map(item => ({
          idRezervacije: item.idRezervacije,
          datumRezervacije: new Date(item.datumRezervacije).toLocaleDateString(),
          kolicinaZaRezervaciju: item.kolicinaZaRezervaciju,
          nazivVina: item.stavka.vino.nazivVina,
          nazivFirme: item.kupac.nazivFirme,
          kontaktTelefon: item.kupac.kontaktTelefon,
          mejlAdresa: item.kupac.mejlAdresa
        }));
  
        setPorudzbenice(remappedData);
        
      } catch (error) {
        console.error('Greška prilikom preuzimanja porudžbenica',error);
      }
    }
    
    fetchPorudzbenice();
  }, [refreshKey])





    const columns = [
    {
      type:'number',
      field: 'idRezervacije',
      headerName: 'ID Porudžbenice',
      flex: 0.5,
      minWidth: 120,
      
    },
    {
      type:'Date',
      field: 'datumRezervacije',
      headerName: 'Datum poručivanja',
      //headerAlign: 'right',
      //align: 'right',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('sr-RS', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      type:'Number',
      field: 'kolicinaZaRezervaciju',
      headerName: 'Poručena količina',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return isEditing && params.row.idRezervacije === editedRow?.idRezervacije ? (
          <TextField
            inputProps={{min:0}}
            type="number"
            name="kolicinaZaRezervaciju"
            value={editedRow.kolicinaZaRezervaciju || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
        ) : (
          params.value
        );
      },
    },
   
    {
      type:'string',
      field: 'nazivVina',
      headerName: 'Naziv vina',
      flex: 1,
      minWidth: 80,
      
    },
  
    {
      type:'string',
      field: 'nazivFirme',
      headerName: 'Naziv kupca',
      flex: 1,
      minWidth: 80,
      
    },    
  
    {
      type:'string',
      field: 'kontaktTelefon',
      headerName: 'Kontakt telefon',
      flex: 1,
      minWidth: 200,
    },
    {
        type:'string',
        field:'mejlAdresa',
        headerName:'Kontakt mejl',
        flex:1,
        minWidth:200,
    }
  ];

  
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    idRezervacije:false,
    datumRezervacije:true,
    kolicinaZaRezervaciju:true,
    nazivVina:true,
    nazivFirme:true,
    konktaktTelefon:true,
    mejlAndresa:true

  });

  const handleSelectionChange = (selectionModel) => {
    const selectedId = selectionModel[0]; 
    const selectedRow = porudzbenice.find((row) => row.idRezervacije === selectedId);
    onRowSelected(selectedRow);
  };

  return (
    
    <DataGrid
      onRowSelectionModelChange={handleSelectionChange}
    
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      autoHeight
      //checkboxSelection
      //rows={plans}
      rows = {porudzbenice}
      columns={columns}
      getRowId={(row) => row.idRezervacije}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
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
  );
}
export default CustomizedDataGrid;