import { calculateDate, getMonthName} from './ColignyCycle.js';
import {toLocaleDateString} from './DateHelper.js';

export default function ColignyDate (year, month, date, day) {
	var month;
	var date;
	var year;
	var day;
	var gDate;

	this.setMonth = function (newMonth) {
		month = newMonth;
	};

	this.getMonth = function () {
		return month;
	};

	this.getMonthName = function () {
		return getMonthName( month);
	};

	this.setDate = function (newDate) {
		 date = newDate;
	};

	this.getDate = function () {
		return date;
	};

	this.setYear = function (newYear) {
		 year = newYear;
	};

	this.getYear = function () {
		return year;
	};

	this.setDay = function (newDay) {
		 day = newDay;
	};

	this.getDay = function () {
		return day;
	};

	this.setGDate = function (newGDate) {
		gDate = newGDate;
	};

	this.equals = function (otherColignyDate, otherMonth, otherDate) {

		var equals = false;
		var otherYear, otherMonth, otherDate;
		if (otherColignyDate instanceof ColignyDate) {
			otherYear = otherColignyDate.getYear();
			otherMonth = otherColignyDate.getMonth();
			otherDate = otherColignyDate.getDate();
		} else {
			otherYear = otherColignyDate;
		}

		equals = (
			(otherColignyDate == year)
			&& (otherMonth == month) 
			&& (otherDate == date)
		)
		return equals;
	}

	this.isBefore = function(aYear, aMonth, aDate) {
		var isBefore = false;

		if (year < aYear) {
			isBefore = true;
		} else if (year == aYear) {
			if (month < aMonth){
				// in same year but month before
				isBefore = true;
			} else if ((month == aMonth) && (date < aDate)) {
				isBefore = true;
			}
		}

		return isBefore;
	};

	this.toLocaleDateString = function () {
		return toLocaleDateString(this, gDate);
	};
	
	if (month == undefined && date == undefined ) {
		// this should be days since zero date
		var newDate = calculateDate(year);

		this.setYear(newDate.year);
		this.setMonth(newDate.month);
		this.setDate(newDate.date);
		this.setDay(newDate.day);
		this.setGDate(newDate.gDate);

	} else {
		this.setYear(year);
		this.setMonth(month);
		this.setDate(date);
		this.setDay(day);
	}
 };