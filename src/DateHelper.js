export var Today = new Date();

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

export const DaysOfWeek = calculateDaysOfWeek();