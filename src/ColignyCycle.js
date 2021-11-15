import {gToday, milliFactor} from './DateHelper.js';
import ColignyDate from './ColignyDate.js';

// dates according to http://www.coligny-app.com
export const baseGregorianDate = new Date(2003,4,8);
export const baseColignyDate = new ColignyDate (5003, 0, 1, baseGregorianDate.getDay());
const startOfDayHour = -18;

const colignyMonths = [ 
    "Quimonios", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "Rantaranos", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
]; // 14 months
// const equos = 10;

// start constructiong the full cycle
var metonicCycle = [
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [29,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29],
    // [29,30,29,30,29,30,30,null,29,30,30,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,30,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,29,29,30,29],
    [null,30,29,30,29,30,30,null,29,30,30,29,30,29]
]; // 19 years in a Metonic cycle

var driftCycle = []; // 228 years in a drifty cycle
var m, d;
for (m = 0; m < 12; m++) {
// for (m = 0; m < 11; m++) {
    driftCycle[m] = metonicCycle;       
}

// removing a day from the Equos month in the last year
// of the last metonic cycle in a drift cycle
// (12 metonic cycles in a drift cycle)
// this will remove 28 days from the full cycle
// var metonicOneLessDay = JSON.parse(JSON.stringify(metonicCycle));
// metonicOneLessDay[18][equos] = 29;
// driftCycle[m] = metonicOneLessDay;

var fullCycle = []; // 6384 years in the larger drift cycle
for (d = 0; d < 28; d++) {
// for (d = 0; d < 27; d++) {
    fullCycle[d] = driftCycle;
}

// removing a day from Equos 
// of the 10th (index of 9) year 
// of the 6th (index of 5) metonic cycle
// of the last drift cycle (index of 27) of the full cycle
// this will remove 1 day from the full cyle
// var driftOneLessDay = JSON.parse(JSON.stringify(driftCycle));
// driftOneLessDay[5][9][equos] = 29
// fullCycle[d] = driftOneLessDay;

// end of constructing the drift cycle.
// 29 days have been removed in the end.

/* EQUOS 5013 IN COLIGNY APP HAS 29 DAYS BUT I HAVE 30 */

export function getStartOfDayHour() {
    return startOfDayHour;
}

function calculateFullCycleTotals () {
    // fullCycleTotals = {
    //     // first level is the larger cycle
    //     days: 0, 
    //     years: 0,
    //     cycles: [
    //         {
    //             // this level is the drift cycle
    //             days: 0,
    //             years: 0,
    //             cycles: [
    //                 {
    //                     // this level is the metonic cycle
    //                     days: 0,
    //                     years: 0,
    //                     cycles [
    //                         {
    //                             // this level are individual years
    //                             days: 0,
    //                             cycles: [
    //                                 // this level are individual months and are just numbers and not objects
    //                                 /// could just point to/reference year in metonic cyle fullCycle[d][m]
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // };

    var fullCycleDays, fullCycleYears, driftCycleDays, driftCycleYears, metonicDays, metonicYears, yearDays;

    // initialize the object that will store the totals
    var fullCycleTotals = {
        // first level is the larger cycle
        days: 0, 
        years: 0,
        cycles: []
    };

    // initilize the counters for this drift cycle
    fullCycleDays = 0;
    fullCycleYears = 0;

    for (var d = 0; d < fullCycle.length; d++) {
        // looping through drift cycles in the largerDriftCyle
        
        // initilize the object for this drift cycle
        fullCycleTotals.cycles[d] = {
            days: 0, 
            years: 0,
            cycles: []
        };

        // initilize the counters for this drift cycles
        driftCycleYears = 0;
        driftCycleDays = 0;

        for (var m = 0; m < fullCycle[d].length; m++) {
            // looping through metonic cycles in the drift cycles
            
            // initialize the object for this metonic cycle
            fullCycleTotals.cycles[d].cycles[m] = {
                days: 0, 
                years: 0,
                cycles: []
            };

            // initialize the counters for this metonic cycle
            metonicYears = 0;
            metonicDays = 0;

            for (var y = 0; y < fullCycle[d][m].length; y++) {
                // looping through years in the metonic ycles
                // point to months?

                // initilize the object for the year
                // just use the array of month day totals for the cycle
                fullCycleTotals.cycles[d].cycles[m].cycles[y] = {
                    days: 0, 
                    cycles: []
                };

                //  initialize the counters for the year
                yearDays = 0;

                // loop through the months to get the days in the year
                for (var month = 0; month < fullCycle[d][m][y].length; month++) {
                    yearDays += (fullCycle[d][m][y][month] || 0);
                }

                // set the days for the year
                fullCycleTotals.cycles[d].cycles[m].cycles[y].days = yearDays;
                fullCycleTotals.cycles[d].cycles[m].cycles[y].cycles = fullCycle[d][m][y];


                // increment counters for the metonic cycle
                metonicYears++;
                metonicDays += yearDays;
            }

            // set the days and years for the metonic cycle
            fullCycleTotals.cycles[d].cycles[m].years = metonicYears;
            fullCycleTotals.cycles[d].cycles[m].days = metonicDays;
            // fullCycleTotals.cycles[d].cycles[m].cycles = fullCycle[d][;


            driftCycleYears += metonicYears;
            driftCycleDays += metonicDays;
        }

        // set the days and years for the metonic cycle
        fullCycleTotals.cycles[d].years = driftCycleYears;
        fullCycleTotals.cycles[d].days = driftCycleDays;

        // increment the counter for the larger drift cycle
        fullCycleYears += driftCycleYears;
        fullCycleDays += driftCycleDays;
    }

    // set the days and years for the full cycle
    fullCycleTotals.years = fullCycleYears;
    fullCycleTotals.days = fullCycleDays;

    return fullCycleTotals;
};

