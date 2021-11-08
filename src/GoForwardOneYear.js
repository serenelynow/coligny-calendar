import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import {CalendarContext} from './ColignyApp.js';
import * as ColignyCycle from './ColignyCycle.js';

export default function GoForwardOneYear() {

	const [calContext, setCalContext] = React.useContext(CalendarContext);

	function getNextYear(currentYear, currentMonth) {
        
        // go forward one year
        var year = currentYear + 1; 
        var month = currentMonth;
        var yearCycle = ColignyCycle.getYearFromCycle(year);
        
        // if we currently in an intercalary month
        // then we will go to the month afterwards
        while (yearCycle[month] == undefined) {
            if (m == yearCycle.length){
                
                year++;
                yearCycle = ColignyCycle.getYearFromCycle(year);
                month = 0;
            } else {
                month++; 
            }
        }

        var yearNext = {year, month};
        return yearNext;
    };

    function goFoward () {
        var yearNext = getNextYear(calContext.year, calContext.month);
        setCalContext(
			calContext => (
		      { ...calContext, year: yearNext.year, month: yearNext.month }
		    )
	    );
    };

	return (<IconButton aria-label={l10n.advanceOneMonth} size='small' onClick={goFoward}  sx={{paddingLeft: 1, paddingRight: 1, displayPrint: 'none'}}>{">>"}</IconButton>);
};