import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AddIcon from '@mui/icons-material/Add';
import jwtDecode from "jwt-decode";

  
  export default function MenuContent() {
  const navigate = useNavigate();
  
  const getUserRole = () =>{
    const token = sessionStorage.getItem('jwt');
    if(token){
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  const userRole = getUserRole();
  // Definiši stavke menija sa odgovarajućim onClick handler-ima
  const mainListItems = [
    {text: 'Home strana', icon: <HomeRoundedIcon />, onClick: () => {navigate('/');} },
    {role: ["Šef proizvodnje"],text: 'Kreiraj novi plan proizvodnje', icon: <AddIcon/>, onClick: () => {navigate('/kreiraj-plan'); } },
    {role: ["Šef proizvodnje"],text:'Pogledaj sve planove proizvodnje',icon:<AnalyticsRoundedIcon/>,onClick: ()=>{navigate('/svi-planovi'); }},
    {role:["Komercijalista"],text:'Kreiraj novu rezervisanu količinu',icon:<AddIcon/>,onClick: ()=>{navigate('/kreiraj-porudzbenicu'); }},
    {role:["Komercijalista"],text:'Pogledaj sve rezervisane količine',icon:<AnalyticsRoundedIcon/>,onClick:()=>{navigate('/sve-porudzbenice'); }},
    {role:["Enolog","Šef proizvodnje"],text:"Pogledaj sve proizvodne listove",icon:<AnalyticsRoundedIcon/>,onClick:()=>{navigate('/svi-proizvodni-listovi'); }},
    {role:["Enolog"],text:"Kreiraj novi proizvodni list",icon:<AddIcon/>,onClick:()=>{navigate('/kreiraj-proizvodni-list'); }}
    // Dodaj ostale stavke menija ovde sa svojim onClick funkcijama
  ];

  const secondaryListItems = [
    // Dodaj sekundarne stavke menija ako ih ima
  ];

  

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems
        .filter(item => !item.role || item.role.includes(userRole))
        .map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={item.onClick} selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}