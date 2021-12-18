import {gToday, milliFactor} from './DateHelper.js';
import ColignyDate from './ColignyDate.js';

// dates according to http://www.coligny-app.com
export const baseGregorianDate = new Date(2003, 4, 8);
export const baseColignyDate = new ColignyDate (2584, 0, 1, baseGregorianDate.getDay());

const startOfDayHour = -18;

const colignyMonths = [ 
    "Quimonios", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "Rantaranos", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
]; // 14 months

const equos = 10;
const thirtyDayEquos = [ 0, 4, 5, 9, 10, 14, 18 ];

const intercalary2 =  7;
const intercalary2Years = [ 2, 7, 12, 16 ];

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

const lunarDriftCycleLength = 61;
const solarDriftCycleLength = 6536;

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
const daysInYear = {};
const adjustedYears = {};

function calculateDaysInFullMetonicCycle () {
    var days = 0;

    for (var y = 0; y < metonicCycle.length; y++) {
        days += daysInMetonicYears[y];
    }

    return days;

}
const daysInMetonicCycle = calculateDaysInFullMetonicCycle();

function wereDaysAlreadyRemovedForSolarDrift(year) {
    const yearInfo = isYearToRemoveIntercalary2(year, true);

    const daysAlreadyRemoved = yearInfo.isYearToAdjust || (yearInfo.untilCycleEnd < yearInfo.yearsToNextCycleAdjust);
    
    return daysAlreadyRemoved;
}

function wereDaysAlreadyRemovedForLunarDrift(year) {
    const yearInfo = isYearToShortenEquos(year, true);

    const daysAlreadyRemoved = yearInfo.isYearToAdjust || (yearInfo.untilCycleEnd < yearInfo.yearsToNextCycleAdjust);
    
    return daysAlreadyRemoved;
}

function getDaysInMetonicCycle(startYear) {
    // right now this function is only used to calculate the current date
    // and as of now, it doesn't even span a whole metonic cycle from our base date
    // so the todos are not relevant.  If we change the base date to something earlier 
    // where a lunar or drift cycle will be crossed to calculate the current date, 
    // then those TODOs will need to be done.
    var metonicDays = daysInMetonicCycle;
    var yearDiff = startYear - baseColignyDate.getYear();
    const isBeforeBase = yearDiff < 0;
    yearDiff = Math.abs(yearDiff);

    // we want to see if we crossed over into 
    // a new solar or lunar drift cycle
    // and adjust the days in the lunar cycle accordingly

    var lunarCyclesAtStart, lunarCycleAtEnd, lunarEndYear;
    lunarCyclesAtStart = Math.floor(yearDiff / lunarDriftCycleLength);
    lunarEndYear = yearDiff + metonicCycle.length;
    lunarCycleAtEnd = Math.floor(lunarEndYear / lunarDriftCycleLength);

    if ((lunarCyclesAtStart != lunarCycleAtEnd) && (wereDaysAlreadyRemovedForLunarDrift(startYear - 1) == false)) {
        metonicDays--;
    }

    var solarCyclesAtStart, solarCycleAtEnd, solarEndYear;
    solarCyclesAtStart = Math.floor(yearDiff / solarDriftCycleLength);
    solarEndYear = yearDiff + metonicCycle.length;
    solarCycleAtEnd = Math.floor(solarEndYear / solarDriftCycleLength);

    if ((solarCyclesAtStart != solarCycleAtEnd) && (wereDaysAlreadyRemovedForSolarDrift(startYear - 1) == false)) { 
        metonicDays -= metonicCycle[interclary[0]][intercalary2];
    }   

    // we may not have completed a new solar or lunar drift cycle in the last metonic cycle
    // but we maybe close enough to the end that it's the year 
    // when a day or month should be removed so we need to check for that now
    if (wereDaysAlreadyRemovedForLunarDrift(startYear + metonicCycle.length - 1) == true) {
        metonicDays--;
    }

    if (wereDaysAlreadyRemovedForSolarDrift(startYear + metonicCycle.length - 1) == true) {
        metonicDays -= metonicCycle[interclary[0]][intercalary2];
    }

    return metonicDays;
}

