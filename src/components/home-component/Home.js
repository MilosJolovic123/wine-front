import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from './components/Header';
import MainGrid from './components/MainGrid';

export default function Home() {
  
  return (
    // <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
    //   <CssBaseline />
    //   <NavBar
    //     toggleCustomTheme={toggleCustomTheme}
    //     showCustomTheme={showCustomTheme}
    //     mode={mode}
    //     toggleColorMode={toggleColorMode}
    //   />
    //   <Box sx={{ display: 'flex' }}>
    //     <SideMenu />
    //     <AppNavbar />
    //     {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            position: { sm: 'relative', md: '' },
            top: { sm: '48px', md: '60px' },
            height: { sm: 'calc(100vh - 48px)', md: '100vh' },
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
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
            <Header />
            <MainGrid />
          </Stack>
        </Box>
  );
}
