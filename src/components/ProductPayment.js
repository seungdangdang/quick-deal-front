import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {API_URL} from "../config";
import {useLocation, useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Divider,
} from "@mui/material";

const ProductPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, expiredAtEpochSeconds, quantity } = location.state || {};
  const [remainingTime, setRemainingTime] = useState(null);
  const [expiryDateTime, setExpiryDateTime] = useState("");
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    handleCreateOrder();

    const expiryDate = dayjs.unix(expiredAtEpochSeconds);
    const formattedExpiryDate = expiryDate.format("YYYY년 M월 D일 H시 m분");
    setExpiryDateTime(formattedExpiryDate);

    const currentTimeInSeconds = dayjs().unix();
    const timeLeftInSeconds = expiredAtEpochSeconds - currentTimeInSeconds;

    if (timeLeftInSeconds > 0) {
      startCountdown(timeLeftInSeconds);
    } else {
      handleCancelOrder();
    }
    const handleLogout = () => {
      alert("로그아웃 되었습니다. 결제를 취소하고 메인 페이지로 이동합니다.");
      handleCancelOrder();
    };
    window.addEventListener("logout", handleLogout);

    return () => {
      clearInterval(countdownIntervalRef.current);
      window.removeEventListener("logout", handleLogout);
    };
  }, [product, expiredAtEpochSeconds, quantity]);

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

  const handleCreateOrder = async () => {
    const userId = localStorage.getItem("userid");

    try {
      const response = await axios.post(`${API_URL}/orders`, {
        userId: userId,
        quantityPerProduct: {
          productId: product.id,
          quantity: 1,
        },
      });

      const orderId = response.data;
      sessionStorage.setItem("orderId", orderId);
    } catch (error) {
      console.error("주문 중 오류가 발생했습니다:", error);
      alert("주문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancelOrder = async () => {
    const orderId = sessionStorage.getItem("orderId");
    const userId = localStorage.getItem("userid");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("productId");
    sessionStorage.removeItem("ticket");
    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        data: {
          userId: userId,
          productId: product.id,
        },
      });

      alert("주문 취소가 완료되었습니다.");
      navigate("/");
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
        sessionStorage.removeItem("orderId");
        sessionStorage.removeItem("productId");
        sessionStorage.removeItem("ticket");
        navigate("/");
      } else if (response.data.status === "ITEM_SOLD_OUT") {
        alert("제품이 품절되었습니다. 주문을 취소합니다.");
        sessionStorage.removeItem("orderId", orderId);
        sessionStorage.removeItem("productId");
        sessionStorage.removeItem("ticket");
        navigate("/");
      } else {
        alert("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
        sessionStorage.removeItem("orderId", orderId);
        sessionStorage.removeItem("productId");
        sessionStorage.removeItem("ticket");
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
      <Container maxWidth="sm" sx={{mt: 5, textAlign: "center"}}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          결제하기
        </Typography>
        <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              border: "1px dashed grey",
              maxWidth: "500px",
              minHeight: "400px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "auto",
            }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            주문내역
          </Typography>
          <Divider sx={{mb: 1}}/>

          {/* 상품 구성 */}
          <Box sx={{mb: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
              <Typography variant="body2" fontWeight="bold">
                주문상품
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                수량
              </Typography>
            </Box>
            <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
              <Typography variant="body2">{product.name}</Typography>
              <Typography variant="body2">{quantity}</Typography>
            </Box>
          </Box>

          <Divider sx={{my: 1}}/>

          {/* 합계 및 시간 */}
          <Box sx={{textAlign: "right", mt: 2}}>
            <Typography variant="body2">합계</Typography>
            <Typography variant="body2" fontWeight="bold">
              {product.price.toLocaleString()}원
            </Typography>
          </Box>
          <Divider sx={{my: 1}}/>

          {/* 제한 시간 및 남은 시간 */}
          <Box sx={{textAlign: "right"}}>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{fontStyle: "italic"}}
            >
              {expiryDateTime} 까지 결제하지 않을 시 주문이 취소됩니다
            </Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{fontStyle: "italic", color: "red"}}
            >
              {formatTime(remainingTime)}
            </Typography>
          </Box>
        </Paper>

        {/* 버튼 */}
        <Box sx={{display: "flex", justifyContent: "center", gap: 2, mt: 2}}>
          <Button
              variant="contained"
              color="success"
              onClick={handlePayment}
              sx={{
                borderRadius: "20px",
                px: 4,
                py: 1,
                fontSize: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
          >
            결제
          </Button>
          <Button
              variant="contained"
              color="error"
              onClick={handleCancelOrder}
              sx={{
                borderRadius: "20px",
                px: 4,
                py: 1,
                fontSize: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
          >
            취소
          </Button>
        </Box>
      </Container>
  );
};

export default ProductPayment;
