import * as React from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { OutlinedInput } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {CalendarContext} from './CalendarContext.js';
import {getMonthsInYear} from './ColignyCycle.js';
import {cToday} from './DateHelper.js';
import {l10n} from './l10n.js';

export default function GoToDialog(props) {

  const { onGoTo, onClose, open, anchorEl } = props;

  const [calContext, setCalContext] = React.useContext(CalendarContext);
  
  const [year, setYear] = React.useState(calContext.year);
  const [month, setMonth] = React.useState(calContext.month);
  const [months, setMonths] = React.useState(getMonthsInYear(calContext.year));

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

  const handleYearBlur = (event) => {
    var newYear = event.target.value;
    setYear(newYear);
    if (newYear != undefined & newYear != '') {
      var yearsMonths = getMonthsInYear(parseInt(newYear));
      setMonths(yearsMonths);

      if (yearsMonths[month] == undefined) {
        for (var i = parseInt(month) + 1; i < yearsMonths.length; i++) {
          if (yearsMonths[i] != undefined) {
            setMonth(yearsMonths[i].index);
            break;
          }
        }
      }
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
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
          <Box 
            sx={{
              '& .MuiInputBase-root': {color: 'text.primary'}, 
              '& .MuiOutlinedInput-notchedOutline': {borderColor: 'action.active'}, 
              '& legend': {maxWidth: '100%'}
            }}
          >
            <TextField
              error={year == undefined || year == ''}
              required
              autoFocus
              label={l10n.year}
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={year}
              onBlur={handleYearBlur}
              onFocus={event => {
                event.target.select()}}
              sx={{display: 'block', marginBottom: 3}}
            />
            <FormControl required={true} variant="outlined">
              <InputLabel htmlFor='gotoMonth'>
                {l10n.month}
              </InputLabel>
              <NativeSelect
                label={l10n.month + " *"}
                input={<OutlinedInput />}
                variant="outlined"
                defaultValue={month}
                onChange={handleMonthChange}
                inputProps={{
                  name: 'gotoMonth',
                  id: 'gotoMonth',
                }}
                sx={{color: '#fff'}}
              >
                {months.map(item =>
                  <option key={item.index} value={item.index}>{item.name}</option>
                )}
              </NativeSelect>
            </FormControl>
          </Box>
          <Box sx={{marginTop: 3, textAlign: 'right'}}>
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