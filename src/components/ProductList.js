import React from 'react';
import '../styles/ProductList.css';
import {useNavigate} from "react-router-dom";

const ProductList = ({products}) => {
  const navigate = useNavigate();

  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available</p>;
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
      <div className='product-grid'>
        {products.map((product) => (
            <div
                key={product.id}
                className='product-card'
                onClick={() => handleProductClick(product.id)}
                style={{cursor: 'pointer'}}
            >
              <div className="product-list-image-placeholder"></div>
              <p>상품코드 [{product.id}]</p>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <p>{product.description}</p>
            </div>
        ))}
      </div>
  )
}

export default ProductList;