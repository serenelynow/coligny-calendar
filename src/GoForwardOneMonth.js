import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './ColignyApp.js';
import * as ColignyCycle from './ColignyCycle.js';

export default function GoForwardOneMonth() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	function getNextMonth(currentYear, currentMonth) {

		var yearCycle = ColignyCycle.getYearFromCycle(currentYear);
		var month = currentMonth + 1;
		var year, nextMonth;

		if (month >= yearCycle.length) {
			
			// going into new year now
			year = currentYear + 1;

			// adjust yearInCycle
			yearCycle = ColignyCycle.getYearFromCycle(year);

			// set to first month of year;
			month = 0;

		} else {
			// same so just get the current year
			year = currentYear;
		}

		//find first month that has days
		while (yearCycle.length > month 
			&& (yearCycle[month] == 0 || yearCycle[month] == undefined)) {
			month += 1;
		}

		if (month >= yearCycle.length ) {
			nextMonth = getNextMonth(year, month);
		} else {
			nextMonth = {year: year, month: month};
		}

		return nextMonth;

	};

	function goForward () {
		var nextMonth = getNextMonth(calContext.year, calContext.month);
		setCalContext(
	      	calContext => (
		        { ...calContext, year: nextMonth.year, month: nextMonth.month }
		      )
	    );
	};

	return (<IconButton size='small' onClick={goForward} sx={{paddingLeft: 2, paddingRight: 2, displayPrint: 'none'}}>{">"}</IconButton>);
};