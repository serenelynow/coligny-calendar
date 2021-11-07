import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import {cToday, DaysOfWeek} from './DateHelper.js';
import {CalendarContext} from './ColignyApp.js';
import {l10n} from './l10n.js';

export default function TodayDialog(props) {
  const { onGoTo, onClose, open } = props;

  const onCloseClick = () => {
    onClose(cToday);
  };

  const [calContext, setCalContext] = React.useContext(CalendarContext);

  const onGoToClick = () => {
    setCalContext(
      calContext => (
        { ...calContext, year: cToday.getYear(), month: cToday.getMonth() }
      )
    );

    onGoTo();
  };

  var now = new Date();

  return (
    <Dialog onClose={onCloseClick} open={open}>
      <DialogTitle>{l10n.todayis}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          {DaysOfWeek.long[cToday.getDay()]}
        </DialogContentText>
        <DialogContentText variant="h5">
          {cToday.toString()}
        </DialogContentText>
        <DialogContentText variant="body1">
          {now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseClick}>
          {l10n.close}
        </Button>
        <Button variant="outlined" onClick={onGoToClick}>
          {l10n.gototoday}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TodayDialog.propTypes = {
  onGoTo: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};