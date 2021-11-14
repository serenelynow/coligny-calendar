import {baseColignyDate, baseGregorianDate, getStartOfDayHour} from './ColignyCycle.js';
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
gToday.setHours(gToday.getHours() + getStartOfDayHour());
export var cToday = calculateCurrentColignyDate();

var dateConfig = {year: 'numeric', month:'short', day:'2-digit', era:'short'};
var formatter = new Intl.DateTimeFormat([], dateConfig);
var formatterEn = new Intl.DateTimeFormat(['en'], dateConfig);

export function toLocaleDateString(cDate, gDate) {
    var fConfig = {year: 'numeric', month:'long', day:'2-digit', era:'short'};
    var dateFormater = new Intl.DateTimeFormat([], dateConfig);

    var fDate = (gDate != undefined) ? gDate : new Date();
    var dateParts = dateFormater.formatToParts(fDate);
    var dateStr = '';
    for (var i = 0; i < dateParts.length; i++) {
        var part = dateParts[i];
        
        switch(part.type) {
            case 'month': 
                dateStr += cDate.getMonthName();
                break;
            case 'year':
                dateStr += cDate.getYear();
                break;
            case 'day':
                dateStr += cDate.getDate();
                break;
            case 'era':
                dateStr += 'BG';
                break;
            default:
                dateStr += part.value;
        }

    }

    return dateStr;
}

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
        // var now = new Date();
        var compareDate;
        if (year instanceof Date) {
            // compareDate = new Date(year);
            compareDate = year;
        } else {
            compareDate = new Date(year, month, date);
        }

        isToday = gToday.toLocaleDateString() == compareDate.toLocaleDateString();

    } else if (type == 'c') {
        if (year instanceof ColignyDate) {
            compareDate = year;
        } else {
            compareDate = new ColignyDate(year, month, date);
        }
        
        isToday = cToday.equals(compareDate);
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