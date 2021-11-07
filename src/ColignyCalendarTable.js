import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import {gToday, DaysOfWeek} from './DateHelper.js';
import ColignyCalendarHeader from './ColignyCalendarHeader.js';
import ColignyCalendar from './ColignyCalendar.js';
import {CalendarContext} from './ColignyApp.js';

export function getCurrentCalendar() {
  return currentCalendar;
};

export default function ColignyCalendarTable() {

  const [calContext, setCalContext] = React.useContext(CalendarContext);

  const cellStyles = { 
    '&:last-child, &:last-child': { borderRight: 0 }, 
    borderRight: '1px solid', 
    borderColor: 'grey.700', 
    width: '(1/7)%',
    // wordBreak: 'break-word',
    padding: {xs: .5, sm: 1}
  };

  const dateCellStyles = Object.assign({}, cellStyles);
  dateCellStyles.verticalAlign = 'top;'
  dateCellStyles['&.coligny-today-cell'] = { bgcolor:  'info.main'};

  const rowStyles = { '&:last-child td, &:last-child th': { borderBottom: 0 } };
  const typoStyles = {fontSize: {xs: ".6rem", sm: ".9rem"}};
  const dateTypoStyles = {fontWeight: 'bold'};


  var calendar = new ColignyCalendar(calContext.year, calContext.month);
  
  return (
    <Box className="coligny-calendar-table">
      <ColignyCalendarHeader
        label={calendar.toString()}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {DaysOfWeek.short.map((name) => (
                <TableCell align="center" key={name}
                  sx={cellStyles}>
                  <Typography sx={{fontWeight: 'bold}'}}>{name}</Typography>
                </TableCell>             
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {calendar.getRows().map((row, rIndex) => (
              <TableRow
                sx={rowStyles}
                key={"row"+rIndex}>
                {row.map((cell, cIndex) => (
                  <TableCell align="left" key={"cell"+cIndex}
                    sx={dateCellStyles}
                    className={cell.isToday ? "coligny-today-cell" : ""}>
                    <Typography sx={dateTypoStyles} variant='body1'>{cell.day}</Typography>
                    <Typography sx={typoStyles} variant='body2'>{cell.dateStr}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};