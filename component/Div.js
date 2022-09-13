import { Box } from '@mui/material'

function Div({ children, alignItems, justifyContent, ...sx }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems,
                justifyContent,
                padding: 1,
                ...sx
            }}
        // component='div'
        >
            {children}
        </Box>
    )
}
export default Div

