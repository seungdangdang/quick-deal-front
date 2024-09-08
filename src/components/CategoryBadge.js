import React from 'react';
import { Chip } from '@mui/material';

const categoryColors = {
  FASHION: '#FF69B4',
  BEAUTY: '#FFB6C1',
  BABY_PRODUCTS: '#87CEFA',
  FOOD: '#FFA500',
  KITCHENWARE: '#FF6347',
  HOUSEHOLD_GOODS: '#8FBC8F',
  HOME_INTERIOR: '#DDA0DD',
  DIGITAL_APPLIANCES: '#4682B4',
  SPORTS_LEISURE: '#32CD32',
  AUTOMOTIVE: '#708090',
  BOOKS_MEDIA_DVD: '#9370DB',
  TOOLS_HOBBIES: '#FF4500',
  STATIONERY_OFFICE: '#FFD700',
  PET_SUPPLIES: '#FFDEAD',
  HEALTH_SUPPLEMENTS: '#ADFF2F',
  TRAVEL_TICKETS: '#00BFFF',
  GIFT: '#FF1493',
};

const CategoryBadge = ({ categoryType, categoryName }) => {
  const backgroundColor = categoryColors[categoryType] || '#ddd';
  const textColor = ['#FFD700', '#FFDEAD', '#FFA500'].includes(backgroundColor) ? '#333' : '#fff';

  return (
      <Chip
          label={categoryName}
          size="small"
          sx={{
            backgroundColor: backgroundColor,
            color: textColor,
            marginBottom: 1,
          }}
      />
  );
};

export default CategoryBadge;
