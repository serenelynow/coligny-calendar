import * as React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';

// Coligny App specific modules
import ColignyAppHeader from './ColignyAppHeader.js';
import ColignyCalendarTable from './ColignyCalendarTable.js';
import {Today} from './DateHelper.js';

export default function ColignyApp() {

	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	// const prefersDarkMode = false;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        components: {
			    MuiTableHead: {
			      styleOverrides: {
			        root: prefersDarkMode ? {backgroundColor: grey[800]} : {backgroundColor: grey[300], borderColor: grey[700], borderWidth: 1, borderStyle: 'solid', borderRight: 'none', borderLeft: 'none'},
			      },
			    },
  			}
      }),
    [prefersDarkMode],
  );

  return 	<ThemeProvider theme={theme}>
			      <CssBaseline />
						  <Box sx={{ flexGrow: 1 }}>
						    <ColignyAppHeader/>
						    <ColignyCalendarTable
						    	date={Today}
						    />
						  </Box>
				  </ThemeProvider>;
};