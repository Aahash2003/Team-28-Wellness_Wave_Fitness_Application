import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import './HorizontalScrollBar.css'; // Ensure you have your custom styles here
import LeftArrowIcon from './left-arrow.png';  // Replace with your own icon path
import RightArrowIcon from './right-arrow.png'; // Replace with your own icon path

const LeftArrow = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);

  return (
    <IconButton
      onClick={() => scrollPrev()}
      className="left-arrow"
      sx={{ 
        position: 'absolute', 
        left: '30px', 
        top: '70%', 
        transform: 'translateY(-50%)', 
        zIndex: 1,
        padding: 0, // Remove extra padding around the icon
        width: '40px', 
        height: '40px' 
      }}
    >
      <img src={LeftArrowIcon} alt="left-arrow" style={{ width: '100%', height: '100%' }} />
    </IconButton>
  );
};

const RightArrow = () => {
  const { scrollNext } = React.useContext(VisibilityContext);

  return (
    <IconButton
      onClick={() => scrollNext()}
      className="right-arrow"
      sx={{ 
        position: 'absolute', 
        right: '30px', 
        top: '70%', 
        transform: 'translateY(-50%)', 
        zIndex: 1,
        padding: 0, // Remove extra padding around the icon
        width: '40px', 
        height: '40px' 
      }}
    >
      <img src={RightArrowIcon} alt="right-arrow" style={{ width: '100%', height: '100%' }} />
    </IconButton>
  );
};

const HorizontalScrollbar = ({ categories, handleCategoryChange, selectedCategory }) => (
  <Box sx={{ position: 'relative', padding: '0 60px' }}>
    <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
      {categories.map((category) => (
        <Stack
          key={category._id}
          itemId={category._id}
          title={category.name}
          alignItems="center"
          justifyContent="center"
          className="category-card"
          sx={{
            cursor: 'pointer',
            border: selectedCategory === category._id ? '4px solid #FF2625' : 'none',
            borderBottomLeftRadius: '15px',
            width: '270px',
            height: '252px',
            background: '#fff',
            gap: '20px',
            margin: '0 20px',
            paddingTop: '20px',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => handleCategoryChange(category._id)}
        >
          <img src={category.imageUrl} alt={category.name} style={{ width: '100px', height: '100px' }} />
          <Typography
            fontSize="20px"
            fontWeight="bold"
            fontFamily="Alegreya"
            color="#3A1212"
            textTransform="capitalize"
            sx={{ paddingTop: '10px' }}
          >
            {category.name}
          </Typography>
        </Stack>
      ))}
    </ScrollMenu>
  </Box>
);

export default HorizontalScrollbar;
