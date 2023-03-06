import { createTheme } from "@mui/material";
// import { white } from '@mui/material/colors';


const theme = createTheme({
    palette: {
        primary: {
            main: '#074F57',
            // text: '#FFFFFF',
            // buttonHighlight: '#9ECE9A',
            // buttonHighlightText: '#000000'
        },
        secondary: {
            main: '#FFFFFF',
            // text: '#000000'
        },
        background: {
            default: '#FFFFFF',
            drawer: '#074F57',
        },
    },

});

export default theme;