const fullCycleTotals = calculateFullCycleTotals();

export function getYearFromCycle(year) {
    var cyclesCompleted = getCyclesCompleted(year);
    var d, m, y;
    if (cyclesCompleted.isBeforeBaseDate == true) {

        d = fullCycleTotals.cycles.length - (cyclesCompleted.drift + 1);
        m = fullCycleTotals.cycles[d].cycles.length - (cyclesCompleted.metonic + 1);
        y = fullCycleTotals.cycles[d].cycles[m].cycles.length - (cyclesCompleted.year + 1);


    } else {
        d = cyclesCompleted.drift;
        m = cyclesCompleted.metonic;
        y = cyclesCompleted.year;
    }

    var yearFromCycle = fullCycle[d][m][y];
    return yearFromCycle;
};

function getObject(year, month){
    // year could be an object from getCyclesCompleted

    var cyclesCompleted = Number.isInteger(year) ? getCyclesCompleted(year) : year;
    var d, m, y, returnObject;

    if (cyclesCompleted.isBeforeBaseDate == true) {

        d = fullCycleTotals.cycles.length - (cyclesCompleted.drift + 1);
        m = fullCycleTotals.cycles[d].cycles.length - (cyclesCompleted.metonic + 1);
        y = fullCycleTotals.cycles[d].cycles[m].cycles.length - (cyclesCompleted.year + 1);

    } else {

        d = cyclesCompleted.drift;
        m = cyclesCompleted.metonic;
        y = cyclesCompleted.year;

    }

    if (month != undefined) {
        returnObject = fullCycle[d][m][y][month];
    } else {
         returnObject = fullCycle[d][m][y];

    }

    return returnObject; // was subtracting 1 but took it out
}

export function getMonthsInYear(year) {
    var thatYear = getObject(year);
    var months = [];

    for (var month = 0; month < thatYear.length; month++) {
        if (thatYear[month] != undefined && thatYear[month] != 0) {
            months[month] = {
                index: month,
                name: getMonthName(month)
            };
        }
    }

    return months;
}

export function getDaysInMonth(year, month) {
    return getObject(year, month);
}

