import {baseColignyDate, baseGregorianDate} from './ColignyCycle.js';
import ColignyDate from './ColignyDate.js';

export const milliFactor = 24 * 60 * 60 * 1000;

function calculateCurrentColignyDate () {

    equalizeTime(baseGregorianDate);

    var diffGDatesMs = gToday.getTime() - baseGregorianDate.getTime();

    var diffGDatesDays = diffGDatesMs / milliFactor;

    return new ColignyDate(diffGDatesDays);
};

export var gToday = new Date();
export var cToday = calculateCurrentColignyDate();

export function isToday (type, year, month, date) {
    var isToday
    if (type == "g") {
        var date = new Date(year, month, date);
        isToday = gToday == date;
    } else {
        /* TODO need to finish this*/
        isToday = (
            (cToday.getYear() == year)
        )
    }
}

function calculateDaysOfWeek() {

    // format should be a string of either "short" or "long"
    var forDays = new Date();

    // set date to a Sunday date for each looping
    forDays.setDate(forDays.getDate() - forDays.getDay());

    var daysOfWeek = {short:[], long: []};

    for (var i = 0; i < 7; i++) {
        daysOfWeek.short[i] = new Intl.DateTimeFormat('en-US', {weekday: "short"}).format(forDays);
        daysOfWeek.long[i] = new Intl.DateTimeFormat('en-US', {weekday: "long"}).format(forDays);

        // advance to next day
        forDays.setDate(forDays.getDate() + 1);
    }
    return daysOfWeek;
};

export function equalizeTime (gDate) {
    // set times to match now's time so that 
    // they will add and subtract times evenly to leave just days
    gDate.setHours(gToday.getHours());
    gDate.setMinutes(gToday.getMinutes());
    gDate.setSeconds(gToday.getSeconds());
    gDate.setMilliseconds(gToday.getMilliseconds());
};

export const DaysOfWeek = calculateDaysOfWeek();