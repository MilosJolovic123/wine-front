import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ToggleColorMode from './components/ToggleColorMode';
import getDashboardTheme from './theme/getDashboardTheme';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuButton from './components/MenuButton';
import { useNavigate } from 'react-router-dom';
import SideMenu from './components/SideMenu';



const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  backgroundImage: 'none',
  padding: 4,
  zIndex: theme.zIndex.drawer + 1,
}));

function NavBar({ showCustomTheme, toggleCustomTheme, mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

 
  const handleChange = (event) => {
    toggleCustomTheme(event.target.value === 'custom');
  };
  const dashboardTheme = createTheme(getDashboardTheme(mode));

  return (
    <ThemeProvider theme={dashboardTheme}>
      <StyledAppBar>
        <Container maxWidth="xl">
          <Toolbar
            variant="dense"
            disableGutters
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
              <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuRoundedIcon />
              </MenuButton>
              <SideMenu open={open} toggleDrawer={toggleDrawer}/>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                <Select
                  size="small"
                  labelId="theme-select-label"
                  id="theme-select"
                  value={showCustomTheme ? 'custom' : 'material'}
                  onChange={handleChange}
                  label="Design Language"
                >
                  <MenuItem value="custom">Custom Theme</MenuItem>
                  <MenuItem value="material">Material Design 2</MenuItem>
                </Select>
              </FormControl>
              <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={toggleColorMode}
              />
            </Box>
          </Toolbar>
        </Container>
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
