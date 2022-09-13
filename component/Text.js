import { Typography } from '@mui/material';

function Text({ children, ...props }) {
    return <Typography {...props}>{children}</Typography>
}

export default Text