import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './CalendarContext.js';
import * as ColignyCycle from './ColignyCycle.js';
import {l10n} from './l10n.js';

export default function GoForwardOneYear() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

    const finishedLoading = () => {
        var calendar = calContext.calendar;

        setCalContext(
          calContext => (
            { ...calContext, year: calendar.getYear(), month: calendar.getMonth(), isLoaded:true }
          )
        );
    }

	function getNextYear(currentYear, currentMonth) {
        
        // go forward one year
        var year = currentYear + 1; 
        var month = currentMonth;
        var yearCycle = ColignyCycle.getMetonicYear(year);
        
        // if we currently in an intercalary month
        // then we will go to the month afterwards
        while (yearCycle[month] == undefined) {
            if (month == yearCycle.length){
                
                // we have come to the end of the year
                // so got to the next year and get the first month
                year++;
                yearCycle = ColignyCycle.getMetonicYear(year);
                month = 0;
            } else {
                month++; 
            }
        }

        var yearNext = {year, month};
        return yearNext;
    };

    function goFoward () {
        setCalContext(
          calContext => (
            { ...calContext, isLoaded:false }
          )
        );
        var yearNext = getNextYear(calContext.year, calContext.month);
        calContext.calendar.update(yearNext.year, yearNext.month, true, finishedLoading);
    };

	return (<IconButton aria-label={l10n.advanceOneMonth} size='small' onClick={goFoward}  sx={{paddingLeft: 1, paddingRight: 1, displayPrint: 'none'}}>{">>"}</IconButton>);
};