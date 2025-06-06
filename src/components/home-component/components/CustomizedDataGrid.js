import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState,useEffect } from 'react';
import axios from 'axios';
const CustomizedDataGrid = ({ onRowSelected,refreshKey }) => {
  const[plans,setPlans] = useState([]);
  
  useEffect(() => {
    const fetchPlans = async()=>{
      try {
        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('http://localhost:3000/godisnji-plan',{
          headers:{'Authorization':`Bearer ${token}`}
        });
        
        setPlans(response.data);
        
      } catch (error) {
        console.error('Greška prilikom preuzimanja planova',error);
      }
    }
    
    fetchPlans();
  }, [refreshKey])

  const columns = [
  {
    type:'number',
    field: 'idGodisnjegPlana',
    headerName: 'ID Plana',
    flex: 0.5,
    minWidth: 120,
    
  },
  {
    type:'Date',
    field: 'datumPocetkaRealizacije',
    headerName: 'Datum početka realizacije',
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
    type:'Date',
    field: 'datumZavrsetkaRealizacije',
    headerName: 'Datum završetka realizacije',
   // headerAlign: 'right',
   // align: 'right',
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
    type:'boolean',
    field: 'zavrsen',
    headerName: 'Završen?',
   // headerAlign: 'right',
   // align: 'right',
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      //console.log('Vrednost u valueFormatter za zavrsen:', params.value);
      return params.value ? 'da' : 'ne';
    }
  },

  {
    type:'boolean',
    field: 'aktivan',
    headerName: 'Aktivan?',
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      //console.log('Vrednost u valueFormatter za zavrsen:', params.value);
      return params.value ? 'da' : 'ne';
    }
  },    

  {
    type:'string',
    field: 'opisIDodatneNapomene',
    headerName: 'Opis/napomene',
    //headerAlign: 'right',
    //align: 'right',
    flex: 1,
    minWidth: 200,
  },
];

const handleSelectionChange = (selectionModel) => {
  const selectedId = selectionModel[0]; 
  const selectedRow = plans.find((row) => row.idGodisnjegPlana === selectedId);
  onRowSelected(selectedRow);
};

const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
  opisIDodatneNapomene:true,
  idGodisnjegPlana:false,
  datumPocetkaRealizacije:true,
  datumZavrsetkaRealizacije:true,
  aktivan:true,
  zavrsen:true

});

return (
  
  <DataGrid
    onRowSelectionModelChange={handleSelectionChange}
    columnVisibilityModel={columnVisibilityModel}
    onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
    sx={{height:'300px'}}
    rows={plans}
    columns={columns}
    getRowId={(row) => row.idGodisnjegPlana}
    getRowClassName={(params) =>
      params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
    }
    initialState={{
      pagination: { paginationModel: { pageSize: 10 } },
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

  




