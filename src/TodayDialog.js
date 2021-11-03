import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

import {Today, DaysOfWeek} from './DateHelper.js';

export default function TodayDialog(props) {
  const { onGoTo, onClose, open } = props;

  const onCloseClick = () => {
    onClose(Today);
  };

  const onGoToClick = () => {
    alert("Going to today: " + Today.toLocaleString());
    onGoTo(Today);
  };

  return (
    <Dialog onClose={onCloseClick} open={open}>
      <DialogTitle>Today is</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          {DaysOfWeek.long[Today.getDay()]}
        </DialogContentText>
        <DialogContentText variant="h5">
          {Today.toLocaleDateString()}
        </DialogContentText>
        <DialogContentText variant="body1">
          {Today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseClick}>
          Close
        </Button>
        <Button variant="outlined" onClick={onGoToClick}>
          Go To Today
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