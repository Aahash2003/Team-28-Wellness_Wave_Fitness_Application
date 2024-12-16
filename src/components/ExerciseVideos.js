import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation in web-based apps

const ExerciseVideos = ({ exerciseVideos, name }) => {
  const navigate = useNavigate(); // Hook for navigation

  // If no videos are loaded yet, display a loading message
  if (!exerciseVideos.length) return 'Loading...';

  return (
    <Box sx={{ marginTop: { lg: '200px', xs: '20px' } }} p="20px">
      {/* Back Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate(-1)} // Navigate back to the previous page
        sx={{ marginBottom: '20px' }}
      >
        Back
      </Button>

      {/* Title Section */}
      <Typography variant="h3" mb="33px">
        Watch{' '}
        <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>
          {name}
        </span>{' '}
        exercise videos
      </Typography>

      {/* Video Thumbnails */}
      <Stack
        justifyContent="flex-start"
        flexWrap="wrap"
        alignItems="center"
        sx={{
          flexDirection: { lg: 'row' },
          gap: { lg: '110px', xs: '0' },
        }}
      >
        {exerciseVideos?.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="exercise-video"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${item.video.videoId}`, '_blank', 'noopener,noreferrer')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={item.video.thumbnails[0].url}
              alt={item.video.title}
              style={{ maxWidth: '100%', marginBottom: '10px' }}
            />
            <Box>
              <Typography variant="h5" color="#333">
                {item.video.title}
              </Typography>
              <Typography variant="h6" color="#111">
                {item.video.channelName}
              </Typography>
            </Box>
          </div>
        ))}
      </Stack>
    </Box>
  );
};

export default ExerciseVideos;
