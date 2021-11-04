import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './ColignyApp.js';
import * as ColignyCycle from './ColignyCycle.js';

export default function GoForwardOneMonth() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	function getNextMonth(currentYear, currentMonth) {

		var yearInCycle = ColignyCycle.getYearInCycle(currentYear);
		var month, year, nextMonth;

		month = currentMonth + 1;
		if (month >= ColignyCycle.colignyCycle[yearInCycle].length) {
			
			// going into new year now
			year = currentYear + 1;

			// adjust yearInCycle
			yearInCycle = ColignyCycle.getYearInCycle(year);

			// set to first month of year;
			month = 0;

		} else {
			// same so just get the current year
			year = currentYear;
		}

		//find first month that has days
		while (ColignyCycle.colignyCycle[yearInCycle].length > month 
			&& (ColignyCycle.colignyCycle[yearInCycle][month] == 0 || ColignyCycle.colignyCycle[yearInCycle][month] == undefined)) {
			month += 1;
		}

		if (month >= ColignyCycle.colignyCycle[yearInCycle].length ) {
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

	return (<IconButton size='small' onClick={goForward}>{">"}</IconButton>);
};