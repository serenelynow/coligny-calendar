// this is the default that should work
import * as React from 'react';
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
import {Today} from './DateHelper.js';

export default function ColignyAppHeader() {

  const [todayOpen, todaySetOpen] = React.useState(false);
  const [goToOpen, goToSetOpen] = React.useState(false);

  const handleTodayOpen = () => {
    var now = new Date().getTime();
    Today.setTime(now);
    todaySetOpen(true);
  };

  const handleTodayGoToClick = (value) => {
    handleTodayClose();
  };

  const handleTodayClose = () => {
    todaySetOpen(false);
  };

  const handleGoToOpen = () => {
    var now = new Date().getTime();
    Today.setTime(now);
    goToSetOpen(true);
  };

  const handleGoToClick = (value) => {
    handleGoToClose();
  };

  const handleGoToClose = () => {
    goToSetOpen(false);
  };

  const iconDisplaySettings = { display: { md: 'inherit', lg: 'none', xl: 'none'  } };
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
            sx={{ mr: 2 }}
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
            aria-label="menu"
            sx={{ mr: 2 }}
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
        date={Today}
      />
    </Box>
  );
};