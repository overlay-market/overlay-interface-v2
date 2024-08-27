import {createTheme} from '@mui/material'

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 575,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          margin: '0',
          width: '100%',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 1024px)': {
            maxWidth: '1220px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})
