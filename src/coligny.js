var coligny = (function () {
    var coligny = {};

	const milliFactor = 24 * 60 * 60 * 1000;
	const colignyMonths = [ 
		"Quimonios", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "Rantaranos", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
	]; // 14 months

    const daysOfWeek = {
        short: [null,null,null,null,null,null,null],
        long: [null,null,null,null,null,null,null]
    };

	// 20 year cycle
	const colignyCycle = [
        [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        // [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,30,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
        [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ]
	];

	const yearsInCycle = colignyCycle.length;
	const daysInEachYear = [];
	const daysInCycle = calculateDaysInCycle(colignyCycle);
    
    // dates according to Helen's research
    // const baseGregorianDate = new Date(2015,3,26); // sunday
    // const baseColignyDate = new ColignyDate (5015, 0, 1, baseGregorianDate.getDay());
    
    // dates according to http://www.coligny-app.com
	const baseGregorianDate = new Date(2003,4,8);
    const baseColignyDate = new ColignyDate (5003, 0, 1, baseGregorianDate.getDay());
    
    var gToday = new Date();
	var cToday;
	
    var currentCalendar;

	function ColignyCalendar (year, month) {
		var year;
		var month;
		var startDay;
		var gStartDate;
		var yearInCycle;

		this.toString = function (numeric) {

			var cString;
			if (numeric) { 
				cString = month + "/" + year;
			} else {
				cString = getMonthName(month) + " " + year;
			}

			return cString;
		};

		this.getYear = function () {
			return year;
		};

		this.setYear = function (newYear) {
			year = newYear;
			yearInCycle = getYearInCycle(year);

			if (year != undefined && month != undefined) {
				this.calculateStartDay();
			}
		}

		this.getMonth  = function () {
			return month;
		};

		this.setMonth = function (newMonth) {
			month = newMonth;

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
				this.calculateStartDay();
			}
			return startDay;
		};

		this.setStartDay = function (newStartDay) {
			startDay = newStartDay;
		};

		this.getYearInCycle = function () {
			return yearInCycle;
		};

		this.calculateStartDay = function () {
			// get days from zero for today
			var daysSinceZero = calculateDaysSinceColBase(year, month, 1);

			gStartDate = new Date(
				baseGregorianDate.getFullYear(),
				baseGregorianDate.getMonth(),
				baseGregorianDate.getDate());
			gStartDate.setDate(gStartDate.getDate() + daysSinceZero);

			equalizeTime(gStartDate);

			startDay = gStartDate.getDay();
		};

		this.getDaysInMonth = function () {
            // thisis the original code when hack can be removed
			var days = (colignyCycle[yearInCycle][month] || 0);
			return days;
		}

		this.setYear(year);
		this.setMonth(month);

	};

	function ColignyDate  (year, month, date, day) {
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
			return getMonthName(month);
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
		}

		this.getDay = function () {
			return day;
		}

		this.calculateDate = function (daysFromBase) {
			// calcate date from days from base.
			daysFromBase = Math.floor(daysFromBase);
			

			//calulate milliseconds to get Gregorian date and its day of week
			var time = baseGregorianDate.getTime() + (daysFromBase*milliFactor);
			gDate = new Date(time);

			var dayOfWeek = gDate.getDay();
			this.setDay(dayOfWeek);

			var cycles = Math.floor(daysFromBase/daysInCycle);

			var daysSoFar = cycles*daysInCycle;

			// cycles * years in a cycle
			var year = baseColignyDate.getYear() + (cycles * colignyCycle.length);

			// get remainder of mod to know how many days we are into current cycle
			var daysInCurrentCurrentCycle = daysFromBase % daysInCycle;
			var y, m, d;

			for (y = 0; y < daysInEachYear.length; y++) {

				if ((daysSoFar + daysInEachYear[y]) < daysFromBase) {
					// if this year will complelete, add all its days and a year
					year += 1;
					daysSoFar += daysInEachYear[y];

				} else {
					// get out of loop
					// need to calcate month in current year
					break;
				}
				
			}
			//add year for current year
			this.setYear(year);

			var month = 0;
			for (m = 0; m < colignyCycle[y].length; m++) {
				if ((daysSoFar + colignyCycle[y][m]) < daysFromBase) {
					// if this year will complelete, add it's days and year
					month += 1;
					daysSoFar += colignyCycle[y][m];

				} else {
					// get out of loop
					// need to calcate day in current month
					break;
				}
			}
			this.setMonth(month);

			var date = baseColignyDate.getDate() + (daysFromBase - daysSoFar);

			// add a day for the current Day
			// this could be a bug if it's perfectly the beginning of they day
			this.setDate(date);
		};

		this.toString = function (numeric) {

			var cString;
			if (numeric == true) { 
				cString = this.getMonth() + "/" + this.getDate() + "/" + this.getYear();
			} else {
				cString = getMonthName(this.getMonth()) + " " + this.getDate() + ", " + this.getYear();
			}

			// cString += " " + this.getDay();

			return cString;
		};


		if (this.constructor.arguments.length == 1) {
			// this should be days since zero date
			this.calculateDate(this.constructor.arguments[0]);

		} else {
			this.setMonth(month);
			this.setDate(date);
			this.setYear(year);
			this.setDay(day);
		}

	};

	function getMonthName (monthIndex) {
		return colignyMonths[monthIndex];
	};

	function getPreviousMonth (calendar) {
		var yearInCycle = calendar.getYearInCycle();
		var month, year;

		var previousMonth;

		month = calendar.getMonth() - 1;
		if (month < 0) {
			// going into new year now
			year = calendar.getYear() - 1;

			// adjust yearInCycle
			yearInCycle = getYearInCycle(year);

			// get the month index;
			month = colignyCycle[yearInCycle].length - 1;

		} else {
			year = calendar.getYear();
		}

		//find first month that has days
		while (month > -1 && (colignyCycle[yearInCycle][month] == 0 || colignyCycle[yearInCycle][month] == undefined)) {
			month -= 1;
		}

		if (month == -1) {
			previousMonth = getPreviousMonth(new ColignyCalendar(
				year,
				month
			));
		} else {
			previousMonth = new ColignyCalendar(
				year,
				month
			);
		}		

		return previousMonth; 
	};


	function goBack () {
		var previousMonth = getPreviousMonth(currentCalendar);
		displayCalendar(previousMonth);
	};

	function getNextMonth(calendar) {

		var yearInCycle = calendar.getYearInCycle();
		var month, year;

		month = calendar.getMonth() + 1;
		if (month >= colignyCycle[yearInCycle].length) {
			
			// going into new year now
			year = calendar.getYear() + 1;

			// adjust yearInCycle
			yearInCycle = getYearInCycle(year);

			// set to first month of year;
			month = 0;

		} else {
			// same so just get the current year
			year = calendar.getYear();
		}

		//find first month that has days
		while (colignyCycle[yearInCycle].length > month 
			&& (colignyCycle[yearInCycle][month] == 0 || colignyCycle[yearInCycle][month] == undefined)) {
			month += 1;
		}

		if (month >= colignyCycle[yearInCycle].length ) {
			nextMonth = getNextMonth(new ColignyCalendar(
				year,
				month
			));
		} else {
			nextMonth = new ColignyCalendar(
				year,
				month
			);
		}

		return nextMonth;

	}

	function goForward () {
		var nextMonth = getNextMonth(currentCalendar);
		displayCalendar(nextMonth);		
	};

    function getNextYear(cCalendar) {
        // go forward one year
        var year = cCalendar.getYear() + 1; 
        var m = cCalendar.getMonth();
        var yearInCycle = getYearInCycle(year);
        // if we currently in an intercalary month
        // then we will go to the month afterwards
        while (colignyCycle[yearInCycle][m] == undefined) {
            if (m == colignyCycle[yearInCycle].length){
                //we've reached the end of the year so go to the next year
                if (yearInCycle == colignyCycle.length - 1) {
                    // we've reached the end of the cycle so, start new cycle
                    yearInCycle = 0;
                }
                year++;
                m = 0;
            } else {
                m++; 
            }
        }

        var yearNext = new ColignyCalendar(year, m);
        return yearNext;
    }

    function goFowardOneYear (cCalendar) {
        var yearNext = getNextYear(currentCalendar);
        displayCalendar(yearNext);
    }

    function getPreviousYear (cCalendar) {
        // go back one year
        var year = cCalendar.getYear() - 1; 
        var m = cCalendar.getMonth();
        var yearInCycle = getYearInCycle(year);
        // if we currently in an intercalary month
        // then we will go to the month afterwards
        while (colignyCycle[yearInCycle][m] == undefined) {
            if (m == colignyCycle[yearInCycle].length){
                //we've reached the end of the year so go to the next year
                if (yearInCycle == colignyCycle.length - 1) {
                    // we've reached the end of the cycle so, start new cycle
                    yearInCycle = 0;
                }
                year++;
                m = 0;
            } else {
                m++; 
            }
        }

        var yearPrevious = new ColignyCalendar(year, m);
        return yearPrevious;
    }

    function goBackOneYear () {
        var yearPrevious = getPreviousYear(currentCalendar);
        displayCalendar(yearPrevious);
    }

	function getGridRow () {
		var row = document.createElement('div');
		row.className = "coligny-cal-row coligny-row";

		return row; 
	};

	function getCalendarCell () {
		var cell = document.createElement('div');
		cell.className = 'coligny-cal-cell';

		cell.innerHTML = 
			"<div class='coligny-cdatenum'></div>" 
			+ "<div class='coligny-gdate'></div>"
			+ "<div class='coligny-cdate-content'></div>";

		return cell;
	};

	function generateDateCell (gDate, cDate) {
		var cell = getCalendarCell();

		cell.children[0].innerText = cDate;
		cell.children[1].innerText = gDate.toLocaleDateString([], {era:'short'});
		cell.children[2].innerHTML = "&nbsp;";
		
		return cell;
	};

	function getBlankCell () {
		var cell = getCalendarCell();
		
		cell.children[0].innerHTML = "&nbsp;";
		cell.children[1].innerHTML = "&nbsp;";
		cell.children[2].innerHTML = "&nbsp;";
		
		return cell;
	};

	function addBlankDays(cRow, count) {
		for (var i = 0; i < count; i++) {
			
			var cell = getBlankCell();
			cRow.appendChild(cell);
		};
	};

    function generateCalendarHeader(cCalendar) {
        // set the Month Year label
        var monthLabel = document.createElement('div');
        monthLabel.className = "coligny-month-label coligny-row";
        
        // add the back one year button
        var previousYear = document.createElement('a');
        previousYear.className = "coligny-previousYear";
        previousYear.innerText = "<<";
        previousYear.onclick = goBackOneYear;
        previousYear.href = "#";
        monthLabel.appendChild(previousYear);

        // add the back button
        var back = document.createElement('a');
        back.innerText = "<";
        back.onclick = goBack;
        back.href = "#";
        monthLabel.appendChild(back);

        // add the month and year label
        var labelText = cCalendar.getMonthName() + " " + cCalendar.getYear() + " BG";
        var label = document.createElement('div');
        label.innerText = labelText;
        label.className = "coligny-cal-label"
        monthLabel.appendChild(label);

        // add the forward button
        var forward = document.createElement('a');
        forward.innerText = ">";
        forward.onclick = goForward;
        forward.href = "#";
        monthLabel.appendChild(forward);


        // add the forward one year button
        var previousYear = document.createElement('a');
        previousYear.className = "coligny-nextYear";
        previousYear.innerText = ">>";
        previousYear.onclick = goFowardOneYear;
        previousYear.href = "#";
        monthLabel.appendChild(previousYear);

        

        return monthLabel;

    }

	function displayCalendar (cCalendar) {

		var oldCalendar = document.getElementsByClassName("coligny-calendar");

		if (oldCalendar.length > 0) {
			oldCalendar[0].remove();
		}

		var calendarContainer = document.createElement('div');
		calendarContainer.className = "coligny-calendar";

        var monthLabel = generateCalendarHeader(cCalendar);

		calendarContainer.appendChild(monthLabel);

		// add a calendar grid container
		var calendarGrid = document.createElement('div');
		calendarGrid.className = "coligny-cal-grid";

		// set the days header
		var daysNamesHeader = getGridRow();
		daysNamesHeader.className += " coligny-cal-days-header";
		

		for (var d = 0; d < 7; d++) {
			var cell = getCalendarCell();
			cell.innerText = daysOfWeek.short[d];
			daysNamesHeader.appendChild(cell);
		};
		calendarGrid.appendChild(daysNamesHeader);

		// create the dates rows
		var tempCount = 0;
		var gridRow;
		var startDay = cCalendar.getStartDay();
		var gStartDate = cCalendar.getGStartDate();

		// do the first week if it doesn't start on a Sunday
		if (startDay > 0) {
			gridRow = getGridRow();
			addBlankDays(gridRow, startDay);

			// finish the first week
			for (var d = 1; d < (8 - startDay); d++) {
				var cell = generateDateCell(gStartDate,d);
				gridRow.appendChild(cell);


				// update this after all work is done to prepare for next calendar day
				gStartDate.setDate(gStartDate.getDate() + 1);
			}

			calendarGrid.appendChild(gridRow);
			tempCount = 7 - startDay;
		} 

		var currentMonth = cCalendar.getMonth() == cToday.getMonth();
		var currentYear = cCalendar.getYear() == cToday.getYear();
		var daysInMonth = cCalendar.getDaysInMonth();

		while (tempCount < daysInMonth) {
			var gridRow = getGridRow();

			for (var d = 0; d < 7; d++) {
				tempCount +=1;
				var cell;
				if (tempCount <= daysInMonth) {

					cell = generateDateCell(gStartDate, tempCount);

					// determine today from Coligny date
					// if (currentMonth && currentYear && tempCount == cToday.getDate()) {
					// 	cell.className += " coligny-today";
					// }

					// determine today from Gregorian date
					if (gToday.toLocaleDateString() == gStartDate.toLocaleDateString()) {
						cell.className += " coligny-today-cell";
					}

					// update this after all work is done to prepare for next calendar day
					gStartDate.setDate(gStartDate.getDate() + 1);

				} else {
					// cell = getCalendarCell();
					// cell.innerHTML = "&nbsp;";

					cell = getBlankCell();

				}
				gridRow.appendChild(cell);
			};

			calendarGrid.appendChild(gridRow);
		};

		// add the grid
		calendarContainer.appendChild(calendarGrid);

		// add the whole calendar
		document.body.appendChild(calendarContainer);

		// update current calendar
		currentCalendar = cCalendar;		
	};	

	function equalizeTime (gDate) {

		if (Object.prototype.toString.call(gToday) != '[object Date]') {
			gToday = new Date();
		}

		// set times to match now's time so that 
		// they will add and subtract times evenly to leave just days
		gDate.setHours(gToday.getHours());
		gDate.setMinutes(gToday.getMinutes());
		gDate.setSeconds(gToday.getSeconds());
		gDate.setMilliseconds(gToday.getMilliseconds());
	}

	function getYearInCycle (year) {
        // we want to get the index of the year
        // so the first year has an index of 0
		// var remainder = year % (colignyCycle.length);
        var yearInCycle = (year - baseColignyDate.getYear()) % colignyCycle.length;

        if (yearInCycle < 0) {
            yearInCycle = colignyCycle.length + yearInCycle;
        }
        
		return yearInCycle;
	};

    function getCyclesCompleted(year) {
        var nCycles = Math.floor(year/yearsInCycle);
        return nCycles;
    };

    function calculateDaysOfWeek() {
        // format should be a string of either "short" or "long"
        var forDays = new Date(gToday.getFullYear(), gToday.getMonth(), gToday.getDate());

        // set date to a Sunday date for each looping
        forDays.setDate(forDays.getDate() - forDays.getDay());
        

        for (var i = 0; i < 7; i++) {
            daysOfWeek.short[i] = new Intl.DateTimeFormat('en-US', {weekday: "short"}).format(forDays);
            daysOfWeek.long[i] = new Intl.DateTimeFormat('en-US', {weekday: "long"}).format(forDays);

            // advance to next day
            forDays.setDate(forDays.getDate() + 1);
        }
    };

    function calculateDaysSinceColBase (year, month, day) {

        // get the difference in years to start
        var yDiff = year - baseColignyDate.getYear(); 
        var beforeOrAfterFactor;
        if (yDiff == 0) {
            // we are in the same year of the baseColignyDate
            // so we need to determine before or after
            if (month > baseColignyDate.getMonth()) {
                beforeOrAfterFactor = 1;
            } else if (month < baseColignyDate.getMonth()) {
                beforeOrAfterFactor = -1;
            } else if (day > baseColignyDate.getDate()) {
                beforeOrAfterFactor = 1
            } else if (day < baseColignyDate.getDate()) {
                beforeOrAfterFactor = -1
            } else {
                beforeOrAfterFactor = 0
            }
        } else {
            beforeOrAfterFactor = yDiff / Math.abs(yDiff);
            beforeOrAfterFactor = parseInt(beforeOrAfterFactor);
        }
        
        if (beforeOrAfterFactor == 0) {
            // we are on the baseColignyDate so no need to process any further
            var daysSinceColBase = 0;
        } else {
            // calculate days for total cycles completed since Zero
            // get days in completed cycles
            // if year is same year as years in cycle, 
            // this indicates it is the first year of the next cycle
            // so we need to add one to the year to get this result
            var cycles = getCyclesCompleted(yDiff);
            daysSinceColBase = cycles*daysInCycle;

            // calculate days in current incomplete cycle except current year
            // year is more like an index and not a count
            // we need to use the absolute value for dates that occur before the colBaseDate
            yDiff = Math.abs(yDiff) % yearsInCycle;

            // we can now calculate days from years from start of incomplete cycle
            if (beforeOrAfterFactor == 1) {
                // count forward
                for (var y = 0; y < yDiff; y++) { // just go to less than yDiff since last year is incompplete
                    daysSinceColBase += daysInEachYear[y];
                }

                // calculate days in months of current year up to but excluding current month
                for (var m = 0; m < month; m++) {
                    var monthDays = colignyCycle[yDiff][m];
                    daysSinceColBase += (monthDays || 0);
                }
                // add days for this month one less since you are calculating difference from another date
                // if I was calculating the 2nd day from the beginning, then while the date is 2, 
                // it's only one day from the beginning
                daysSinceColBase += (day - baseColignyDate.getDate());

            } else {
                //count backwayds
                for (var y = colignyCycle.length -1; y > yDiff; y--) { // just go to less than yDiff since last year is incompplete
                    daysSinceColBase += daysInEachYear[y];
                }

                var currentYearInCycle = colignyCycle.length - yDiff;
                for (var m = colignyCycle[currentYearInCycle].length; m > month; m--) { // just go to less than yDiff since last year is incompplete
                    
                    var monthDays = colignyCycle[currentYearInCycle][m];
                    daysSinceColBase += (monthDays || 0);
                }

                // since we are counting backwards 
                // calculate days since the end of the month provided
                daysSinceColBase += colignyCycle[currentYearInCycle][month] - day;
            }
        }

        return daysSinceColBase;
    };

	function calculateDaysInCycle(cycleArray) {
		var totalDays = 0;
		for (var r = 0; r < colignyCycle.length; r++) {
			var daysInYear = 0;
			for ( var c = 0; c < colignyCycle[r].length; c++) {
				var thisYearDays = colignyCycle[r][c] ;
				daysInYear += (thisYearDays || 0);
			};
			totalDays += daysInYear;
			daysInEachYear[r] = daysInYear;
		};

		return totalDays;
	};

	function calculateCurrentColignyDate () {
		if (Object.prototype.toString.call(gToday) != '[object Date]') {
			gToday = new Date();
		}

		equalizeTime(baseGregorianDate);

		var diffGDatesMs = gToday.getTime() - baseGregorianDate.getTime();

		var diffGDatesDays = diffGDatesMs / milliFactor;

		cToday = new ColignyDate(diffGDatesDays);
	};

	function generateModal () {
		var modal = document.createElement("div");
		modal.className = 'coligny-modal';

		return modal;
	};

	function addModalToDoc (modal) {
		var modalsOnPage = document.getElementsByClassName("coligny-modal")
		if (modalsOnPage.length > 0) {
			modalsOnPage[0].remove();
		}
		
		document.body.appendChild(modal);
	}

	coligny.onLoad = function () {
        calculateDaysOfWeek();
		calculateCurrentColignyDate();
		var calendar = new ColignyCalendar(
			cToday.getYear(),
			cToday.getMonth()
		);
		displayCalendar(calendar);
	};

	coligny.showToday = function () {

		var modal = generateModal();

		var dayOfWeek = document.createElement("div");
		dayOfWeek.innerText = daysOfWeek.long[gToday.getDay()]
		modal.appendChild(dayOfWeek);

		var cDate = document.createElement("div");
		cDate.innerText = cToday.toString();
		modal.appendChild(cDate);

		var time = document.createElement("div");
		time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		modal.appendChild(time);

		var gotoButton = document.createElement("button");
		gotoButton.innerText = "Go To Today";
		gotoButton.onclick = function () {
			var calendar = new ColignyCalendar(
				cToday.getYear(),
				cToday.getMonth()
			);
			displayCalendar(calendar);

			document.getElementsByClassName("coligny-modal")[0].remove();
		}
		modal.appendChild(gotoButton);

		var closeButton = document.createElement("button");
		closeButton.innerText = "Close";
		closeButton.onclick = function () {
			document.getElementsByClassName("coligny-modal")[0].remove();
		}
		modal.appendChild(closeButton);	

		addModalToDoc(modal);
	};

	coligny.showGoTo = function () {

		var formName = "goToForm";
		var monthInputName = "goToMonth";
		var yearInputName = "goToYear";

		var modal = generateModal();

		var form = document.createElement("form");
		form.name = formName;
		form.onsubmit = function () {

			var month = document.forms[formName][monthInputName].value;
			var year = document.forms[formName][yearInputName].value;
			var calendar = new ColignyCalendar(
				parseInt(year),
				parseInt(month)
			);
			displayCalendar(calendar);

			document.getElementsByClassName("coligny-modal")[0].remove();
		}

        var inputContainer = document.createElement("div");

		var labelMonth = document.createElement("label");
		labelMonth.innerText = "Month";
		inputContainer.appendChild(labelMonth);

		var inputMonth = document.createElement("input");
		inputMonth.type = "number";
		inputMonth.name = monthInputName;
		inputMonth.min = 0;
		inputMonth.max = colignyMonths.length - 1;
		inputMonth.value = currentCalendar.getMonth();
		inputContainer.appendChild(inputMonth);

		var labelYear = document.createElement("label");
		labelYear.innerText = "Year";
		inputContainer.appendChild(labelYear);

		var inputYear = document.createElement("input");
		inputYear.type = "number";
		inputYear.name = yearInputName;
		inputYear.value = currentCalendar.getYear();
		inputContainer.appendChild(inputYear);

        form.appendChild(inputContainer);

        var buttonRow = document.createElement("div");

		var gotoButton = document.createElement("button");
		gotoButton.type = "submit";
		gotoButton.innerText = "Go To";
		buttonRow.appendChild(gotoButton);

        var closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.onclick = function () {
             document.getElementsByClassName("coligny-modal")[0].remove();
        }
        buttonRow.appendChild(closeButton);

        form.appendChild(buttonRow);

		modal.appendChild(form);

		addModalToDoc(modal);
	};

	return coligny;
}());