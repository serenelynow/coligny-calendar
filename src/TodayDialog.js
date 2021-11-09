import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import {cToday, DaysOfWeek} from './DateHelper.js';
import {CalendarContext} from './ColignyApp.js';
import {l10n} from './l10n.js';

export default function TodayDialog(props) {
  const { onGoTo, onClose, open, anchorEl } = props;

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
  now.setHours(now.getHours() + getStartOfDayHour());

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
        <Typography variant="h6" sx={{marginBottom: 2}}>{l10n.todayis}</Typography>
        <Box>
          <Typography variant="body1">
           {DaysOfWeek.long[cToday.getDay()]}
          </Typography>
          <Typography variant="h6">
           {cToday.toString()}
          </Typography>
          <Typography variant="body1">
           {now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </Box>
        <Box sx={{marginTop: 3, textAlign:"right"}}>
         {/*<Button variant="outlined" onClick={onCloseClick}>
           {l10n.close}
         </Button>*/}
         <Button variant="outlined" onClick={onGoToClick}>
           {l10n.gototoday}
         </Button>
        </Box>
      </Box>
    </Popover>
  );
}

TodayDialog.propTypes = {
  onGoTo: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};