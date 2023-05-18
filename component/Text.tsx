import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface TextProps extends TypographyProps {
  children: React.ReactNode;
}

function Text({ children, ...props }: TextProps) {
  return <Typography {...props}>{children}</Typography>;
}

export default Text;