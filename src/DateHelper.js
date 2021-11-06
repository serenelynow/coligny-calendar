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
    var isToday = false;
    if (type == "g") { // Gregorian
        if (!(year instanceof Date)) {
            year = new Date(year, month, date);
        }
        // var date = new Date(year, month, date);
        isToday = gToday.toLocaleDateString() == year.toLocaleDateString();
    } else if (type == 'c') {
        isToday = cToday.equals(year, month, date);
    } 

    return isToday;
};

function calculateDaysOfWeek() {

    // format should be a string of either "short" or "long"
    var forDays = new Date();

    // set date to a Sunday date for each looping
    forDays.setDate(forDays.getDate() - forDays.getDay());

    var daysOfWeek = {short:[], long: []};

    var language;

    if (typeof Intl !== 'undefined') {
        try {
          language = Intl.NumberFormat().resolvedOptions().locale;
        } catch (err) {
          console.error("Cannot get locale from Intl")
        }
    } else if (window.navigator.languages) {
        language = window.navigator.languages[0];
    } else {
        language = window.navigator.userLanguage || window.navigator.language;
    }

    for (var i = 0; i < 7; i++) {
        daysOfWeek.short[i] = new Intl.DateTimeFormat(language, {weekday: "short"}).format(forDays);
        daysOfWeek.long[i] = new Intl.DateTimeFormat(language, {weekday: "long"}).format(forDays);

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