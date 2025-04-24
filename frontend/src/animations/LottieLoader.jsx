
import React from 'react';
import { Backdrop, Box } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from './signup-loader.json';

const LottieLoader = ({ open }) => (
  <Backdrop
    open={open}
    sx={{
      color: '#1F2937',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      flexDirection: 'column',
      backgroundColor: 'rgba(0,0,0,0.6)'
    }}
  >
    <Box sx={{ width: 200, height: 200 }}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  </Backdrop>
);

export default LottieLoader;
