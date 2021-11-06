import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import {CalendarContext} from './ColignyApp.js';
import {cToday} from './DateHelper.js';

export default function GoToDialog(props) {
  const { onGoTo, onClose, open } = props;


  const [calContext, setCalContext] = React.useContext(CalendarContext);

  var year = calContext.year;
  var month = calContext.month;

  const onCloseClick = () => {
    onClose();
  };

  const onGoToClick = () => {
    setCalContext(
      calContext => (
        { ...calContext, year: parseInt(year), month: parseInt(month) }
      )
    );

    onGoTo(calContext);
  };

  const handleYearChange = (event) => {
    year = event.target.value;
  };

  const handleMonthChange = (event) => {
    month = event.target.value;
  };

  return (
    <Dialog onClose={onCloseClick} open={open} className="coligny-goto-dialog">
       <DialogTitle>Go To</DialogTitle> 

       <DialogContent>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
          >
            <TextField
              required
              autoFocus
              id="outlined-number"
              label="Month"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={month}
              onChange={handleMonthChange}
              onFocus={event => {
                event.target.select()}}
              />
            <TextField
              required
              id="outlined-number"
              label="Year"
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
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseClick}>
          Close
        </Button>
        <Button variant="outlined" type='submit'
          onClick={onGoToClick}>
          Go To
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GoToDialog.propTypes = {
  onGoTo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};