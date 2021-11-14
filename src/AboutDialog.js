import * as React from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import {l10n} from './l10n.js';

export default function AboutDialog(props) {
  const { open, anchorEl, onClose } = props;

  return (

    <Popover 
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      onClose={onClose} 
      sx={{width: '95%', maxWidth: '600px'}}
    >
      <Box sx={{padding: 2}}>
        <Typography variant="h6" sx={{marginBottom: 2}}>{l10n.about}</Typography>
        <Box>
          <Typography variant="body1">
            {
              l10n.formatString(
                l10n.aboutDesc,
                <Link href='https://www.academia.edu/35143200/THE_COLIGNY_CALENDAR_AS_A_METONIC_LUNAR_CALENDAR'>Helen McKay</Link>
              )
            }            
          </Typography>
        </Box>
      </Box>
    </Popover>

  );
}

AboutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};