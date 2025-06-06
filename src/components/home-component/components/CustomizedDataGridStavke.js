import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState,useEffect } from 'react';
import axios from 'axios';
const CustomizedDataGridStavke = () => {
    const[plans,setPlans] = useState([]);
  
  useEffect(() => {
    const fetchPlans = async()=>{
      try {
        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('http://localhost:3000/godisnji-plan',{
          headers:{'Authorization':`Bearer ${token}`}});
        
        const allStavke = response.data.reduce((acc, plan) => {
            const stavke = plan.stavke.map(stavka => {
              return {
                ...stavka,
                nazivVina: stavka.vino.nazivVina,
                procenatAlkohola: stavka.vino.procenatAlkohola,
                godinaBerbe: stavka.vino.godinaBerbe
              };
            });
            return acc.concat(stavke);
          }, []);
        setPlans(allStavke);
      } catch (error) {
        console.error('Greška prilikom preuzimanja planova',error);
      }
    }
    
    fetchPlans();
  }, [])

  

const columns =[
    {
        type:'number',
        field:'idGodisnjegPlanaFK',
        headerName:'ID plana proizvodnje'
    },
    {
        type:'string',
        field: 'opisIDodatneNapomene',
        headerName: 'Opis stavke',
        flex: 0.5,
        minWidth: 120,
    },
    {
        type:'string',
        field: 'nazivVina',
        headerName: 'Naziv vina',
        flex: 0.5,
        minWidth: 120,
    },
    {
        type:'number',
        field: 'kolicina',
        headerName: 'Količina u litrima',
        flex: 0.5,
        minWidth: 120, 
    },
    {
        type:'number',
        field: 'procenatAlkohola',
        headerName: 'Procenat alkohola',
        flex: 0.5,
        minWidth: 120, 
    },
    {
        type:'Date',
        field:'godinaBerbe',
        headerName:'Godina berbe',
        flex:0.5,
        minWidth:120,
        headerAlign: 'right',
        align: 'right',
    }

]

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={plans}
      columns={columns}
      getRowId={(row) => row.idGodisnjegPlanaFK}
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
  )
}

export default CustomizedDataGridStavke