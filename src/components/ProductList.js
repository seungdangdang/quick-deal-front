import React from 'react';
import '../styles/ProductList.css';

const ProductList = ({products}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
      <div className='product-grid'>
        {products.map((product) => (
            <div key={product.id} className='product-card'>
              <h3>{product.name}</h3>
              <p>{product.price}원</p>
              <p>{product.description}</p>
            </div>
        ))}
      </div>
  )
}

export default ProductList;