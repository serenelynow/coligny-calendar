import * as React from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {CalendarContext} from './CalendarContext.js';
import {cToday} from './DateHelper.js';
import {l10n} from './l10n.js';

export default function GoToDialog(props) {
  const { onGoTo, onClose, open, anchorEl } = props;


  const [calContext, setCalContext] = React.useContext(CalendarContext);

  var year = calContext.year;
  var month = calContext.month;

  const finishedLoading = () => {
      var calendar = calContext.calendar;

      setCalContext(
        calContext => (
          { ...calContext, year: calendar.getYear(), month: calendar.getMonth(), isLoaded:true }
        )
      );
      onGoTo(calContext);
  }

  const onCloseClick = () => {
    onClose();
  };

  const onGoToClick = () => {
    setCalContext(
        calContext => (
          { ...calContext, isLoaded:false }
        )
    );

    event.preventDefault();

    calContext.calendar.update(parseInt(year), parseInt(month),  true, finishedLoading);
  };

  const handleYearChange = (event) => {
    year = event.target.value;
  };

  const handleMonthChange = (event) => {
    month = event.target.value;
  };

  return (
    <Popover 
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      onClose={onCloseClick} 
      open={open}
    >
      <Box sx={{padding: 2}}>
        <Typography variant="h6" sx={{marginBottom: 2}}>{l10n.goto}</Typography>
        <form
          component="form"
          sx={{'& > :not(style)': { m: 1 }}}
          onSubmit={onGoToClick}
        >
          <Box>
            <TextField
              required
              autoFocus
              id="outlined-number"
              label={l10n.month}
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={month}
              onChange={handleMonthChange}
              onFocus={event => {
                event.target.select()}}
              sx={{display: 'block', marginBottom: 3}}
            />
            <TextField
              required
              id="outlined-number"
              label={l10n.year}
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={year}
              onChange={handleYearChange}
              onFocus={event => {
                event.target.select()}}
            />
          </Box>
          <Box sx={{marginTop: 3, textAlign: 'right'}}>
            {/*<Button variant="outlined" onClick={onCloseClick}>
              {l10n.close}
            </Button>*/}
            <Button variant="outlined" type='submit'>
              {l10n.goto}
            </Button>
          </Box>
        </form>
      </Box>
    </Popover>
  );
}

GoToDialog.propTypes = {
  onGoTo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};