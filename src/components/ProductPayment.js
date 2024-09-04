import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const PaymentPage = ({ product }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    if (product && product.timeLimit) {
      startCountdown(product.timeLimit);
    }
  }, [product]);

  const startCountdown = (timeLimit) => {
    const targetTime = timeLimit * 1000;
    countdownIntervalRef.current = setInterval(() => {
      const currentTime = new Date().getTime();
      const remaining = Math.max(
          0,
          Math.floor((targetTime - currentTime) / 1000)
      );
      setRemainingTime(remaining);

      if (remaining === 0) {
        clearInterval(countdownIntervalRef.current);
        alert("시간이 만료되어 결제가 취소됩니다.");
        handleCancelOrder();
      }
    }, 1000);
  };

  const handleCancelOrder = async () => {
    const orderId = sessionStorage.getItem("orderId");
    const userId = localStorage.getItem("userid");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("ticketToken");

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        params: { userId },
      });

      alert("주문 취소가 완료되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("주문 취소 중 오류가 발생했습니다:", error);
      alert("주문 취소 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handlePayment = async () => {
    const userId = localStorage.getItem("userid");
    const orderId = sessionStorage.getItem("orderId");

    try {
      const response = await axios.post(
          `${API_URL}/products/${product.id}/payment`,
          {
            userId: userId,
            orderId: parseInt(orderId, 10),
            paymentAmount: parseInt(product.paymentAmount, 10),
          }
      );

      if (response.data.status === "PAYMENT_COMPLETED") {
        alert("결제가 완료되었습니다.");
        window.location.href = "/";
      } else if (response.data.status === "ITEM_SOLD_OUT") {
        alert("제품이 품절되었습니다. 주문을 취소합니다.");
        window.location.href = "/";
      } else {
        alert("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  };

  return (
      <div className="payment-page">
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>결제하기</h2>
        <table>
          <thead>
          <tr>
            <th>주문 상품</th>
            <th>수량</th>
            <th>주문 금액</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{product.name}</td>
            <td>1</td>
            <td>{product.price}</td>
          </tr>
          </tbody>
        </table>
        <p>제한 시간: {formatTime(remainingTime)}</p>
        <button className="purchase-button" onClick={handlePayment}>
          결제하기
        </button>
        <button className="cancel-button" onClick={handleCancelOrder}>
          취소
        </button>
      </div>
  );
};

export default PaymentPage;
