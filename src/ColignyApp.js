import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

// Coligny App specific modules
import ColignyAppHeader from './ColignyAppHeader.js';
import ColignyMonth from './ColignyMonth.js';
import ColignyCalendarTable from './ColignyCalendarTable.js';
import {gToday, cToday} from './DateHelper.js';
import ColignyTheme from './ColignyTheme.js';
import {CalendarContext} from './CalendarContext.js';

class ColignyApp extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			year: cToday.getYear(),	
			month: cToday.getMonth(),
			calendar: new ColignyMonth(),
			isLoaded: false
		};
	};


	render () {
	  	return 	<ThemeProvider theme={ColignyTheme()}>
		      		<CssBaseline />
					<Box sx={{ flexGrow: 1 }}>
						<CalendarContext.Provider value={[this.state, (state) => this.setState(state)]}>
							<ColignyAppHeader/>
							<ColignyCalendarTable/>
						</CalendarContext.Provider>
					</Box>
				</ThemeProvider>;
	};
};

ColignyApp.contextType = CalendarContext;

export default ColignyApp;