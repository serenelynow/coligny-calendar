import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './CalendarContext.js';
import * as ColignyCycle from './ColignyCycle.js';
import {l10n} from './l10n.js';

export default function GoForwardOneMonth() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	const finishedLoading = () => {
	    var calendar = calContext.calendar;

	    setCalContext(
	      calContext => (
	        { ...calContext, year: calendar.getYear(), month: calendar.getMonth(), isLoaded:true }
	      )
	    );
	}

	function getNextMonth(currentYear, currentMonth) {

		var yearCycle = ColignyCycle.getMetonicYear(currentYear);
		var month = currentMonth + 1;
		var year, nextMonth;

		if (month >= yearCycle.length) {
			
			// going into new year now
			year = ((currentYear == -1) ? 1 : currentYear + 1);

			// adjust yearInCycle
			yearCycle = ColignyCycle.getMetonicYear(year);

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
		setCalContext(
	      calContext => (
	        { ...calContext, isLoaded:false }
	      )
	    );

		var nextMonth = getNextMonth(calContext.year, calContext.month);
		calContext.calendar.update(nextMonth.year, nextMonth.month, true, finishedLoading);
	};

	return (<IconButton aria-label={l10n.advanceOneMonth} size='small' onClick={goForward} sx={{paddingLeft: 2, paddingRight: 2, displayPrint: 'none'}}>{">"}</IconButton>);
};