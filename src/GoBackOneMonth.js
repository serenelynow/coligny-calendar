import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './ColignyApp.js';
import * as ColignyCycle from './ColignyCycle.js';

export default function GoBackOneMonth() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	function getPreviousMonth (currentYear, currentMonth) {
		var yearInCycle = ColignyCycle.getYearInCycle(currentYear);
		var month, year;

		var previousMonth;

		month = currentMonth - 1;
		if (month < 0) {
			// going into new year now
			year = currentYear - 1;

			// adjust yearInCycle
			yearInCycle = ColignyCycle.getYearInCycle(year);

			// get the month index;
			month = ColignyCycle.colignyCycle[yearInCycle].length - 1;

		} else {
			year = currentYear;
		}

		//find first month that has days
		while (month > -1 && (ColignyCycle.colignyCycle[yearInCycle][month] == 0 || ColignyCycle.colignyCycle[yearInCycle][month] == undefined)) {
			month -= 1;
		}

		if (month == -1) {
			previousMonth = getPreviousMonth(year, month);
		} else {
			previousMonth = {year: year, month:month};
		}		

		return previousMonth;
	};


	function goBack () {
		var previousMonth = getPreviousMonth(calContext.year, calContext.month);
		setCalContext(
			calContext => (
		      { ...calContext, year: previousMonth.year, month: previousMonth.month }
		    )
	    );
	};

	return (<IconButton size='small' onClick={goBack} sx={{paddingLeft: 2, paddingRight: 2, displayPrint: 'none'}}>{"<"}</IconButton>);
};