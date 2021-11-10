import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

// Coligny App specific modules
import ColignyAppHeader from './ColignyAppHeader.js';
import ColignyCalendarTable from './ColignyCalendarTable.js';
import {gToday, cToday} from './DateHelper.js';
import ColignyTheme from './ColignyTheme.js';
import {CalendarContext} from './CalendarContext.js';

function ColignyApp() {

	const [calContext, setCalContext] = React.useState(
		{
			year: cToday.getYear(),	
			month: cToday.getMonth()
		}
	);

  	return 	<ThemeProvider theme={ColignyTheme()}>
	      		<CssBaseline />
				<Box sx={{ flexGrow: 1 }}>
					<CalendarContext.Provider value={[calContext, setCalContext]}>
						<ColignyAppHeader/>
						<ColignyCalendarTable/>
					</CalendarContext.Provider>
				</Box>
			</ThemeProvider>;
};

ColignyApp.contextType = CalendarContext;

export default ColignyApp;