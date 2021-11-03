import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ColignyCalendarHeader(props) {
	const { date } = props;
	return (
    	<Box sx={{ flexGrow: 1, textAlign: "center", padding: .25}} className="coligny-cal-header">
    		<IconButton size='small'>{"<<"}</IconButton>
    		<IconButton size='small'>{"<"}</IconButton>
	        <Typography variant="h6"
	         sx={{	paddingLeft: 2,
	         		paddingRight: 2,
					display: "inline-block",
					verticalAlign: 'middle'
				}}
			>{date.toLocaleString('default', { month: 'long' })}</Typography>
    		<IconButton size='small'>{">"}</IconButton>
    		<IconButton size='small'>{">>"}</IconButton>
    	</Box>
    );
}
