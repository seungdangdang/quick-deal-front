import React from 'react';
import {useNavigate} from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryBadge from './CategoryBadge';

// 모든 이미지를 미리 가져오는 로직
const images = require.context('../assets/images/quickdeal-product-images', true, /\.(png|jpe?g|svg)$/);

const getImageUrl = (productId) => {
  // 해당 상품 ID에 맞는 첫 번째 이미지를 찾습니다.
  const imagePath = images.keys().find((key) => key.includes(`/${productId}/`));
  return imagePath ? images(imagePath) : "https://via.placeholder.com/300";
};

const ProductList = ({products}) => {
  const navigate = useNavigate();

  if (!Array.isArray(products) || products.length === 0) {
    return <Typography variant="h6" align="center">No products
      available</Typography>;
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
      <Grid container spacing={5} sx={{padding: '50px'}}>
        {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                  onClick={() => handleProductClick(product.id)}
                  sx={{cursor: 'pointer', '&:hover': {boxShadow: 6}}}
              >
                {/* 이미지 */}
                <CardMedia
                    component="img"
                    image={product.imageUrl || getImageUrl(product.id)}
                    alt={product.name}
                    sx={{ height: 350, objectFit: 'cover' }}
                />
                <CardContent>
                  {/* 카테고리 배지 */}
                  <CategoryBadge categoryType={product.categoryType}
                                 categoryName={product.categoryName}/>
                  {/* 제품명 */}
                  <Typography variant="body1" component="div"
                              sx={{fontWeight: 'bold', marginBottom: 0.5}}>
                    {product.name} [{product.id}]
                  </Typography>

                  {/* 가격 */}
                  <Typography variant="h6" color="secondary"
                              sx={{fontWeight: 'bold'}}>
                    {product.price.toLocaleString()}원
                  </Typography>
                  {/* 배송 정보 */}
                  <Box display="flex" alignItems="center" sx={{marginTop: 1}}>
                    <LocalShippingIcon color="secondary"
                                       sx={{marginRight: 0.5}}/>
                    <Typography variant="caption" color="text.secondary">
                      빠른배송
                    </Typography>
                  </Box>
                  {/* 리뷰 및 평점 */}
                  <Box display="flex" alignItems="center" sx={{marginTop: 1}}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          textOverflow: 'ellipsis',
                          marginTop: 1,
                        }}
                    >
                      {product.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
        ))}
      </Grid>
  );
};

export default ProductList;