// this function gets called anytime there is a change in month that is rendered
// thus is is really only used to calculate the first of the month being rendered
export function calculateDaysSinceColBase (year, month, day) {

    var daysSinceColBase = 0;
    var isBeforeBase = !(baseColignyDate.equals(year, month, day) || baseColignyDate.isBefore(year, month, day));

    // if this date equals baseColignDate, no need to do any further calculations
    if (!(baseColignyDate.equals(year, month, day))) {

        var yearDiff = Math.abs(year - baseColignyDate.getYear());
        var countingYears = 0;

        var increment, comparisonFn, compareFnRtArg;
        var m, mStart, mEnd;
        var y = 0;
        var mo, monthDays, monthInitial, monthFnRtArg, daysInMonth;

        if (isBeforeBase == true) {
            // this is for counting backwards
            increment = -1;
            comparisonFn = greaterThan;

            yearDiff--;

        } else {
            // this is for counting forward
            increment = 1;
            comparisonFn = lessThan;
        }

        // calculate completed metonic cycles and total days for those
        var completedMetonicCycles = Math.floor(yearDiff / metonicCycle.length);
        daysSinceColBase = completedMetonicCycles * daysInMetonicCycle;

        var remainder = yearDiff % metonicCycle.length;

        if (isBeforeBase == true) {
            // this is for counting backwards

            mStart = metonicCycle.length - 1;
            mEnd = mStart - remainder;

        } else {
            // this is for counting forward

            mStart = 0;
            mEnd = remainder;

        }

        for (m = mStart; comparisonFn(m, mEnd); m += increment) {
            daysSinceColBase += daysInMetonicYears[m];
        }


        // iterated completed months
        var yearCycle = metonicCycle[m];
        if (isBeforeBase == true) {
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
        if (isBeforeBase == true) {
            monthDays = yearCycle[mo];
            daysSinceColBase += monthDays - day + 1;
            daysSinceColBase *= -1; // make it negative since it's before
        } else {
            daysSinceColBase += (day - baseColignyDate.getDate());        
        }

        // removed days for drift cycles
        var daysToRemove = getDaysToRemoveForDrift(year, month, day) * increment;
        daysSinceColBase -= daysToRemove;    
    }

    return daysSinceColBase;
}

function getCycleIndex(year, cycleLength) {
    var yearDiff = year - baseColignyDate.getYear();
    var isBeforeBase = yearDiff < 0;
    var cycleIndex = Math.abs(yearDiff) % cycleLength;

    if (isBeforeBase == true && cycleIndex == 0) {
        cycleIndex = cycleLength;
    }
    // if we are going backwards, the yMetonic is how far from the end
    cycleIndex = (isBeforeBase == true) ? (cycleLength - cycleIndex) : cycleIndex;

    return cycleIndex;

}

function getMetonicIndex(year) {
    var yMetonic = getCycleIndex(year, metonicCycle.length);

    return yMetonic;
};

function getYearInLunarDriftCycle(year) {
    var yearInLunarDriftCycle = getCycleIndex(year, lunarDriftCycleLength);

    return yearInLunarDriftCycle;
};

function getYearInSolarDriftCycle(year) {
    var yearInSolarDriftCycle = getCycleIndex(year, solarDriftCycleLength);

    return yearInSolarDriftCycle;
};

function getDriftCycleMetonicIndex(cycle, yearInMetonic) {
    var i;
    for (i = 0; i < cycle.length; i++) {
        if (cycle[i] >= yearInMetonic) {
            break;
        }
    }

    if (i == cycle.length) {
        i = 0;
    }

    return i;
};

function getThirtyDayEquosIndex(yMetonic){
    var i = getDriftCycleMetonicIndex(thirtyDayEquos, yMetonic);
    return i;
};

function getIntercalary2Index(yMetonic) {
    var i = getDriftCycleMetonicIndex(intercalary2Years, yMetonic);
    return i;
};

function getYearsToNextCycleAdjustYear(i, isBeforeBase, driftCycleArray) {

    var i2;
    
    if (i == (driftCycleArray.length - 1)) {
        // we are at the end so get the first one 
        // and add the length of a cycle
        i2 = driftCycleArray[0] + metonicCycle.length;
    } else {
        // we aren't at the end to just next the next one
        i2 = driftCycleArray[i + 1];
    }

    var yearsToNextCycleAdjust = Math.abs(i2 - driftCycleArray[i]);

    return yearsToNextCycleAdjust;
}

function getYearsToNextThirtyDayEquos(i, isBeforeBase) {
    var yearsToNextEquos = getYearsToNextCycleAdjustYear(i, isBeforeBase, thirtyDayEquos);
    return yearsToNextEquos;
}

function getYearsToNextIntercalary2(i, isBeforeBase) {
    var yearsToNext = getYearsToNextCycleAdjustYear(i, isBeforeBase, intercalary2Years);
    return yearsToNext;
};

function isYearToAdjustForDrift(
    year, 
    getYearInDriftCycleFn,
    driftCycleLength,
    getDriftCycleIndexFn,
    driftCycleArray,
    getYearsToNextAdjustFn,
    returnObject) {

    const yearDiff = year - baseColignyDate.getYear();
    const isBeforeBase = yearDiff < 0;
    const yearInDriftCycle = getYearInDriftCycleFn(year);
    const untilCycleEnd = (driftCycleLength - 1) - yearInDriftCycle;

    const yMetonic = getMetonicIndex(year); 
    const i = getDriftCycleIndexFn(yMetonic);
    const isCycleAdjustYear = driftCycleArray[i] == yMetonic ;
    
    const yearsToNextCycleAdjust = isCycleAdjustYear ? getYearsToNextAdjustFn(i, isBeforeBase) : Math.abs(driftCycleArray[i] - yMetonic);

    const isYearToAdjust = (isCycleAdjustYear && (untilCycleEnd < yearsToNextCycleAdjust));

    if (returnObject == true) {
        return {
            isBeforeBase: isBeforeBase,
            untilCycleEnd: untilCycleEnd,
            yearsToNextCycleAdjust: yearsToNextCycleAdjust,
            isYearToAdjust: isYearToAdjust
        };
    } else {
        return isYearToAdjust;
    }
};

function isYearToShortenEquos(year, returnObject) {
    return isYearToAdjustForDrift(
        year, 
        getYearInLunarDriftCycle, 
        lunarDriftCycleLength, 
        getThirtyDayEquosIndex, 
        thirtyDayEquos, 
        getYearsToNextThirtyDayEquos, 
        returnObject
    );
};

function isYearToRemoveIntercalary2(year, returnObject) {
    return isYearToAdjustForDrift(
        year, 
        getYearInSolarDriftCycle, 
        solarDriftCycleLength, 
        getIntercalary2Index, 
        intercalary2Years, 
        getYearsToNextIntercalary2, 
        returnObject
    );
};

function getDaysToRemoveforDriftCycle (
    year, month, day,
    driftCycleLength,
    daysToRemoveMultiplier,
    isYearToAdjustForDriftFn,
    driftAdjustMonth) {

    var daysToRemove = 0;

    const yearDiff = year - baseColignyDate.getYear();
    const driftCycles = Math.floor(Math.abs(yearDiff) / driftCycleLength);
    daysToRemove += driftCycles * daysToRemoveMultiplier;

    const yearInfo = isYearToAdjustForDriftFn(year, true);

    if (( (yearInfo.isBeforeBase == false ) && (yearInfo.untilCycleEnd <= yearInfo.yearsToNextCycleAdjust) )) {
        if (yearInfo.isYearToAdjust == false // we are after the last equos in this lunar drift cycle
            || (yearInfo.isYearToAdjust == true && month > driftAdjustMonth)) // we are in the last equos year in this lunar drift cycle
        {
            daysToRemove += daysToRemoveMultiplier;
        }

    } else if ((yearInfo.isBeforeBase == true) 
    && ((yearInfo.isYearToAdjust == false && yearInfo.untilCycleEnd >= yearInfo.yearsToNextCycleAdjust) || (yearInfo.isYearToAdjust == true && yearInfo.untilCycleEnd <= yearInfo.yearsToNextCycleAdjust))) { 
        if ((yearInfo.isYearToAdjust == true && month <= driftAdjustMonth) // we are in an equos year and past it
            || (yearInfo.isYearToAdjust == false)) // we have already passed the last equos year
        {
            daysToRemove += daysToRemoveMultiplier;
        }
    }

    return daysToRemove;
};

function getDaysToRemoveforLunarDrift (year, month, day) {
    var daysToRemove = getDaysToRemoveforDriftCycle (
        year, month, day,
        lunarDriftCycleLength, 1, isYearToShortenEquos, equos
    );

    return daysToRemove;
};

function getDaysToRemoveforSolarDrift (year, month, day) {
    var daysToRemove = getDaysToRemoveforDriftCycle (
        year, month, day,
        solarDriftCycleLength, metonicCycle[intercalary2Years[0]][intercalary2], isYearToRemoveIntercalary2, intercalary2
    );

    return daysToRemove;

};

function getDaysToRemoveForDrift (year, month, day) {
    var daysToRemove = 0;

    daysToRemove += getDaysToRemoveforSolarDrift(year, month, day);
    daysToRemove += getDaysToRemoveforLunarDrift(year, month, day);

    return daysToRemove;
};


// this function is only called when the app loads
// to calculate the today's Coligny date
export function calculateDate(daysFromBase) {
    // assuming the baseColignyDate is the start of a Metonic cycle
    // and we are calculating the lunar and solar cycles starting from there also

    // we just want to make sure we are only dealing with integers
    daysFromBase = Math.floor(daysFromBase);

    // figure out if this is a date before or after our base date
    // and then get the absolute value
    var baseColignyYear = baseColignyDate.getYear();
    var isBeforeBase = daysFromBase < 0;
    daysFromBase = Math.abs(daysFromBase);

    var countingTo = 0;
    var years = 0;

    var y, m, d;
    var yearInMetonic;
    var increment, comparisonFn, compareFnRightArg;

    if (isBeforeBase == true) {
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

        countingTo = 0;
        compareFnRightArg = daysFromBase;
    }

    // add days from completed metonic cycles and count years
    var actualStartYear = baseColignyYear+ (years * increment);
    var metonicDays = getDaysInMetonicCycle(actualStartYear);
    while (comparisonFn((countingTo + (increment * metonicDays)), compareFnRightArg)) {
        // we got metonic cycles to go through
        countingTo += (increment * metonicDays);
        years += metonicCycle.length;
        actualStartYear = baseColignyYear + (years * increment);

        // after the first iteration, all cycles will be full cycles
        metonicDays = getDaysInMetonicCycle(actualStartYear);
    } 

    // TODO: deal with drift day removal in remaining time
    // do I use helper methods that remove days but maybe less efficient
    // or do I do it all here which will be more efficient
    // because I will only check if to remove days once
    // versus each year and month that is traversed

    // add days from completed years in incomplete metonic cycle and count years
    while (comparisonFn((countingTo + (increment * getDaysInYear(baseColignyYear + (years * increment)))), compareFnRightArg)) {
        // we are in the last metonic cycle and need to identify specific year
        countingTo += (increment * getDaysInYear(baseColignyYear + (years * increment)));
        years++;
    } 

    // add completed month days
    while (comparisonFn((countingTo + (increment * getDaysInMonth(baseColignyYear + (years * increment), m))), compareFnRightArg)) {
        // we are in the actual year so identify the month
        countingTo += (increment * getDaysInMonth(baseColignyYear + (years * increment), m));
        m += increment;
    }

    // we are in the month so get the day
    d = Math.abs(compareFnRightArg - countingTo); // this may need a isBeforeBase check
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

function getDaysInYear(year) {

    var days = daysInYear[year];

    if (days == undefined) {
        var y = getMetonicIndex(year);

        var days = daysInMetonicYears[y];

        if (isYearToShortenEquos(year)) {
            days--;
        }

        if (isYearToRemoveIntercalary2(year)) {
            days -= metonicCycle[intercalary.year][intercalary2];
        }

        daysInYear[year] = days;
    }

    return days;
}

function getObject(year, month, adjustForDrift) {

    var yearInMetonic = getMetonicIndex(year);

    var yearObject;
    if (adjustForDrift == true) {
        if (adjustedYears[year] != undefined) {
            yearObject = adjustedYears[year];
        } else {
            yearObject = JSON.parse(JSON.stringify(metonicCycle[yearInMetonic]));
            if (isYearToShortenEquos(year)) {
                yearObject[equos] += -1;
            } else if (isYearToRemoveIntercalary2(year)) {
                yearObject[intercalary2] = null;
            }
            adjustedYears[year] = yearObject;
        }
    } else {
        yearObject = metonicCycle[yearInMetonic];
    } 

    var object;
    if (month != undefined) {
        object = yearObject[month];
    } else {
        object = yearObject;
    }
    return object;
}

export function getStartOfDayHour() {
    return startOfDayHour;
}

export function getMetonicYear(year) {
    return getObject(year, null, true);    
}

export function getMonthsInYear(year) {
    var thatYear = getObject(year, null, true);
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
    var daysInMonth = getObject(year, month, shortenEquos);
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