export function getCyclesCompleted(year) {
    var cyclesCompleted = {
        full: 0,
        drift: 0,
        metonic: 0,
        year: 0,
        years: 0,
        days: 0,
        isBeforeBaseDate: false
    };

    // get the difference in years to start
    var yearsLeft = year - baseColignyDate.getYear(); 
   
    
    if (yearsLeft != 0) {

        var increment, comparisonFn;
        var d, driftCycle, driftInitial, driftGreaterThan;
        var m, metonicyCylc, metonicInitial, metonicGreaterThan;
        var y, yearCycle, yearInitial, yearGreaterThan, monthsInYear;
        var mo, monthCycle, monthInitial, monthGreaterThan, daysInMonth;

        if (yearsLeft < 0) {
            // we need to reduce the count and so since it's negative, this will be increasing it.
            yearsLeft++; 
            cyclesCompleted.isBeforeBaseDate = true;

            // this is for counting backwards
            increment = -1;
            comparisonFn = greaterThan;

            driftInitial = fullCycleTotals.cycles.length - 1;
            driftGreaterThan = -1;
        } else {

            // this is for counting foward
            increment = 1;
            comparisonFn = lessThan;

            driftInitial = 0;
            driftGreaterThan = fullCycleTotals.cycles.length;
        }

        var absYear = Math.abs(yearsLeft); 

        // get the full cycles completed
        cyclesCompleted.full = Math.floor( absYear / fullCycleTotals.years );
        cyclesCompleted.days += (cyclesCompleted.full * fullCycleTotals.days);
        cyclesCompleted.year += (cyclesCompleted.full * fullCycleTotals.years);

        yearsLeft = absYear % fullCycleTotals.years;


        // var driftCycle, metonicCycle, yearCycle;
        // get the drift cycles completed in current full cycle
        for (d = driftInitial; comparisonFn(d, driftGreaterThan); d += increment) {

            driftCycle = fullCycleTotals.cycles[d];

            if ((yearsLeft - driftCycle.years) >= 0) {

                cyclesCompleted.drift++;
                cyclesCompleted.days += driftCycle.days;
                cyclesCompleted.years += driftCycle.years;
                yearsLeft -= driftCycle.years;

            } else {

                // done with the complete drift cycles
                // now on to metonic cycles

                if (cyclesCompleted.isBeforeBaseDate) {
                    // this is for counting backwards
                    metonicInitial = driftCycle.cycles.length - 1;
                    metonicGreaterThan = -1;
                } else {
                    // this is for counting foward
                    metonicInitial = 0;
                    metonicGreaterThan = driftCycle.cycles.length;
                }

                // now loop through the metonic cycles
                for (m = metonicInitial; comparisonFn(m, metonicGreaterThan); m += increment) {

                    metonicCycle = driftCycle.cycles[m];

                    if ((yearsLeft - metonicCycle.years) >= 0) {

                        cyclesCompleted.metonic++;
                        cyclesCompleted.days += metonicCycle.days;
                        cyclesCompleted.years += metonicCycle.years;
                        yearsLeft -= metonicCycle.years;

                    } else {
                        if (cyclesCompleted.isBeforeBaseDate) {
                            // this is for counting backwards
                            yearInitial = metonicCycle.cycles.length - 1;
                            yearGreaterThan = -1;
                        } else {
                            // this is for counting foward
                            yearInitial = 0;
                            yearGreaterThan = metonicCycle.cycles.length;
                        }

                        for (y = yearInitial; comparisonFn(y, yearGreaterThan); y += increment) {
                            yearCycle = metonicCycle.cycles[y];
                            if ((yearsLeft - 1) >= 0) {

                                cyclesCompleted.year++;
                                cyclesCompleted.years++;
                                cyclesCompleted.days += yearCycle.days;
                                yearsLeft--;

                            } else {
                                break;
                            }
                        }
                        break;
                    }  
                }
                break;
            }            
        }    
    } 

    return cyclesCompleted;
};

export function getMonthName (monthIndex) {
    return colignyMonths[monthIndex];
};

function lessThan(left, right) {
    return left < right;
}

function greaterThan(left, right) {
    return left > right;
}

