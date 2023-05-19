import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Logo from '../Assets/Logo/Logo.png'

const Footer = () => {
  return (
    <Box mt="80x" bgcolor="#fff3f4">
      <Stack gap="40px" 
      alignItems="center" px="0px" pt="24px">
        <img src={Logo} alt="logo" width="800px" height="160px"/>
        <Typography variant="h5" pb="40px" mt="0px">
          By Aahash Srikumar :)
        </Typography>
      </Stack>
    </Box>
  )
}

export default Footer