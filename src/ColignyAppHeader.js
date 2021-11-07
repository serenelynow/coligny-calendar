// this is the default that should work
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import TodayDialog from './TodayDialog.js';
import GoToDialog from './GoToDialog.js';
import {gToday} from './DateHelper.js';
import {l10n} from './l10n.js';

export default function ColignyAppHeader() {
  const [todayOpen, setTodayOpen] = React.useState(false);
  const [goToOpen, setGoToOpen] = React.useState(false);

  const handleTodayOpen = () => {
    setTodayOpen(true);
  };

  const handleTodayGoToClick = (value) => {
    handleTodayClose();
  };

  const handleTodayClose = () => {
    setTodayOpen(false);
  };

  const handleGoToOpen = () => {
    setGoToOpen(true);
  };

  const handleGoToClick = (value) => {
    handleGoToClose();
  };

  const handleGoToClose = () => {
    setGoToOpen(false);
  };

  const iconDisplaySettings = { display: { sm: 'block', md: 'none', lg: 'none', xl: 'none'  }, mr: 2 };
  const textDisplaySettings = { display: { xs: 'none', sm: 'none', md: 'block' } };
  const toolbarSettings = { paddingRight: { xs: 0, sm: 0, md: 3 } };

  return (
    <Box sx={{ flexGrow: 1 }} className="coligny-header">
      <AppBar position="static">
        <Toolbar sx={toolbarSettings}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleTodayOpen}
            sx={iconDisplaySettings}
          >
            <MenuIcon />
          </IconButton>
          <Button variant='text' onClick={handleTodayOpen}
            sx={textDisplaySettings}>
            {l10n.today}
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 , textAlign: 'center'}}>
            {l10n.colignyCalendar}
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="more"
            onClick={handleGoToOpen}
            sx={iconDisplaySettings}
          >
            <MoreVertIcon />
          </IconButton>
          <Button color="inherit" onClick={handleGoToOpen}
            sx={textDisplaySettings}>{l10n.goto}</Button>
        </Toolbar>
      </AppBar>
      <TodayDialog
        open={todayOpen}
        onGoTo={handleTodayGoToClick}
        onClose={handleTodayClose}
      />
      <GoToDialog
        open={goToOpen}
        onGoTo={handleGoToClick}
        onClose={handleGoToClose}
      />
    </Box>
  );
};