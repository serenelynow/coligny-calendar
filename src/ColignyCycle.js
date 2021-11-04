import {gToday, milliFactor} from './DateHelper.js';
import ColignyDate from './ColignyDate.js';

export const colignyCycle = [
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    // [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ]
];

export function getDaysInMonth (yearInCycle, month) {
    var days = (colignyCycle[yearInCycle][month] || 0);
    return days;
};

export const colignyMonths = [ 
	"Quimonios", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "Rantaranos", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
]; // 14 months

function calculateDaysInCycle() {
    var totalDays = 0;
    for (var r = 0; r < colignyCycle.length; r++) {
        var daysInYear = 0;
        for ( var c = 0; c < colignyCycle[r].length; c++) {
            var thisYearDays = colignyCycle[r][c] ;
            daysInYear += (thisYearDays || 0);
        };
        totalDays += daysInYear;
        daysInEachYear[r] = daysInYear;
    };

    return totalDays;
};

function getCyclesCompleted(year) {
    var nCycles = Math.floor(Math.abs(year)/yearsInCycle);
    return nCycles;
};

export const yearsInCycle = colignyCycle.length;
export const daysInEachYear = [];
export const daysInCycle = calculateDaysInCycle();

// dates according to Helen's research
// export default const baseGregorianDate = new Date(2015,3,26); // sunday
// export default const baseColignyDate = new ColignyDate (5015, 0, 1, baseGregorianDate.getDay());

// dates according to http://www.coligny-app.com
export const baseGregorianDate = new Date(2003,4,8);
export const baseColignyDate = new ColignyDate (5003, 0, 1, baseGregorianDate.getDay());

export function getMonthName (monthIndex) {
    return colignyMonths[monthIndex];
};

export function getYearInCycle (year) {
    // we want to get the index of the year
    // so the first year has an index of 0
    var yearInCycle = (year - baseColignyDate.getYear()) % colignyCycle.length;

    if (yearInCycle < 0) {
        yearInCycle = colignyCycle.length + yearInCycle;
    }
    
    return yearInCycle;
};

export function calculateDate (daysFromBase) {

    var newDate = {
        year: undefined,
        month: undefined,
        date: undefined,
        day: undefined,
        gDate: undefined
    };
    /// calcate date from days from base.
    daysFromBase = Math.floor(daysFromBase);
    

    //calulate milliseconds to get Gregorian date and its day of week
    var time = baseGregorianDate.getTime() + (daysFromBase*milliFactor);
    newDate.gDate = new Date(time);


    var dayOfWeek = newDate.gDate.getDay();
    newDate.day = dayOfWeek;

    var cycles = Math.floor(daysFromBase/daysInCycle);

    var daysSoFar = cycles*daysInCycle;

    // cycles * years in a cycle
    var year = baseColignyDate.getYear() + (cycles * colignyCycle.length);

    // get remainder of mod to know how many days we are into current cycle
    var daysInCurrentCurrentCycle = daysFromBase % daysInCycle;
    var y, m, d;

    for (y = 0; y < daysInEachYear.length; y++) {

        if ((daysSoFar + daysInEachYear[y]) < daysFromBase) {
            // if this year will complelete, add all its days and a year
            year += 1;
            daysSoFar += daysInEachYear[y];

        } else {
            // get out of loop
            // need to calcate month in current year
            break;
        }
        
    }
    //add year for current year
    newDate.year =year;

    var month = 0;
    for (m = 0; m < colignyCycle[y].length; m++) {
        if ((daysSoFar + colignyCycle[y][m]) < daysFromBase) {
            // if this year will complelete, add it's days and year
            month += 1;
            daysSoFar += colignyCycle[y][m];

        } else {
            // get out of loop
            // need to calcate day in current month
            break;
        }
    }
    newDate.month = month;

    var date = baseColignyDate.getDate() + (daysFromBase - daysSoFar);

    // add a day for the current Day
    // this could be a bug if it's perfectly the beginning of they day
    newDate.date = date;

    return newDate;
};

export function calculateDaysSinceColBase (year, month, day) {

        // get the difference in years to start
        var yDiff = year - baseColignyDate.getYear(); 
        var beforeOrAfterFactor;
        if (yDiff == 0) {
            // we are in the same year of the baseColignyDate
            // so we need to determine before or after
            if (month > baseColignyDate.getMonth()) {
                beforeOrAfterFactor = 1;
            } else if (month < baseColignyDate.getMonth()) {
                beforeOrAfterFactor = -1;
            } else if (day > baseColignyDate.getDate()) {
                beforeOrAfterFactor = 1
            } else if (day < baseColignyDate.getDate()) {
                beforeOrAfterFactor = -1
            } else {
                beforeOrAfterFactor = 0
            }
        } else {
            beforeOrAfterFactor = yDiff / Math.abs(yDiff);
            beforeOrAfterFactor = parseInt(beforeOrAfterFactor);
        }

        var daysSinceColBase;
        
        if (beforeOrAfterFactor == 0) {
            // we are on the baseColignyDate so no need to process any further
            daysSinceColBase = 0;
        } else {
            // calculate days for total cycles completed since Zero
            // get days in completed cycles
            // if year is same year as years in cycle, 
            // this indicates it is the first year of the next cycle
            // so we need to add one to the year to get this result
            var cycles = getCyclesCompleted(yDiff);
            daysSinceColBase = cycles*daysInCycle;

            // calculate days in current incomplete cycle except current year
            // year is more like an index and not a count
            // we need to use the absolute value for dates that occur before the colBaseDate
            yDiff = Math.abs(yDiff) % yearsInCycle;

            // we can now calculate days from years from start of incomplete cycle
            if (beforeOrAfterFactor == 1) {
                // count forward
                for (var y = 0; y < yDiff; y++) { // just go to less than yDiff since last year is incompplete
                    daysSinceColBase += daysInEachYear[y];
                }

                // calculate days in months of current year up to but excluding current month
                for (var m = 0; m < month; m++) {
                    var monthDays = colignyCycle[yDiff][m];
                    daysSinceColBase += (monthDays || 0);
                }
                // add days for this month one less since you are calculating difference from another date
                // if I was calculating the 2nd day from the beginning, then while the date is 2, 
                // it's only one day from the beginning
                daysSinceColBase += (day - baseColignyDate.getDate());

            } else {
                //count backwayds
                for (var y = (colignyCycle.length - 1); y > (colignyCycle.length - yDiff); y--) { // just go to less than yDiff since last year is incompplete
                    daysSinceColBase += daysInEachYear[y];
                }

                var currentYearInCycle;
                if (yDiff == 0) {
                    currentYearInCycle = 0;
                } else {
                    currentYearInCycle = colignyCycle.length - yDiff;
                }

                for (var m = colignyCycle[currentYearInCycle].length - 1; m > month; m--) { // don't add the current month
                    
                    var monthDays = colignyCycle[currentYearInCycle][m];
                    daysSinceColBase += (monthDays || 0);
                }

                // since we are counting backwards 
                // calculate days since the end of the month provided
                daysSinceColBase += colignyCycle[currentYearInCycle][month] - day + 1;
                daysSinceColBase *= -1;
            }
        }

        return daysSinceColBase;
    };