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


import {Today, DaysOfWeek} from './DateHelper.js';
import ColignyCalendarHeader from './ColignyCalendarHeader.js';

function createData(day, dateStr) {
  return { day, dateStr };
}

function getRows () {
  var start = new Date();
  start.setDate(1);
  var d = start.getDay();

  var rows = [];
  for (var r = 0; r < 6; r++) {
    rows[r] = [];
    for (var c = 0; c < 7; c++) {
      var date = (r*7)+c+1;
      start.setDate(date);
      rows[r][c] = createData(date, start.toLocaleDateString([], {year: 'numeric', month:'short', day:'2-digit', era:'short'}));
    }
  }

  return rows;
}

const rows = getRows();

export default function ColignyCalendarTable(props) {

  const { date } = props;

  const cellStyles = { 
    '&:last-child, &:last-child': { borderRight: 0 }, 
    borderRight: '1px solid', 
    borderColor: 'grey.700', 
    width: '13%',
    // wordBreak: 'break-word',
    padding: {xs: .5, sm: 1}
  };

  const dateCellStyles = Object.assign({}, cellStyles);
  dateCellStyles.verticalAlign = 'top;'

  const rowStyles = { '&:last-child td, &:last-child th': { borderBottom: 0 } };
  const typoStyles = {fontSize: {xs: ".6rem", sm: ".9rem", md: 1}};
  const dateTypoStyles = {fontWeight: 'bold'};

  return (
    <Box className="coligny-calendar-table">
      <ColignyCalendarHeader
        date={Today}/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/*<TableRow sx={{backgroundColor: 'grey.600'}}>*/}
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
            {rows.map((row, rIndex) => (
              <TableRow
                sx={rowStyles}
                key={"row"+rIndex}>
                {rows[rIndex].map((cell, cIndex) => (
                  <TableCell align="left" key={"cell"+cIndex}
                    sx={dateCellStyles}>
                    <Typography sx={dateTypoStyles} variant='body2'>{cell.day}</Typography>
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
}

ColignyCalendarTable.propTypes = {
  date: PropTypes.any.isRequired
};