export function calculateDate (daysFromBase) {
    // calcate date from days from base
    // consider making a recursive method 

    // if given daysFromBase, calculate date:
    // 1) get fullCycles completed and add years
    // 2) get driftCycles completed in current larger driftCycle and add years and keep track of # of driftcycles completed
    // 3) get metonicycles completed in current driftCycle and add years and keep track of # of metoniccycles completed
    // 4) get years completed in current metonic cycle and add years, set year and keep track of # of years completed in metonicy cycle
    // 5) get each month completed in year cycle and set month and keep track of # of months completed
    // 6) remaining days for are the date in month

    var newDate = {
        year: baseColignyDate.getYear(),
        month: baseColignyDate.getMonth(),
        date: baseColignyDate.getDate(),
        day: undefined,
        gDate: undefined
    };
    var daysLeft, drifyCycles, metonicCycles, years, months;
    
    // make sure it's just an integer first
    daysFromBase = Math.floor(daysFromBase);

    //calulate milliseconds to get Gregorian date and its day of week
    // var time = baseGregorianDate.getTime() + (daysFromBase*milliFactor);
    // newDate.gDate = new Date(time);
    var newGDate = new Date(baseGregorianDate.getTime())
    newGDate.setDate(newGDate.getDate() + daysFromBase);
    newDate.gDate = newGDate;

    var dayOfWeek = newDate.gDate.getDay();
    newDate.day = dayOfWeek;

    /* this will work going forward, but what about a date before? */

    // 1) get fullCycles completed and add years

    // do this so that we can subtract
    var isBefore = (daysFromBase/Math.abs(daysFromBase)) == -1;
    daysFromBase = Math.abs(daysFromBase);

    var increment, comparisonFn;
    var d, driftCycle, driftInitial, driftGreaterThan;
    var m, metonicyCylc, metonicInitial, metonicGreaterThan;
    var y, yearCycle, yearInitial, yearGreaterThan, monthsInYear;
    var mo, monthCycle, monthInitial, monthGreaterThan, daysInMonth;

    if (isBefore) {
        // this is for counting backwards
        increment = -1;
        comparisonFn = greaterThan;

        driftInitial = fullCycleTotals.cycles.length - 1;
        driftGreaterThan = -1;

    } else {
        // this is for counting foward
        increment = 1;
        comparisonFn = lessThan;

        driftInitial = 0;
        driftGreaterThan = fullCycleTotals.cycles.length;
    }

    var fullCyclesCompleted = Math.floor(daysFromBase / fullCycleTotals.days);
    newDate.year += (fullCyclesCompleted * fullCycleTotals.years * increment);
    daysLeft = daysFromBase % fullCycleTotals.days;

    // 2) get driftCycles completed in current larger driftCycle and add years and keep track of # of driftcycles completed
    for (d = driftInitial; comparisonFn(d, driftGreaterThan); d += increment) {
        
        driftCycle = fullCycleTotals.cycles[d];
        if (daysLeft >= driftCycle.days) {

            // still finding completed drift cycles in the number of days
            newDate.year += (driftCycle.years * increment);
            daysLeft -= driftCycle.days;
        
        } else {

            // reach all the completed drift cycles so calculate metonic cycles in the current drift cycles
            // 3) get metonicycles completed in current driftCycle and add years and keep track of # of metoniccycles completed
            
            if (isBefore) {
                // this is for counting backwards
                metonicInitial = driftCycle.cycles.length - 1;
                metonicGreaterThan = -1;
            } else {
                // this is for counting foward
                metonicInitial = 0;
                metonicGreaterThan = driftCycle.cycles.length;
            }

            for (m = metonicInitial; comparisonFn(m, metonicGreaterThan); m += increment) {

                metonicCycle = driftCycle.cycles[m];
                if (daysLeft >= metonicCycle.days) {
                    // still finding completed metonic cycles in the number of days
                    newDate.year += (metonicCycle.years * increment);
                    daysLeft -= metonicCycle.days;
                } else {

                    // reach all the completed metonic cycles so calculate years in the current metonic cycles
                    // 4) get years completed in current metonic cycle and add years, set year and keep track of # of years completed in metonicy cycle
                    
                    if (isBefore) {
                        // this is for counting backwards
                        yearInitial = metonicCycle.cycles.length - 1;
                        yearGreaterThan = -1;
                    } else {
                        // this is for counting foward
                        yearInitial = 0;
                        yearGreaterThan = metonicCycle.cycles.length;
                    }

                    for (y = yearInitial; comparisonFn(y, yearGreaterThan); y += increment) {
                        yearCycle = metonicCycle.cycles[y];
                        monthsInYear = yearCycle.cycles.length;
                        if (daysLeft >= yearCycle.days) {
                            newDate.year += increment;
                            daysLeft -= yearCycle.days;
                        } else {
                            // reach all the completed years so calculate months in the current year cycles
                            // 5) get each month completed in year cycle and set month and keep track of # of months completed
                            // some months have a null value because it's not in the cycle but we still want to count that month
                            
                            if (isBefore) {
                                // this is for counting backwards
                                monthInitial = yearCycle.cycles.length - 1;
                                monthGreaterThan = -1;
                            } else {
                                // this is for counting foward
                                monthInitial = 0;
                                monthGreaterThan = yearCycle.cycles.length;
                            }

                            newDate.month = -1; // this should only be called once
                            for (mo = monthInitial; comparisonFn(mo, monthGreaterThan); mo += increment) {
                                monthCycle = yearCycle.cycles[mo];
                                newDate.month += increment;
                                if (monthCycle != undefined) {
                                    // this is a month that is not skipped for this year

                                    if (daysLeft >= monthCycle) {
                                        daysLeft -= (monthCycle || 0);
                                    } else {
                                        // 6) remaining days for are the date in month
                                        newDate.date += (daysLeft * increment);
                                        daysInMonth = monthCycle;

                                        // found all the months so get out of this loop
                                        break;
                                    }
                                }
                                
                            }

                            // now get out of this loop
                            break;
                        }
                    }

                    // now get out of this for loop
                    break;
                }
            }

            // now get out of this for loop
            break;
        }
    } 

    return newDate;
};

