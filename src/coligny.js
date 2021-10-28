var coligny = (function () {
    // var module = {}; 
    // var privateVariable = 4;
	
    // function privateMethod() {
    //     // ..
    // }
	
    // module.moduleProperty = 1;
    // module.moduleMethod = function () {
    //     // ...
    // };
    // return module;

    var coligny = {};

	const milliFactor = 24 * 60 * 60 * 1000;
	const colignyMonths = [ 
		"intcal1", "Samonios", "Dumanios", "Riuros", "Anagantios", "Orgronios", "Cutios", "intcal2", "Giamonios", "Simiuisonna", "Equos", "Elembi", "Aedrinni", "Cantlos"
	]; // 14 months

	const daysOfWeek = [
		"Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"
	];

	// 20 year cycle
	const colignyCycle = [
	  [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,28,29,30,29  ],
	  [null,30,29,30,29,30,30,30,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,28,29,30,29  ],
	  [null,30,29,30,29,30,30,30,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,28,29,30,29  ],
	  [null,30,29,30,29,30,30,30,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [29,30,29,30,29,30,30,null,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,28,29,30,29  ],
	  [null,30,29,30,29,30,30,30,29,30,30,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,29,29,30,29  ],
	  [null,30,29,30,29,30,30,null,29,30,30,29,30,29  ]
	];

	const yearsInCycle = colignyCycle.length;
	const daysInEachYear = [];
	const daysInCycle = calculateDaysInCycle(colignyCycle);
	// var zeroGregorianDate = new Date(2021, 9, 26); // oct 26, 2021
	// var zeroColignyDate = new ColignyDate(5021, 6, 14, 2); // same as oct 26, 2021
	var zeroGregorianDate = {};
	const zeroColignyDate = new ColignyDate (0, 0, 1);
	var gToday = {};
	var cToday = {};
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

			// cString += " (year in cycle: " + yearInCycle + ")";

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
			var daysSinceZero = calculateDaysSinceZero(year, month, 1);

			gStartDate = new Date(
				zeroGregorianDate.getFullYear(),
				zeroGregorianDate.getMonth(),
				zeroGregorianDate.getDate());
			gStartDate.setDate(gStartDate.getDate() + daysSinceZero);



			equalizeTime(gStartDate);


			startDay = gStartDate.getDay();
		};

		this.getDaysInMonth = function () {
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

		this.calculateDate = function (daysFromZero) {
			// calcate date from days from zero.
			daysFromZero = Math.floor(daysFromZero);
			

			//calulate milliseconds to get Gregorian date and its day of week
			var time = zeroGregorianDate.getTime() + daysFromZero;
			gDate = new Date(time);

			var dayOfWeek = gDate.getDay();
			this.setDay(dayOfWeek);

			var cycles = Math.floor(daysFromZero/daysInCycle);

			var daysSoFar = cycles*daysInCycle;

			// cycles * years in a cycle
			var year = cycles * colignyCycle.length;

			// get remainder of mod to know how many days we are into current cycle
			var daysInCurrentCurrentCycle = daysFromZero % daysInCycle;
			var y, m, d;

			for (y = 0; y < daysInEachYear.length; y++) {

				if ((daysSoFar + daysInEachYear[y]) < daysFromZero) {
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
				if ((daysSoFar + colignyCycle[y][m]) < daysFromZero) {
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

			var date = daysFromZero - daysSoFar;
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
		cell.children[1].innerText = gDate.toLocaleDateString();
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

	function displayCalendar (cCalendar) {

		var oldCalendar = document.getElementsByClassName("coligny-calendar");

		if (oldCalendar.length > 0) {
			oldCalendar[0].remove();
		}

		var calendarContainer = document.createElement('div');
		calendarContainer.className = "coligny-calendar";
		
		// set the Month Year label
		var monthLabel = document.createElement('div');
		monthLabel.className = "coligny-month-label coligny-row";
		
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

		calendarContainer.appendChild(monthLabel);

		// add a calendar grid container
		var calendarGrid = document.createElement('div');
		calendarGrid.className = "coligny-cal-grid";

		// set the days header
		var daysNamesHeader = getGridRow();
		daysNamesHeader.className += " coligny-cal-days-header";
		

		for (var d = 0; d < 7; d++) {
			var cell = getCalendarCell();
			cell.innerText = daysOfWeek[d];
			daysNamesHeader.appendChild(cell);
		};
		calendarGrid.appendChild(daysNamesHeader);

		// create the dates rows
		var tempCount = 0;
		var gridRow;
		var startDay = cCalendar.getStartDay();
		var gStartDate = cCalendar.getGStartDate();
		// var originalDate = gStartDate.getDate();

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
		yearInCycle = year % (colignyCycle.length);

		return yearInCycle;
	};

	function calculateDaysSinceZero (year, month, day) {

		// calculate days for total cycles completed since Zero
		// get days in completed cycles
		// if year is same year as years in cycle, 
		// this indicates it is the first year of the next cycle
		// so we need to add one to the year to get this result
		var nCycles = Math.floor((year+1)/yearsInCycle);
		var totalDays = nCycles*daysInCycle;

		// calculate days in current incomplete cycle except current year
		// year is more like an index and not a count
		var remainderYears = year % yearsInCycle;
		var y;
		for (y = 0; y < remainderYears; y++) {
			totalDays += daysInEachYear[y];
		}

		// calculate days in months of current year upto but excluding current month
		// for (var m = 0; m < month - 1; m++) {
		for (var m = 0; m < month; m++) {
			var monthDays = colignyCycle[y][m];
			totalDays += (monthDays || 0);
		}

		// add days for this month one less since you are calculating difference from another date
		// if I was calculating the 2nd day from the beginning, then while the date is 2, 
		// it's only one day from the beginning
		totalDays += (day - 1);

		return totalDays;
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

		equalizeTime(zeroGregorianDate);

		var diffGDatesMs = gToday.getTime() - zeroGregorianDate.getTime();

		var diffGDatesDays = diffGDatesMs / milliFactor;

		cToday = new ColignyDate(diffGDatesDays);
	};

	function calculateZeroColignyDate () {

		// according to coligny-app.com zero coligny (Samonios 1, 0 BG) is Monday May 26, -3001
		// I'm getting Fri Mar 2, -3013 but spot checking on current dates and all looks good

		var baseGDate = new Date(2021, 9, 26); // oct 26, 2021 tues
		var baseCDate = new ColignyDate(5021, 6, 14, 2); // same as oct 26, 2021 tues
		var toZeroDays = calculateDaysSinceZero(baseCDate.getYear(), baseCDate.getMonth(), baseCDate.getDate());

		equalizeTime(baseGDate);


		zeroGregorianDate = new Date (
			baseGDate.getFullYear(), baseGDate.getMonth(), baseGDate.getDate() - toZeroDays);
		
		equalizeTime(zeroGregorianDate);

		// zeroColignyDate is set when the variable is initialized
		// we just need to know what day of the week it is
		zeroColignyDate.setDay(zeroGregorianDate.getDay());
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
		calculateZeroColignyDate();
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
		dayOfWeek.innerText = daysOfWeek[gToday.getDay()]
		modal.appendChild(dayOfWeek);

		var cDate = document.createElement("div");
		cDate.innerText = cToday.toString();
		modal.appendChild(cDate);

		var time = document.createElement("div");
		time.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		modal.appendChild(time);

		var gotoButton = document.createElement("button");
		// gotoButton.type = "submit";
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
		// closeButton.type = "submit";
		closeButton.innerText = "Close";
		closeButton.onclick = function () {
			var calendar = new ColignyCalendar(
				cToday.getYear(),
				cToday.getMonth()
			);
			displayCalendar(calendar);

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

		var labelMonth = document.createElement("label");
		labelMonth.innerText = "Month";
		form.appendChild(labelMonth);

		var inputMonth = document.createElement("input");
		inputMonth.type = "number";
		inputMonth.name = monthInputName;
		inputMonth.min = 0;
		inputMonth.max = colignyMonths.length - 1;
		inputMonth.value = currentCalendar.getMonth();
		form.appendChild(inputMonth);

		var labelYear = document.createElement("label");
		labelYear.innerText = "Year";
		form.appendChild(labelYear);

		var inputYear = document.createElement("input");
		inputYear.type = "number";
		inputYear.name = yearInputName;
		inputYear.value = currentCalendar.getYear();
		form.appendChild(inputYear);

		var gotoButton = document.createElement("button");
		gotoButton.type = "submit";
		gotoButton.innerText = "Go To";
		form.appendChild(gotoButton);

		modal.appendChild(form);

		addModalToDoc(modal);
	};

	return coligny;
}());