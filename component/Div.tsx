import React from 'react';
import { Box } from '@mui/material';

function Div({ children, alignItems, justifyContent, ...sx }: { children: React.ReactNode; alignItems?: string; justifyContent?: string; sx?: object }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems,
        justifyContent,
        padding: 1,
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default Div;