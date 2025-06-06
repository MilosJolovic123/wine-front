import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ToggleColorMode from '../login-component/ToggleColorMode';
import getSignInTheme from '../login-component/theme/getSignInTheme';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  
  position: 'fixed',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  backgroundImage: 'none',
  padding: 4,
}));

function NavBar({ showCustomTheme, toggleCustomTheme, mode, toggleColorMode }) {
  const handleChange = (event) => {
    toggleCustomTheme(event.target.value === 'custom');
  };
  const signInTheme = createTheme(getSignInTheme(mode));

  return (
<ThemeProvider theme={signInTheme}>
  <StyledAppBar>
        <Box 
        sx={{marginRight:'38px' }}
        >
          <ToggleColorMode
            data-screenshot="toggle-mode"
            mode={mode}
            toggleColorMode={toggleColorMode}
          />
        </Box>
  </StyledAppBar>
</ThemeProvider>

  );
}
   
        
           
           

NavBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  showCustomTheme: PropTypes.bool.isRequired,
  toggleColorMode: PropTypes.func.isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default NavBar;
