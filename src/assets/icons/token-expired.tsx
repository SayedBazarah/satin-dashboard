import * as React from 'react';
import { memo, forwardRef } from 'react';

import { Box, BoxProps } from '@mui/material';

const SvgComponent = ({ ...other }: BoxProps) => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
    {...other}
  >
    <circle cx={17} cy={17} r={14} fill="#2169d3" />
    <circle cx={17} cy={17} r={11} fill="#eee" />
    <path d="M16 8h2v9h-2z" />
    <path d="m22.655 20.954-1.697 1.697-4.808-4.807 1.697-1.697z" />
    <circle cx={17} cy={17} r={2} />
    <circle cx={17} cy={17} r={1} fill="#2169d3" />
    <path
      fill="#ffce53"
      d="m11.9 42 14.4-24.1c.8-1.3 2.7-1.3 3.4 0L44.1 42c.8 1.3-.2 3-1.7 3H13.6c-1.5 0-2.5-1.7-1.7-3z"
    />
    <path
      fill="#fff"
      d="M26.4 39.9c0-.2 0-.4.1-.6s.2-.3.3-.5.3-.2.5-.3.4-.1.6-.1.5 0 .7.1.4.2.5.3.2.3.3.5.1.4.1.6 0 .4-.1.6-.2.3-.3.5-.3.2-.5.3-.4.1-.7.1-.5 0-.6-.1-.4-.2-.5-.3-.2-.3-.3-.5-.1-.4-.1-.6zm2.8-3.1h-2.3l-.4-9.8h3l-.3 9.8z"
    />
  </Box>
);
const ForwardRef = forwardRef(SvgComponent);
const Memo = memo(ForwardRef);
export default Memo;
