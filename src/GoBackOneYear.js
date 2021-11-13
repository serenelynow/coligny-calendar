import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './CalendarContext.js';
import * as ColignyCycle from './ColignyCycle.js';
import {l10n} from './l10n.js';

export default function GoBackOneYear() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

    const finishedLoading = () => {
        var calendar = calContext.calendar;

        setCalContext(
          calContext => (
            { ...calContext, year: calendar.getYear(), month: calendar.getMonth(), isLoaded:true }
          )
        );
    }

	function getPreviousYear (currentYear, currentMonth) {
        
        // go back one year
        var year = currentYear - 1; 
        var month = currentMonth;
        var yearCycle = ColignyCycle.getYearFromCycle(year);

        // if we currently in an intercalary month
        // then we will go to the month afterwards
        while (yearCycle[month] == undefined) {
            if (month == (yearCycle.length - 1)) {
                
                // //we've reached the end of the year so go to the next year
                year++;
                yearCycle = ColignyCycle.getYearFromCycle(year);
                month = 0;
            } else {
                month++; 
            }
        }

        var yearPrevious = {year: year, month: month};
        return yearPrevious;
    }

    function goBack() {
        setCalContext(
          calContext => (
            { ...calContext, isLoaded:false }
          )
        );
        var yearPrevious = getPreviousYear(calContext.year, calContext.month);
        calContext.calendar.update(yearPrevious.year, yearPrevious.month, true, finishedLoading);
    }


	return (<IconButton aria-label={l10n.goBackOneYear} size='small' onClick={goBack} sx={{paddingLeft: 1, paddingRight: 1, displayPrint: 'none'}}>{"<<"}</IconButton>);
};