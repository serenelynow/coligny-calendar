import {getMonthName, calculateDaysSinceColBase, baseGregorianDate, getDaysInMonth, getCyclesCompleted} from './ColignyCycle.js';
import * as DateHelper from './DateHelper.js';
import * as MoonPhases from './MoonPhases.js';

export default function ColignyMonth (year, month) {
  var year;
  var month;
  var startDay;
  var gStartDate;
  var rows;
  var cyclesCompleted;
  var moonPhases = {};
  var callBack;

  this.toString = function (numeric) {

      var cString;
      if (numeric) { 
        cString = month + "/" + year;
      } else {
        cString = this.getMonthName(month) + " " + year + " BG";
      }

    return cString;
  };

  this.getYear = function () {
    return year;
  };

  this.setYear = function (newYear) {
    year = parseInt(newYear);

    if (year != undefined) {
      cyclesCompleted = getCyclesCompleted(year);
      if (month != undefined) {
        this.calculateStartDay();
      }
    }
  }

  this.getMonth = function () {
    return month;
  };

  this.setMonth  = function (newMonth) {
    month = parseInt(newMonth);

    if (year != undefined && month != undefined) {
      this.calculateStartDay();
    }
  };

  this.getMonthName = function () {
    return getMonthName(month);
  };

  this.getGStartDate = function () {
    return gStartDate;
  };

  this.getStartDay = function () {
    if (year != undefined && month != undefined && startDay == undefined) {
      calculateStartDay();
    }
    return startDay;
  };

  this.setStartDay = function (newStartDay) {
    startDay = newStartDay;
  };

  this.calculateStartDay = function (callBackFn) {
    // get days from zero for today
    var daysSinceZero = calculateDaysSinceColBase(year, month, 1);

    gStartDate = new Date(
      baseGregorianDate.getFullYear(),
      baseGregorianDate.getMonth(),
      baseGregorianDate.getDate());
    gStartDate.setDate(gStartDate.getDate() + daysSinceZero);

    DateHelper.equalizeTime(gStartDate);

    startDay = gStartDate.getDay();

    var moonPhaseData = {
      cYear: year,
      cMonth: month,
      gYear: gStartDate.getFullYear(),
      gMonth: gStartDate.getMonth(),
      gDate: gStartDate.getDate()
    }

    MoonPhases.getMoonPhases(moonPhaseData, loadMoonPhases);
    
  };

  this.update = function (year, month, clearFirst, finishedLoading) {
    
    if (clearFirst == true) {
      init();
    }

    callBack = finishedLoading;

    if (year != undefined) {
      this.setYear(year);
    }

    if (month != undefined) {
      this.setMonth(month);
    }
  };

  this.getRows = function () {
    if (rows == undefined) {
      rows = generateRows();
    }

    return rows;
  };

  function loadMoonPhases(phases) {
    moonPhases = phases;
    rows = generateRows();
    callBack();
  };

  function init () {
    year = null;
    month = null;
    startDay = null;
    gStartDate = null;
    rows = null;
    cyclesCompleted = null;
    moonPhases = {};
    callBack = null;
  }

  function createData (day, gDate, isToday, moonPhase) {
    var dateStr;
    
    if (gDate instanceof Date) {

      var tomorrow = new Date(gDate);
      tomorrow.setDate(tomorrow.getDate() + 1);

      dateStr = DateHelper.formatDateRange(gDate, tomorrow);
      
    } else {
      dateStr = gDate;
    }
    
    return { day, dateStr, isToday, moonPhase };
  };

  function generateRows () {

    var currentDay = 1;
    var daysInMonth = getDaysInMonth(cyclesCompleted, month);
    var r = 0;
    var isToday;
    rows = [];

    // do the first week if it doesn't start on a Sunday
    if (startDay > 0) {
      rows[r] = [];
      // add the blank days
      for (var i = 0; i < startDay; i++) {
        rows[r][i] = createData("", "");
      }

      // finish the first week with the actual days
      var moonPhase;
      for (var d = startDay; d < 7; d++) {
        isToday = DateHelper.isToday('g', gStartDate);

        moonPhase = moonPhases[currentDay];
        
        rows[r][d] = createData(currentDay, gStartDate, isToday, moonPhase);

        currentDay++;

        // update this after all work is done to prepare for next calendar day
        gStartDate.setDate(gStartDate.getDate() + 1);
      }

      r = 1;

      currentDay = 7 - startDay + 1;
    } 

    var moonPhase;
    while (currentDay <= daysInMonth) {
      rows[r] = [];
      for (var d = 0; d < 7; d++) {
        if (currentDay <= daysInMonth) {

          // determine today from Gregorian date
          isToday = DateHelper.isToday('g', gStartDate);

          moonPhase = moonPhases[currentDay];

          rows[r][d] = createData(currentDay, gStartDate, isToday, moonPhase);

          // update this after all work is done to prepare for next calendar day
          gStartDate.setDate(gStartDate.getDate() + 1);

        } else {
          // we've finished the days of the month and need to add the blank days
          rows[r][d] = createData("", "");
        }
        currentDay +=1;
      };
      r++;
    };

    return rows;
  }

  if (year != undefined) {
    this.setYear(year);
  }
  if (month != undefined) {
    this.setMonth(month);
  }
};