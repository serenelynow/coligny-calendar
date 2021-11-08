import {baseColignyDate, baseGregorianDate} from './ColignyCycle.js';
import ColignyDate from './ColignyDate.js';
import {l10n} from './l10n.js';

export const milliFactor = 24 * 60 * 60 * 1000;

function calculateCurrentColignyDate () {

    equalizeTime(baseGregorianDate);

    var diffGDatesMs = gToday.getTime() - baseGregorianDate.getTime();

    var diffGDatesDays = diffGDatesMs / milliFactor;

    return new ColignyDate(diffGDatesDays);
};

export var gToday = new Date();
export var cToday = calculateCurrentColignyDate();

var dateConfig = {year: 'numeric', month:'short', day:'2-digit', era:'short'};
var formatter = new Intl.DateTimeFormat([], dateConfig);
var formatterEn = new Intl.DateTimeFormat(['en'], dateConfig);

export function formatDateRange(startDate, endDate) {
    
    var dateStr = '';
    var dateRangeArray = formatter.formatRangeToParts(startDate, endDate);

    // get an english one for translation
    var dateRangeArrayEn = formatterEn.formatRangeToParts(startDate, endDate);

    for (var i = 0; i < dateRangeArray.length; i++) {
        if (dateRangeArray[i].type == 'era') {
            if (dateRangeArrayEn[i].value == 'AD'){
                dateRangeArray[i].value = l10n.ce;
            } else if (dateRangeArrayEn[i].value == 'BC') {
                dateRangeArray[i].value = l10n.bce;
            }
        }
        dateStr += dateRangeArray[i].value;
    }
    return dateStr;
};

export function isToday (type, year, month, date) {
    
    var isToday = false;

    if (type == "g") { // Gregorian
        var now = new Date();
        var compareDate;
        if (year instanceof Date) {
            compareDate = new Date(year);
        } else {
            compareDate = new Date(year, month, date);
        }

        isToday = now.toLocaleDateString() == compareDate.toLocaleDateString();

        if (isToday) {
            // it's the same date and now we need to
            // check if it's after 6pm of the same date
            // if it is, this is today
            isToday = isToday && now.getHours() >= 18;
        } else {
            // it's not the same date so we want to 
            // look at the next compare date to see 
            // if we are before 6pm of that date
            // an mark this calendar date as true
            compareDate.setDate(compareDate.getDate() + 1);
            isToday = now.toLocaleDateString() == compareDate.toLocaleDateString();
            isToday = isToday && now.getHours() < 18;
        }
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

    var language = l10n.getInterfaceLanguage();

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