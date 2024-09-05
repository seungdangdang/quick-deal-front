import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {API_URL} from "../config";
import "../styles/ProductPayment.css";
import {useLocation} from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const {product, expiredAtEpochSeconds} = location.state || {};
  const [remainingTime, setRemainingTime] = useState(null);
  const [expiryDateTime, setExpiryDateTime] = useState("");
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const expiryDate = dayjs.unix(expiredAtEpochSeconds);
    const formattedExpiryDate = expiryDate.format("YYYY년 M월 D일 H시 m분");
    setExpiryDateTime(formattedExpiryDate);

    const currentTimeInSeconds = dayjs().unix();
    const timeLeftInSeconds = expiredAtEpochSeconds - currentTimeInSeconds;

    if (timeLeftInSeconds > 0) {
      startCountdown(timeLeftInSeconds);
    } else {
      alert("시간이 만료되어 결제가 취소됩니다.");
      handleCancelOrder();
    }

    return () => clearInterval(countdownIntervalRef.current);
  }, [product, expiredAtEpochSeconds]);

  const startCountdown = (initialTimeLeft) => {
    setRemainingTime(initialTimeLeft);
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownIntervalRef.current);
          alert("시간이 만료되어 결제가 취소됩니다.");
          handleCancelOrder();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleCancelOrder = async () => {
    const orderId = sessionStorage.getItem("orderId");
    const userId = localStorage.getItem("userid");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("ticketToken");

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        params: {userId},
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
        <h2 style={{textAlign: "center", fontWeight: "bold"}}>결제하기</h2>
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
        <p>제한 시간: {expiryDateTime} 까지</p>
        <p>남은 시간: {formatTime(remainingTime)}</p>
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
