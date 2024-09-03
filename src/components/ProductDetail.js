import React from "react";
import {useParams} from "react-router-dom";
import useAxiosGet from "../hooks/useAxiosGet";
import {API_URL} from "../config";

const ProductDetailPage = () => {
  const {productId} = useParams();
  const {data: product, loading, error} = useAxiosGet(
      `${API_URL}/products/${productId}`);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
      <div className="product-detail">
        <div className="product-detail-image-placeholder">
          <div className="image-box">
            <div className="image-cross"></div>
          </div>
        </div>
        <div className="product-info">
          <p>상품코드 [{product.id}]</p>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <p>{product.categoryName}</p> {/* TODO: 배지로 처리할 것 */}
        </div>
      </div>
  );
};

export default ProductDetailPage;
