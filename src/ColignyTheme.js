import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export default function ColignyTheme () {
	
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const bngGreen = "#1D4616";
	const bngGreenLight = "#33582d";
	const bngYellow = '#CECF2F';
	const bngYellowLight = "#d7d858";


	return React.useMemo(
	  () =>
	    createTheme({
	      palette: {
	        mode: prefersDarkMode ? 'dark' : 'light',
	        bng: {
	        	dark: {
	        		green: bngGreen,
	        		yellow: bngYellow
	        	}, 
	        	light: {
	        		green: bngGreenLight,
	        		yellow: bngYellowLight
	        	},
	        	today: {
	        		background: prefersDarkMode ? bngGreen : bngGreenLight,
	        		font: prefersDarkMode ? bngYellow : bngYellowLight
	        	}
	        }
	      },
	      components: {
			    MuiAppBar: {
			    	styleOverrides: {
			    		root: (
			    			prefersDarkMode
			    				? {backgroundColor: bngGreen, color: bngYellow}
			    				: {backgroundColor: bngGreenLight, color: bngYellowLight}
			    		)
			    	}
			    },
			    MuiTableHead: {
			      styleOverrides: {
			        root: (
			        	prefersDarkMode 
		        			? {backgroundColor: grey[800]} 
		        			: {backgroundColor: grey[300], 
		        					borderColor: grey[700], 
		        					borderWidth: 1, 
		        					borderStyle: 'solid', 
		        					borderRight: 'none', 
		        					borderLeft: 'none'
		        				}
			        )
			      }
			    }
				}
	    }),
	  [prefersDarkMode],
	);
};