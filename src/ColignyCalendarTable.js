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
import Skeleton from '@mui/material/Skeleton';

import {gToday, DaysOfWeek} from './DateHelper.js';
import ColignyCalendarHeader from './ColignyCalendarHeader.js';
import ColignyMonth from './ColignyMonth.js';
import {CalendarContext} from './CalendarContext.js';

export function getCurrentCalendar() {
  return currentCalendar;
};

class ColignyCalendarTable extends React.Component {

  #cellStyles = { 
    '&:last-child, &:last-child': { borderRight: 0 }, 
    borderRight: '1px solid', 
    borderColor: 'grey.700', 
    width: ((1/7) + "%"),
    // wordBreak: 'break-word',
    padding: {xs: .5, sm: 1}
  };

  #dateCellStyles = Object.assign(
    {
      verticalAlign: 'top', 
      '&.coligny-today-cell': { bgcolor:  'bng.today.background', color: 'bng.today.font'}
    }, this.#cellStyles);

  #rowStyles = { '&:last-child td, &:last-child th': { borderBottom: 0 } };
  #typoStyles = {fontSize: {xs: ".6rem", sm: ".8rem", md: ".9rem"}};
  #dateTypoStyles = {fontWeight: 'bold', display: 'inline'};

  finishedLoading = () =>  {
    const [calContext, setCalContext] = this.context;
    setCalContext(
      calContext => (
        { ...calContext, isLoaded: true }
      )
    );
  }
  
  componentDidMount() {
    const [calContext, setCalContext] = this.context;
    setCalContext(
      calContext => (
        { ...calContext, isLoaded: false }
      )
    );
    calContext.calendar.update(calContext.year, calContext.month, false, this.finishedLoading);
  }


  render () {
    const [calContext, setCalContext] = this.context;

    if (calContext.isLoaded == false) {
      return (
        <Box>
          <Skeleton variant="rectangular" width={'100%'} height={118} />
          <Skeleton variant="rectangular" width={'100%'} height={400} />
        </Box>
      );
    } else {

      return (
        <Box className="coligny-calendar-table">
          <ColignyCalendarHeader
            label={calContext.calendar.toString()}/>
          <TableContainer component={Paper}>
            <Table>

              <TableHead>
                <TableRow>
                  {DaysOfWeek.short.map((name) => (
                    <TableCell align="center" key={name}
                      sx={this.#cellStyles}>
                      <Typography sx={{fontWeight: 'bold}'}}>{name}</Typography>
                    </TableCell>             
                  ))}
                </TableRow>
              </TableHead>
        
              <TableBody>
                {calContext.calendar.getRows().map((row, rIndex) => (
                  <TableRow
                    sx={this.#rowStyles}
                    key={"row"+rIndex}>
                    {row.map((cell, cIndex) => (
                      <TableCell align="left" key={"cell"+cIndex}
                        sx={this.#dateCellStyles}
                        className={cell.isToday ? "coligny-today-cell" : ""}>
                        <Box>
                          <Typography sx={this.#dateTypoStyles} variant='body1'>{cell.day}</Typography>
                          <Box dangerouslySetInnerHTML={{__html: cell.moonPhase}} sx={{display: 'inline', float: 'right', '&>svg circle': {stroke: 'black', strokeWidth: "1"}}}></Box>
                        </Box>
                        <Typography sx={this.#typoStyles} variant='body2'>{cell.dateStr}</Typography>
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
  };
};

ColignyCalendarTable.contextType = CalendarContext;

export default ColignyCalendarTable;