import React, {useRef, useState} from "react";
import {API_URL} from "../config";
import axios from "axios";

const ProductDetail = ({product}) => {
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [polling, setPolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [remainingInQueue, setRemainingInQueue] = useState(null);
  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  if (!product) {
    return null;
  }

  const handlePurchase = async () => {
    const userId = localStorage.getItem("userid");

    if (!userId) {
      setIsUserLoggedIn(false);
      setShowQueueModal(true);
      return;
    }

    setIsUserLoggedIn(true);
    setShowQueueModal(true);
    setIsOrderCompleted(false);
    setLoading(true);

    try {
      const quantity = 1;

      const response = await axios.post(`${API_URL}/orders`, {
        userId: userId,
        quantityPerProductRequest: {
          productId: product.id,
          quantity: quantity,
        },
      });

      if (response.data) {
        const {orderId, ticketToken} = response.data;

        sessionStorage.setItem("orderId", orderId);
        sessionStorage.setItem("ticketToken", ticketToken);

        setOrderData(response.data);
        setIsOrderCompleted(true);

        const queueResponse = await axios.post(`${API_URL}/queue`, null, {
          params: {ticketToken},
        });

        console.log("결제 페이지 접근 상태:", queueResponse.data);

        if (queueResponse.data.status === "ACCESS_DENIED") {
          startPolling(ticketToken);
        } else if (queueResponse.data.status === "ACCESS_GRANTED") {
          handlePaymentAccessGranted(queueResponse.data.timeLimit);
        }
      }
    } catch (error) {
      console.error("주문 중 오류가 발생했습니다:", error);
      alert("주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (ticketToken) => {
    setPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const queueResponse = await axios.post(`${API_URL}/queue`, null, {
          params: {ticketToken},
        });

        console.log("폴링 중... 결제 페이지 접근 상태:", queueResponse.data);
        setRemainingInQueue(queueResponse.data.numberOfRemainingInQueue);

        if (queueResponse.data.status === "ACCESS_GRANTED") {
          clearInterval(pollingIntervalRef.current);
          handlePaymentAccessGranted(queueResponse.data.timeLimit);
        } else if (queueResponse.data.status === "ITEM_SOLD_OUT") {
          clearInterval(pollingIntervalRef.current);
          alert("상품이 품절되었습니다.");
          closeModal();
        }
      } catch (error) {
        console.error("폴링 중 오류가 발생했습니다:", error);
      }
    }, 3000);
  };

  const handlePaymentAccessGranted = (timeLimit) => {
    setPolling(false);
    setShowQueueModal(false);
    openPaymentModal(timeLimit);
  };

  const openPaymentModal = (timeLimit) => {
    setShowPaymentModal(true);
    startCountdown(timeLimit);
  };

  const startCountdown = (timeLimit) => {
    const targetTime = timeLimit * 1000;
    countdownIntervalRef.current = setInterval(() => {
      const currentTime = new Date().getTime();
      const remaining = Math.max(0,
          Math.floor((targetTime - currentTime) / 1000));
      setRemainingTime(remaining);

      if (remaining === 0) {
        clearInterval(countdownIntervalRef.current);
        alert("시간이 만료되어 결제가 취소됩니다.");
        handleCancelOrder();
      }
    }, 1000);
  };

  const handleCancelOrder = async () => {
    clearInterval(pollingIntervalRef.current);
    clearInterval(countdownIntervalRef.current);
    setPolling(false);

    const orderId = sessionStorage.getItem("orderId");
    const userId = localStorage.getItem("userid");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("ticketToken");

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        params: {userId},
      });

      alert("주문 취소가 완료되었습니다.");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("주문 취소 중 오류가 발생했습니다:", error);
      alert("주문 취소 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const closeModal = () => {
    clearInterval(pollingIntervalRef.current);
    clearInterval(countdownIntervalRef.current);
    setShowQueueModal(false);
    setShowPaymentModal(false);
  };

  // 분과 초 형식으로 변환하는 함수
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  };


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
          <p>{product.categoryName}</p>
          <button className="purchase-button" onClick={handlePurchase}>
            주문하기
          </button>
        </div>

        {showQueueModal && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content"
                   onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>
                  X
                </button>
                {!isUserLoggedIn ? (
                    <p>로그인을 먼저 해주세요!</p>
                ) : loading ? (
                    <p>주문을 처리 중입니다. 잠시만 기다려 주세요...</p>
                ) : polling ? (
                    <>
                      <p>결제 페이지 대기 중입니다</p>
                      <p>
                        현재 대기 중인 인원:{" "}
                        {remainingInQueue !== null ? `${remainingInQueue}명`
                            : "(계산 중...)"}
                      </p>
                      <button onClick={handleCancelOrder}>대기 취소</button>
                    </>
                ) : (
                    <p>진행 중...</p>
                )}
              </div>
            </div>
        )}

        {showPaymentModal && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content"
                   onClick={(e) => e.stopPropagation()}>
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
                <p>제한 시간: {formatTime(remainingTime)}</p>
                <button className="purchase-button">결제하기</button>
                <button className="cancel-button" onClick={handleCancelOrder}>
                  취소
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductDetail;
