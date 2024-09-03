import React, {useRef, useState} from "react"
import {API_URL} from "../config";
import axios from "axios"

const ProductDetail = ({product}) => {
  const [showModal, setShowModal] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [polling, setPolling] = useState(false);
  const pollingIntervalRef = useRef(null);

  if (!product) {
    return null;
  }

  const handlePurchase = async () => {
    const userId = localStorage.getItem('userid');

    if (!userId) {
      setIsUserLoggedIn(false);
      setShowModal(true);
      return;
    }

    setIsUserLoggedIn(true);
    setShowModal(true);
    setIsOrderCompleted(false);
    setLoading(true);

    try {
      const quantity = 1; // TODO: 임시 수량

      // 주문 생성 API 호출
      const response = await axios.post(`${API_URL}/orders`, {
        userId: userId,
        quantityPerProductRequest: {
          productId: product.id,
          quantity: quantity,
        },
      });

      if (response.data) {
        const {orderId, ticketToken} = response.data;

        sessionStorage.setItem('orderId', orderId);
        sessionStorage.setItem('ticketToken', ticketToken);

        setOrderData(response.data);
        setIsOrderCompleted(true);

        // 결제 페이지 접근 상태 확인 API 호출
        const queueResponse = await axios.post(`${API_URL}/queue`, null, {
          params: {ticketToken},
        });

        console.log('결제 페이지 접근 상태:', queueResponse.data);

        // ACCESS_DENIED 상태일 경우 폴링 시작
        if (queueResponse.data.status === 'ACCESS_DENIED') {
          startPolling(ticketToken);
        } else if (queueResponse.data.status === 'ACCESS_GRANTED') {
          // 결제 페이지로 이동 로직
          handlePaymentAccessGranted();
        }
      }
    } catch (error) {
      console.error('주문 중 오류가 발생했습니다:', error);
      alert('주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
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

        console.log('폴링 중... 결제 페이지 접근 상태:', queueResponse.data);

        if (queueResponse.data.status === 'ACCESS_GRANTED') {
          //TODO: 반환 데이터의 결제 제한 시간 적용
          clearInterval(pollingIntervalRef.current);
          handlePaymentAccessGranted();
        } else if (queueResponse.data.status === 'ITEM_SOLD_OUT') {
          clearInterval(pollingIntervalRef.current);
          alert('상품이 품절되었습니다.');
          closeModal();
        }
      } catch (error) {
        console.error('폴링 중 오류가 발생했습니다:', error);
      }
    }, 3000);
  };

  const handlePaymentAccessGranted = () => {
    setPolling(false);
    closeModal();
    // TODO: 결제 진행을 위한 새로운 모달 창 열기
    // TODO: 결제 진행
  };

  const handleCancelPolling = async () => {
    clearInterval(pollingIntervalRef.current);
    setPolling(false);

    const orderId = sessionStorage.getItem('orderId');
    const userId = localStorage.getItem('userid');
    sessionStorage.removeItem('orderId');
    sessionStorage.removeItem('ticketToken');

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        params: {userId}
      });

      alert('대기 취소가 완료되었습니다.');
      closeModal();
    } catch (error) {
      console.error('대기 취소 중 오류가 발생했습니다:', error);
      alert('대기 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closeModal = () => {
    clearInterval(pollingIntervalRef.current);
    setShowModal(false);
  };

  return (
      <div className='product-detail'>
        <div className='product-detail-image-placeholder'>
          <div className='image-box'>
            <div className='image-cross'></div>
          </div>
        </div>
        <div className='product-info'>
          <p>상품코드 [{product.id}]</p>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <p>{product.categoryName}</p> {/* TODO: 배지로 처리할 것 */}
          <button className='purchase-button' onClick={handlePurchase}>
            구매하기
          </button>
        </div>

        {showModal && (
            <div className='modal' onClick={closeModal}>
              <div className='modal-content'
                   onClick={(e) => e.stopPropagation()}>
                <button className='close-button' onClick={closeModal}>
                  X
                </button>
                {!isUserLoggedIn ? (
                    <p>로그인을 먼저 해주세요!</p>
                ) : loading ? (
                    <p>주문을 처리 중입니다. 잠시만 기다려 주세요...</p>
                ) : polling ? (
                    <>
                      <p>결제 페이지 대기 중입니다...</p>
                      <button onClick={handleCancelPolling}>대기 취소</button>
                    </>
                ) : (
                    <p>진행 중...</p>
                )}
              </div>
            </div>
        )}
      </div>);
};

export default ProductDetail;
