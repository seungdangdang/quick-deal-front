import React from "react";
import { useLocation } from "react-router-dom";
import PaymentPage from "../components/ProductPayment";

const ProductPaymentPage = () => {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) {
    return <p>Error: 결제에 필요한 데이터가 누락되었습니다.</p>;
  }

  return <PaymentPage product={product} />;
};

export default ProductPaymentPage;
