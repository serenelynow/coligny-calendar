import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import {Today} from './DateHelper.js';

export default function GoToDialog(props) {
  const { onGoTo, onClose, open, date } = props;

  const onCloseClick = () => {
    onClose(Today);
  };

  const onGoToClick = () => {
    alert("Going to: " + Today.toLocaleString());
    onGoTo(Today);
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
              defaultValue={date.getMonth()}
            />
            <TextField
              required
              id="outlined-number"
              label="Year"
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={date.getFullYear()}
            />
          </Box>
       </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseClick}>
          Close
        </Button>
        <Button variant="outlined" onClick={onGoToClick}>
          Go To
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GoToDialog.propTypes = {
  onGoTo: PropTypes.func.isRequired,
  date: PropTypes.any.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
