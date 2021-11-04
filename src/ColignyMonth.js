import {colignyMonths} from './ColignyCycle.js'

export class ColignyMonth (year, month) {
	#year;
	#day;
	#gStartDate;
	#startDay;
	#yearInCycle;

	constructor (year, month) {
		setYear(year);
		setMonth(month);
	}

	toString = function (numeric) {

		var cString;
		if (numeric) { 
			cString = month + "/" + year;
		} else {
			cString = getMonthName(month) + " " + year;
		}

		return cString;
	};

	getYear = function () {
		return this.year;
	};

	setYear = function (newYear) {
		this.year = newYear;
		this.yearInCycle = getYearInCycle(this.year);

		if (this.year != undefined && this.month != undefined) {
			calculateStartDay();
		}
	}

	getMonth  = function () {
		return this.month;
	};

	setMonth = function (newMonth) {
		this.month = newMonth;

		if (this.year != undefined && this.month != undefined) {
			this.calculateStartDay();
		}
	};

	getMonthName = function () {
		return getMonthName(this.month);
	};

	getGStartDate = function () {
		return this.gStartDate;
	};

	getStartDay = function () {

		if (this.year != undefined && this.month != undefined && this.startDay == undefined) {
			calculateStartDay();
		}
		return this.startDay;
	};

	setStartDay = function (newStartDay) {
		this.startDay = newStartDay;
	};

	getYearInCycle = function () {
		return this.yearInCycle;
	};

	calculateStartDay = function () {
		// get days from zero for today
		var daysSinceZero = calculateDaysSinceColBase(year, month, 1);

		this.gStartDate = new Date(
			baseGregorianDate.getFullYear(),
			baseGregorianDate.getMonth(),
			baseGregorianDate.getDate());
		this.gStartDate.setDate(this.gStartDate.getDate() + daysSinceZero);

		equalizeTime(this.gStartDate);

		this.startDay = this.gStartDate.getDay();
	};

	getDaysInMonth = function () {
		var days = (colignyCycle[yearInCycle][month] || 0);
		return days;
	}
};