// this is the default that should work
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TodayIcon from '@mui/icons-material/Today';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import TodayDialog from './TodayDialog.js';
import GoToDialog from './GoToDialog.js';
import {gToday} from './DateHelper.js';
import {l10n} from './l10n.js';

export default function ColignyAppHeader() {
  const [todayOpen, setTodayOpen] = React.useState(false);
  const [goToOpen, setGoToOpen] = React.useState(false);
  const [anchorElToday, setAnchorElToday] = React.useState(null);
  const [anchorElGoTo, setAnchorElGoTo] = React.useState(null);

  const handleTodayOpen = () => {
    setAnchorElToday(event.target);
    setTodayOpen(true);
  };

  const handleTodayGoToClick = (value) => {
    handleTodayClose();
  };

  const handleTodayClose = () => {
    setAnchorElToday(null);
    setTodayOpen(false);
  };

  const handleGoToOpen = () => {
    setAnchorElGoTo(event.target);
    setGoToOpen(true);
  };

  const handleGoToClick = (value) => {
    handleGoToClose();
  };

  const handleGoToClose = () => {
    setAnchorElGoTo(null);
    setGoToOpen(false);
  };

  const iconDisplaySettings = { display: { sm: 'block', md: 'none', lg: 'none', xl: 'none'  }, mr: 2 };
  const textDisplaySettings = { display: { xs: 'none', sm: 'none', md: 'block' } };
  const toolbarSettings = { paddingRight: { xs: 0, sm: 0, md: 3 } };

  const ariaLabelBy = "appTitle";

  return (
    <Box sx={{ flexGrow: 1, displayPrint: 'none' }} className="coligny-header">
      <AppBar position="static" aria-labelledby={ariaLabelBy}>
        <Toolbar sx={toolbarSettings}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="{l10n.today}"
            onClick={handleTodayOpen}
            sx={iconDisplaySettings}
          >
            <TodayIcon />
          </IconButton>
          <Button color="inherit" onClick={handleTodayOpen} sx={textDisplaySettings}>
            {l10n.today}
          </Button>
          <Typography id={ariaLabelBy} variant="h6" component="div" sx={{ flexGrow: 1 , textAlign: 'center'}}>
            {l10n.colignyCalendar}
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="{l10n.goto}"
            onClick={handleGoToOpen}
            sx={iconDisplaySettings}
          >
            <SwapHorizIcon />
          </IconButton>
          <Button color="inherit" onClick={handleGoToOpen} sx={textDisplaySettings}>
            {l10n.goto}
          </Button>
        </Toolbar>
      </AppBar>
      <TodayDialog
        open={todayOpen}
        onGoTo={handleTodayGoToClick}
        onClose={handleTodayClose}
        anchorEl={anchorElToday}
      />
      <GoToDialog
        open={goToOpen}
        onGoTo={handleGoToClick}
        onClose={handleGoToClose}
        anchorEl={anchorElGoTo}
      />
    </Box>
  );
};