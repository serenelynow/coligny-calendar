import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './CalendarContext.js';
import * as ColignyCycle from './ColignyCycle.js';
import {l10n} from './l10n.js';

export default function GoBackOneMonth() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	function getPreviousMonth (currentYear, currentMonth) {
		var month = currentMonth - 1;
		var year = currentYear;
		var yearInCycle;

		var previousMonth;

		if (month < 0) {
			// going into new year now
			year = year - 1;

			// adjust yearInCycle
			yearInCycle = ColignyCycle.getYearFromCycle(year);

			// get the month index;
			month = yearInCycle.length - 1;

		} else {
			year = currentYear;
			yearInCycle = ColignyCycle.getYearFromCycle(year);
		}

		//find first month that has days
		while (month > -1 && (yearInCycle[month] == 0 || yearInCycle[month] == undefined)) {
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

	return (<IconButton aria-label={l10n.goBackOneMonth} size='small' onClick={goBack} sx={{paddingLeft: 2, paddingRight: 2, displayPrint: 'none'}}>{"<"}</IconButton>);
};