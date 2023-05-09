import React from 'react'
import { Box, Stack, Typography, Button } from '@mui/material';
import HeroBannerImage from '../Assets/Logo/banner.png'
const HeroBanner = () => {
    return (
        <Box sx={{ mt: { lg: '212px', xs: '70px' }, 
        ml: { sm: '50px' } }} 
        postition="relative" p="20px" >
            <Typography color="#FF2625" fontWeight="600" fontSize="26px">
                Fitness Club
                </Typography>
                <Typography fontWeight={700} 
                sx={{ fontSize: { lg: '44px', xs: '40px'}}}>
                    Sleep  <br />
                    Grind  
                     <br />
                    Repeat
                    </Typography>
                    <Typography  fontSize = "22px" lineHeight= "35px" mb = {2}>
                        Check out the Most Effective Workouts
                    </Typography>
                    <Button variant = "contained" color= "error" href = "#exercises ">Explore Exercises</Button>
                    <img src= {HeroBannerImage} alt= "banner" className='hero-banner-img'style={{ left: '500px', margin:'20px'}}px = "-20px"/>
        </Box>
    )
}

export default HeroBanner