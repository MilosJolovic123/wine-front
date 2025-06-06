import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import getDashboardTheme from '../home-component/theme/getDashboardTheme';
import AppNavbar from '../home-component/components/AppNavbar';
import SideMenu from '../home-component/components/SideMenu';
import NavBar from '../home-component/NavBar';
import jwtDecode from 'jwt-decode';


const ProtectedRoute = ({children,role})=>{
    
    const [mode, setMode] = React.useState('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const dashboardTheme = createTheme(getDashboardTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
  
  
    React.useEffect(() => {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode) {
          setMode(savedMode);
        } else {
          // If no preference is found, it uses system preference
          const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
          ).matches;
          setMode(systemPrefersDark ? 'dark' : 'light');
        }
      }, []);
    //403 logika
    //const token = Cookies.get('jwt');
      const token = sessionStorage.getItem('jwt');
      
      if(!token){
          return <Navigate to='/login'/>
      }
      
      
      const decodedToken = jwtDecode(token);
      if (!role.includes(decodedToken.role)) {
        return <Navigate to="/403" />; // 403 stranica
      }
      //kraj 403 logike

    const toggleColorMode = () => {
      const newMode = mode === 'dark' ? 'light' : 'dark';
      setMode(newMode);
      localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    };
  
    const toggleCustomTheme = () => {
      setShowCustomTheme((prev) => !prev);
    };
  
    return (
      <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
      <CssBaseline />
        <NavBar
        toggleCustomTheme={toggleCustomTheme}
        showCustomTheme={showCustomTheme}
        mode={mode}
        toggleColorMode={toggleColorMode}
        />
      <Box sx={{ display: 'flex' }}>
        {children}
      </Box>
    
    </ThemeProvider>
    );
};

export default ProtectedRoute;