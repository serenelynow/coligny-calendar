import * as React from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';

// Coligny App specific modules
import ColignyAppHeader from './ColignyAppHeader.js';
import ColignyCalendarTable from './ColignyCalendarTable.js';
import {gToday, cToday} from './DateHelper.js';

export const CalendarContext = React.createContext([{}, () => {}]);

export default function ColignyApp() {

	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

	const [calContext, setCalContext] = React.useState(
		{
			year: cToday.getYear(),	
			month: cToday.getMonth(),
		}
	);

  return 	<ThemeProvider theme={theme}>
			      <CssBaseline />
						  <Box sx={{ flexGrow: 1 }}>
						  	<CalendarContext.Provider value={[calContext, setCalContext]}>
							    <ColignyAppHeader/>
							    <ColignyCalendarTable/>
						    </CalendarContext.Provider>
						  </Box>
				  </ThemeProvider>;
};