import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import GoBackOneYear from './GoBackOneYear.js';
import GoBackOneMonth from './GoBackOneMonth.js';
import GoForwardOneMonth from './GoForwardOneMonth.js';
import GoForwardOneYear from './GoForwardOneYear.js';

export default function ColignyCalendarHeader(props) {
	const { label } = props;

	return (
    	<Box sx={{ flexGrow: 1, textAlign: "center", paddingTop: {xs: 1, sm: 2}, paddingBottom: {xs: 1, sm: 2}}} className="coligny-cal-header">
    		<GoBackOneYear/>
    		<GoBackOneMonth/>
	        <Typography variant="h6"
	         sx={{	paddingLeft: {xs: 0, sm: 2, md: 2},
	         		paddingRight: {xs: 0, sm: 2, md: 2},
							display: "inline-block",
							verticalAlign: 'middle',
							fontSize: {xs: ".95rem", sm:'1.15rem'},
							width: {xs: '160px', sm: '225px'}
						}}
					>
						{label}
					</Typography>
    		<GoForwardOneMonth/>
    		<GoForwardOneYear/>
    	</Box>
    );
}

ColignyCalendarHeader.propTypes = {
  label: PropTypes.string.isRequired
};