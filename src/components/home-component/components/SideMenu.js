import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import LiquorIcon from '@mui/icons-material/Liquor';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

SideMenu.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func,
}

export default function SideMenu({open, toggleDrawer}) {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  //axios.defaults.withCredentials = true;
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
         //const jwtToken = Cookies.get('jwt');
         const jwtToken = sessionStorage.getItem('jwt');
         if(!jwtToken){
           console.log('No JWT token found');
         }
         //console.log(jwtToken)
        const response = await axios.get('http://localhost:3000/auth/profile',{withCredentials:true,
          headers:{'Authorization':`Bearer ${jwtToken}`},
        }).then((response)=>{
          setUser(response.data);
          
        }).catch((error)=> {
          console.error("Greska prilikom dohvatanja usera", error);
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUser();
  }, []);

  if (!user) {
    return null; 
  }


  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open = {open}
      onClose = {toggleDrawer(false)}
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems:'center',
          justifyContent:'center',
          mt: '60px',
          p: 1.5,
        }}
      >
        <Stack sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>

        <LiquorIcon></LiquorIcon>
        <Typography>
          Vinarija.rs
        </Typography>
        </Stack>
      </Box>
      <Divider />
      <MenuContent/>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AccountCircleIcon>
        </AccountCircleIcon>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user.role}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>
        </Box>
      </Stack>
      <Button onClick={handleLogout} variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
        Odjavi se
      </Button>

    </Drawer>
  );
}
        
        
        
 

