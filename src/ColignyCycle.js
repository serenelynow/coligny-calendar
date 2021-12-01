import {gToday, milliFactor} from './DateHelper.js';
import ColignyDate from './ColignyDate.js';

// dates according to http://www.coligny-app.com
export const baseGregorianDate = new Date(2003,4,8);
export const baseColignyDate = new ColignyDate (5003, 0, 1, baseGregorianDate.getDay());
const startOfDayHour = -18;

const colignyMonths = [ 
    "Quimonios", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "Rantaranos", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
]; // 14 months
const equos = 10;
// const intercalary2 = 7;

// start constructiong the full cycle
const metonicCycle = [
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

const lunarDriftCycleYears = 61;
// const solarDriftCycleYears = 219;

function calculateDaysInMetonicYears() {
    var eachYear = [];
    for (var y = 0; y < metonicCycle.length; y++) {
        var yearDays = 0;
        for (var m = 0; m < metonicCycle[y].length; m++) {
            yearDays += (metonicCycle[y][m] || 0);
        }
        eachYear[y] = yearDays;
    }

    return eachYear;
}
var daysInMetonicYears = calculateDaysInMetonicYears();

function calculateDaysInFullMetonicCycle () {
    var days = 0;

    for (var y = 0; y < metonicCycle.length; y++) {
        days += daysInMetonicYears[y];
    }

    return days;

}
const daysInMetonicCycle = calculateDaysInFullMetonicCycle();

function getDaysInMetonicCycle(isBeforeBase, startYear, endYear) {
    var metonicDays = 0;

    // this alows us to get the days left in a cycle if needed
    if (startYear == undefined) {
        startYear = 0;
    }

    if (endYear == undefined) {
        endYear = metonicCycle.length;
    }

    if (Math.abs(endYear - startYear) == metonicCycle.length) {
        // a full cycle is being requested
        metonicDays = daysInMetonicCycle;
    } else {
        // a partial cycle is being requested
        if (isBeforeBase == undefined) {
            isBeforeBase = false;
        }

        var increment, compareFn, initial, end;
        if (isBeforeBase) {
            increment = -1
            compareFn = greaterThan;

        } else {
            increment = 1;
            compareFn = lessThan;
        }

        initial = startYear;
        end = endYear;

        for (var y = initial; compareFn(y, end); y += increment) {
            metonicDays += daysInMetonicYears[y];
        }
    }

    return metonicDays;
}

function getDaysInLunarCycle(isBeforeBase, yearInMetonic, startYear, endYear) {

    if (isBeforeBase == undefined) {
        isBeforeBase = false;
    }

    if (yearInMetonic == undefined) {
        yearInMetonic = 0;
    }
    
    if (startYear == undefined) {
        startYear = 0;
    }

    if (endYear == undefined) {
        endYear = lunarDriftCycleYears
    }

    var lunarDays = 0;
    var yearsLeft = Math.abs(endYear - startYear); 

    var increment,compareFn;
    var mStart, mEnd;
    var yStart, yEnd;
    var lunarEnd;

    if (isBeforeBase) {
        increment = -1;
        compareFn = greaterThan;
        mStart = metonicCycle.length - 1;
        mEnd = -1;
        lunarEnd = -1;

    } else {
        increment = 1;
        compareFn = lessThan;
        mStart = 0;
        mEnd = metonicCycle.length; 
        lunarEnd = lunarDriftCycleYears;      
    }

    // first we are going to get days to finish out the metonic cycle
    if (yearInMetonic != mStart) {
        // get days for the rest of this metonic cycle

        var endMetonicYear = (Math.abs(mEnd - yearInMetonic) <= yearsLeft) ? mEnd : yearInMetonic + (increment * yearsLeft);

        // update variable for the rest of the calculations
        lunarDays += getDaysInMetonicCycle(isBeforeBase, yearInMetonic, endMetonicYear);
        yearsLeft -= Math.abs(endMetonicYear - yearInMetonic);
        yearInMetonic = mStart;
    }

    // now we are at the start of a lunar cycle and we can see how many full lunar cycles are left for easy math
    var metonicCyclesInLunarDriftCyle = Math.floor(yearsLeft/metonicCycle.length);
    lunarDays += (daysInMetonicCycle * metonicCyclesInLunarDriftCyle); 
    yearsLeft -= (metonicCyclesInLunarDriftCyle * metonicCycle.length);

    if (isBeforeBase) {
        yStart = metonicCycle.length - 1;
        yEnd = (metonicCycle.length - 1) - yearsLeft;
    } else {
        yStart = yearInMetonic;
        yEnd = yearsLeft;
    }
    
    // get get the days for the remaining years not in a complete metonic cycle
    for (var y = yStart; compareFn(y, yEnd); y += increment) {
        lunarDays += daysInMetonicYears[y];
    }

    // we reached the end so now remove the day that handles the drift
    if (endYear == lunarEnd) {
        lunarDays -= 1;
    }
    
    return lunarDays;
};

// function getDaysInSolarCycle(yearInMetonic, yearInLunar, startYear, endYear) {
//     // arguments are what year in those cycles are we starting

//     if (yearInMetonic == undefined) {
//         yearInMetonic = 0;
//     }

//     if (yearInLunar == undefined) {
//         yearInMetonic = 0;
//     }

//     if (startYear == undefined) {
//         startYear = 0;
//     }

//     if (endYear == undefined) {
//         endYear = lunarDriftCycleYears;
//     }

//     var solarDays = 0

//     while (startYear < endYear) {
    
//         var yearsLeft = endYear - startYear;
//         // calculate if this is a complete lunar cycle or not
//         var lunarEndYear = (yearsLeft >= lunarDriftCycleYears) ? lunarDriftCycleYears : yearInLunar + yearsLeft;

//         // get the days of this lunar cycle that starts the solar cycle
//         // this may be an incomplete lunar cycle
//         solarDays += getDaysInLunarCycle(yearInMetonic, yearInLunar, lunarEndYear);

//         // now we need to update where we are in the cycles and see if we need to keep going
//         var yearsAdvanced = lunarEndYear - yearInLunar;
//         startYear += yearsAdvanced;
//         // yearInMetonic = startYear % metonicCycle.length;
//         yearInMetonic = startYear % metonicCycle.length - 1;

//         if (yearInMetonic == -1)  {
//             yearInMetonic = metonicCycle.length - 1;
//         }
//         yearInLunar = 0; // we just calculated the incomplete lunar cycle so we are at the beginning of the next
        
//     }

//     // now that we've completed a cycle, we need to remove a day from it's length
//     // this however isn't checking if there is an Equos to remove from
//     // it just assumes to do one.
//     if (endYear == solarDriftCycleYears) {
//         --solarDays;
//     }
    
//     return solarDays;

// }


export function calculateDaysSinceColBase (year, month, day) {

    var daysSinceColBase = 0;
    var isBefore = !(baseColignyDate.equals(year, month, day) || baseColignyDate.isBefore(year, month, day));

    // if this date equals baseColignDate, no need to do any further calculations
    if (!(baseColignyDate.equals(year, month, day))) {

        var yearDiff = Math.abs(year - baseColignyDate.getYear());
        var countingYears = 0;

        var increment, comparisonFn, compareFnRtArg;
        var s, sStart, sEnd;
        var l, lStart, lEnd;
        var m, mStart, mEnd;
        var y = 0;
        var mo, monthDays, monthInitial, monthFnRtArg, daysInMonth;

        var isBefore = !(baseColignyDate.isBefore(year, month, day));
        if (isBefore) {
            // this is for counting backwards
            increment = -1;
            comparisonFn = greaterThan;
            compareFnRtArg = yearDiff;

            // sStart = solarDriftCycleYears - 1;
            // sEnd = -1;

            l = lunarDriftCycleYears - 1;
            lStart = l;
            lEnd = -1

            m = metonicCycle.length - 1;
            mStart = m;
            mEnd = -1;

        } else {
            // this is for counting forward
            increment = 1;
            comparisonFn = lessThan;
            compareFnRtArg = yearDiff + 1;

            // s = 0;
            // sStart = 0;
            // sEnd = solarDriftCycleYears;

            l = 0;
            lStart = l;
            lEnd = lunarDriftCycleYears;

            m = 0;
            mStart = m;
            mEnd = metonicCycle.length;

        }

        // iterate through completed solar cycles
        // while (comparisonFn(countingYears + (increment * solarDriftCycleYears), compareFnRtArg)) {
        //     daysSinceColBase += getDaysInSolarCycle(m, l, sStart, sEnd );
        //     countingYears += (increment * Math.abs(sEnd - sStart));
        //     if (isBefore) {

        //     } else {
        //         sStart = 0;
        //     }
            
        //     // update metonic and lunar yearInCycle arguments           
        //     m = countingYears % metonicCycle.length;
        //     m = mStart + (increment * m);

        //     l = countingYears % lunarDriftCycleYears;
        //     l = lStart + (increment * l);
        // }
        // lStart = l;

        // iterate through completed lunar cycles
        while ((countingYears + Math.abs(lEnd - lStart)) < compareFnRtArg) {
            countingYears += Math.abs(lEnd - lStart);

            daysSinceColBase += getDaysInLunarCycle(isBefore, m, lStart, lEnd);
            if (isBefore) {
                lStart = lunarDriftCycleYears - 1;
            } else {
                lStart = 0;
            }
            
            // update metonic and lunar yearInCycle arguments           
            m = countingYears % metonicCycle.length;
            m = mStart + (increment * m);
        }

        mStart = m;
       
        // iterate through completed metonic cycles
        while ((countingYears + Math.abs(mEnd - mStart)) < compareFnRtArg) {
            // the first iteration may not be a full cycle 
            // but could be mid metonic cycle and will complete it

            countingYears += Math.abs(mEnd - mStart);
            daysSinceColBase += getDaysInMetonicCycle(isBefore, mStart, mEnd);

            if (isBefore) {
                mStart = metonicCycle.length - 1;
            } else {
                mStart = 0;
            }        
        }

        // iterated completed years
        while ((countingYears + 1) < compareFnRtArg) {
            countingYears++;
            daysSinceColBase += daysInMetonicYears[mStart];
            mStart += increment;
        }

        // iterated completed months
        var yearCycle = metonicCycle[mStart];
        if (isBefore) {
            monthInitial = yearCycle.length - 1;
            monthFnRtArg = month;
        } else {
            monthInitial = 0;
            monthFnRtArg = month;
        }
        
        for (mo = monthInitial; comparisonFn(mo, monthFnRtArg); mo += increment) {
            monthDays = (yearCycle[mo] || 0);
            daysSinceColBase += monthDays;
        }

        // get the day of month
        if (isBefore) {
            monthDays = yearCycle[mo];
            daysSinceColBase += monthDays - day + 1;
            daysSinceColBase *= -1; // make it negative since it's before
        } else {
            daysSinceColBase += (day - baseColignyDate.getDate());        
        }

        // determine if we are close to but not at the end of the lunar cycle 
        // and we need to remove a day for Equos in the last years of the lunar cycle

        var yLunar = Math.abs(yearDiff) % lunarDriftCycleYears; 
        yLunar = isBefore ? (lunarDriftCycleYears - yLunar): yLunar; // years into lunar drift cycle
        var untilLunarEnd = lunarDriftCycleYears - yLunar - 1;
        const yearsFromEndToFindEquos = 4;


        if (( (isBefore == false ) && (untilLunarEnd <= yearsFromEndToFindEquos) )
            || (isBefore == true) ) { 
            // we are in the last years of the lunar drift cycle
            // and we need to check if we are upon or it has yet to come 
            // to the last 30 day Equos of the lunar cycle and remove a day

            var foundLastEquos = false;

            // we will not check the current year now so e > 0
            for (var e = untilLunarEnd; e > 0; e--) {
                foundLastEquos = getDaysInMonth(year + e, equos) == 30;
                if (foundLastEquos) {
                    break;
                }
            }

            if (foundLastEquos && (isBefore == true )) {
                // we are going backwards and we've already passed Equos 
                // so we need to remove a day
                daysSinceColBase += increment * -1;

            } else if (!foundLastEquos) {   
                // if we didn't find equos after the current year 
                // then it's already happened and we need to take a day out for it
                if (getDaysInMonth(year, equos) == 30) {
                    // it is a year with a 30-day Equos
                    if ((isBefore == false && month >= equos) 
                        || (isBefore == true && month <= equos) ) {
                        // we are in the month of Equos or past it for the year
                        daysSinceColBase += increment * -1;
                    }
                } else if (isBefore == false) {
                    // as Equos was not found after the current year 
                    // and the current year does not have an Equos
                    // we are going to assume that we have already passed the year
                    // if we are going forward
                    daysSinceColBase += increment * -1;
                }
            }   
        }
    }

    return daysSinceColBase;
}

function isYearToShortenEquos(year) {
    var yearDiff = year - baseColignyDate.getYear();
    var isBefore = yearDiff < 0;
    var yLunar = Math.abs(yearDiff) % lunarDriftCycleYears; 
    yLunar = isBefore ? (lunarDriftCycleYears - yLunar): yLunar; // years into lunar drift cycle
    var untilLunarEnd = lunarDriftCycleYears - yLunar - 1;
    const yearsToFindEquos = 4;
    var isYearToShortenEquos = false;
    if (untilLunarEnd <= yearsToFindEquos ) {
        // we need to check if we are upon or it has yet to come the last 30 day Equos of the lunar cycle and remove a day
        
        for (var e = untilLunarEnd; e > -1; e--) {
            isYearToShortenEquos = getDaysInMonth(year + e, equos) == 30;
            if (isYearToShortenEquos) {
                break;
            }
        }
        isYearToShortenEquos = (e == 0);
    }

    return isYearToShortenEquos;
}



export function calculateDate(daysFromBase) {
    // assuming the baseColignyDate is the start of a Metonic cycle
    // and we are calculating the lunar and solar cycles starting from there also

    // we just want to make sure we are only dealing with integers
    daysFromBase = Math.floor(daysFromBase);

    // figure out if this is a date before or after our base date
    // and then get the absolute value
    var isBefore = (daysFromBase/Math.abs(daysFromBase)) == -1;
    daysFromBase = Math.abs(daysFromBase);

    var countingTo = 0;
    var years = 0;

    var y, m, d;
    var yearInMetonic, yearInLunar;
    var increment, comparisonFn, compareFnRightArg;

    if (isBefore) {
        // this is for counting backwards
        increment = -1;
        comparisonFn = greaterThan;

        y = metonicCycle.length;

        countingTo = daysFromBase - 1;
        compareFnRightArg = -1;

    } else {
        // this is for counting foward
        increment = 1;
        comparisonFn = lessThan;

        y = 0;
        m = 0;
        d = 0;

        yearInMetonic = 0;
        yearInLunar = 0;

        countingTo = 0;
        compareFnRightArg = daysFromBase;
    }

    // var daysInSolarCycle = getDaysInSolarCycle();
    // while (comparisonFn((countingTo + (increment * daysInSolarCycle)), compareFnRightArg)) {
    //     // we got a full solar drift cycle so add the years up
    //     years += solarDriftCycleYears;

    //     // now we need to advance the countingTo
    //     countingTo += (increment * daysInSolarCycle);

    //     // now we get the days in the next solar cycle
    //     // we have to update the yearIn for each cycle type

    //     yearInMetonic = years % metonicCycle.length;
    //     yearInLunar = years % lunarDriftCycleYears;
    //     daysInSolarCycle = getDaysInSolarCycle(yearInMetonic, yearInLunar);
    // }

    // add days through completed lunar cycles and count years
    var daysInLunarCycle = getDaysInLunarCycle(yearInMetonic, yearInLunar);
    while (comparisonFn((countingTo + (increment * daysInLunarCycle)), compareFnRightArg)) {
        // loop through through lunar cycles
        
        years += (lunarDriftCycleYears - yearInLunar);

        // now we need to advance the countingTo
        countingTo += (increment * daysInLunarCycle);

        // now we get the days in the next solar cycle
        // we have to update the yearIn for each cycle type
        yearInMetonic = years % metonicCycle.length;
        yearInLunar = 0;
        daysInLunarCycle = getDaysInLunarCycle(isBefore, yearInMetonic, yearInLunar);
    } 

    // add days from completed metonic cycles and count years
    var metonicDays = getDaysInMetonicCycle(isBefore, yearInMetonic);
    while (comparisonFn((countingTo + (increment * metonicDays)), compareFnRightArg)) {
        // we got metonic cycles to go through
        countingTo += (increment * metonicDays);
        years += metonicCycle.length;

        // after the first iteration, all cycles will be full cycles
        metonicDays = daysInMetonicCycle;
    } 

    // add days from completed years and count years
    y = years % metonicCycle.length;
    while (comparisonFn((countingTo + (increment * daysInMetonicYears[y])), compareFnRightArg)) {
        // we are in the last metonic cycle and need to identify specific year
        countingTo += (increment * daysInMetonicYears[y]);
        years += increment;
        y = years % metonicCycle.length;
    } 

    // add completed month days
    while (comparisonFn((countingTo + (increment * metonicCycle[y][m])), compareFnRightArg)) {
        // we are in the actual year so identify the month
        countingTo += (increment * metonicCycle[y][m]);
        m += increment;
    } 

    // we are in the month so get the day
    d = Math.abs(compareFnRightArg - countingTo); // this may need a isBefore check
    countingTo += (increment * d);  

    // get the gregorian date equivalent and day of week
    var newGDate = new Date(baseGregorianDate.getTime());
    newGDate.setDate(newGDate.getDate() + daysFromBase);
    var dayOfWeek = newGDate.getDay();

    var newDate = {
        year: baseColignyDate.getYear() + (increment * years),
        month: baseColignyDate.getMonth() + (increment * m),
        date: baseColignyDate.getDate() + (increment * d),
        day: dayOfWeek,
        gDate: newGDate
    };

    return newDate;
}


export function getStartOfDayHour() {
    return startOfDayHour;
}

function getObject(year, month) {

    var diff = year - baseColignyDate.getYear();

    var yearInMetonic = Math.abs(diff) % metonicCycle.length;

    if (diff < 0 && yearInMetonic != 0) {
        yearInMetonic = metonicCycle.length - yearInMetonic;
    }

    var object;
    if (month != undefined) {
        object = metonicCycle[yearInMetonic][month];
    } else {
        object = metonicCycle[yearInMetonic];
    }

    return object;

}

export function getMetonicYear(year) {
    return getObject(year);    
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

export function getDaysInMonth(year, month, shortenEquos) {
    var daysInMonth = getObject(year, month);

    if (shortenEquos == true && month == equos & daysInMonth == 30 && isYearToShortenEquos(year)) {
        daysInMonth--;
        console.log('shortening equos');
    }

    return daysInMonth;
}

export function getMonthName (monthIndex) {
    return colignyMonths[monthIndex];
};

function lessThan(left, right) {
    return left < right;
}

function greaterThan(left, right) {
    return left > right;
}