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

  const iconDisplaySettings = { display: { md: 'inherit', lg: 'none', xl: 'none'  }, mr: 2 };
  const textDisplaySettings = { paddingRight: 2, display: { xs: 'none', sm: 'none', md:'none', lg:'inherit' } };
  const toolbarSettings = { paddingRight: { xs: 0, sm: 0, md: 0, lg:'inherit' } };

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
            Today
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 , textAlign: 'center'}}>
            Coligny Calendar
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
            sx={textDisplaySettings}>Go To</Button>
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