export function calculateDaysSinceColBase (year, month, day) {

    var daysSinceColBase = 0;
    var isBefore = !(baseColignyDate.equals(year, month, day) || baseColignyDate.isBefore(year, month, day));

    var cyclesCompleted = getCyclesCompleted(year);
    daysSinceColBase += cyclesCompleted.days;

    var increment, comparisonFn;
    var d, m, y;
    var mo, monthCycle, monthInitial, monthGreaterThan, daysInMonth;

    if (isBefore) {
        // this is for counting backwards
        increment = -1;
        comparisonFn = greaterThan;

        d = fullCycleTotals.cycles.length - (cyclesCompleted.drift + 1);
        m = fullCycleTotals.cycles[d].cycles.length - (cyclesCompleted.metonic + 1);
        y = fullCycleTotals.cycles[d].cycles[m].cycles.length - (cyclesCompleted.year + 1);

    } else {
        // this is for counting foward
        increment = 1;
        comparisonFn = lessThan;

        d = cyclesCompleted.drift;
        m = cyclesCompleted.metonic;
        y = cyclesCompleted.year;
    }

    // this is wrong and pobably nees tha if statement above
    var yearCycle = fullCycleTotals.cycles[d].cycles[m].cycles[y];

    if (isBefore) {
        monthInitial = yearCycle.cycles.length - 1;
        monthGreaterThan = month;
    } else {
        // this could have been set up above but 
        // I decided to keep it here so that it would 
        // be easier to see what is going 
        monthInitial = 0;
        monthGreaterThan = month;
    }

    for (mo = monthInitial; comparisonFn(mo, monthGreaterThan); mo += increment) {
        monthCycle = (yearCycle.cycles[mo] || 0);
        daysSinceColBase += monthCycle;
    }

    if (isBefore) {
        daysInMonth = yearCycle.cycles[mo]; // 3
        daysSinceColBase += daysInMonth - day + 1;
        daysSinceColBase *= -1;
    } else {
        daysSinceColBase += (day - baseColignyDate.getDate());        
    }

    return daysSinceColBase;
};