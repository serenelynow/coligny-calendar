import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import GoForwardOneMonth from './GoForwardOneMonth.js';
import GoForwardOneYear from './GoForwardOneYear.js';
import GoBackOneMonth from './GoBackOneMonth.js';
import GoBackOneYear from './GoBackOneYear.js';

export default function ColignyCalendarHeader(props) {
	const { label } = props;

	return (
    	<Box sx={{ flexGrow: 1, textAlign: "center", padding: .25}} className="coligny-cal-header">
    		<GoBackOneYear/>
    		<GoBackOneMonth/>
	        <Typography variant="h6"
	         sx={{	paddingLeft: 2,
	         		paddingRight: 2,
					display: "inline-block",
					verticalAlign: 'middle'
				}}
			>{label}</Typography>
    		<GoForwardOneMonth/>
    		<GoForwardOneYear/>
    	</Box>
    );
}

ColignyCalendarHeader.propTypes = {
  label: PropTypes.string.isRequired
};