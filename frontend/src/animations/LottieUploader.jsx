import React from 'react';
import { Backdrop, Box } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from './upload.json';

/**
 * LottieLoader
 * A backdrop-based loader component that displays a Lottie animation.
 *
 * Props:
 * - open: boolean flag to show/hide the loader
 * - size: number (optional) width and height of the animation in pixels (default: 200)
 * - backdropProps: object (optional) additional props to pass to the Backdrop
 */
const LottieLoader = ({ open, size = 200, backdropProps = {} }) => (
  <Backdrop
    open={open}
    sx={{
      color: '#1F2937',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      flexDirection: 'column',
      backgroundColor: 'rgba(0,0,0,0.6)',
      ...backdropProps.sx
    }}
    {...backdropProps}
  >
    <Box sx={{ width: size, height: size }}>
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
