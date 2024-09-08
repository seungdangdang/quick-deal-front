import React, {useRef, useState} from "react";
import axios from "axios";
import {API_URL} from "../config";
import {useNavigate} from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  IconButton,
  Box,
  Grid,
  CardMedia,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CategoryBadge from "../components/CategoryBadge";

const ProductDetail = ({product}) => {
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [remainingInQueue, setRemainingInQueue] = useState(null);
  const [productId, setProductId] = useState(product.id);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const pollingIntervalRef = useRef(null);

  const [mainImage, setMainImage] = useState(
      "https://via.placeholder.com/500?text=Image+1");

  const [thumbnailColors] = useState(
      ["#FFD700",
        "#8FBC8F",
        "#87CEEB",
        "#DDA0DD",
      ]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const handleThumbnailClick = (index) => {
    setSelectedThumbnail(index);
    setMainImage(`https://via.placeholder.com/500?text=Image+${index + 1}`);
  };

  const handlePurchase = async () => {
    const userId = localStorage.getItem("userid");

    if (!userId) {
      setIsUserLoggedIn(false);
      setShowQueueModal(true);
      return;
    }

    setIsUserLoggedIn(true);
    setShowQueueModal(true);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/orders/ticket`, {
        userId: userId,
        productId: productId
      });

      if (response.data) {
        const ticketToken = response.data.value

        sessionStorage.setItem("productId", product.id);
        sessionStorage.setItem("ticket", ticketToken);

        console.log("before queue/status");
        const queueResponse = await axios.get(`${API_URL}/orders/queue/status`, {
          params: { ticket: ticketToken },
        });
        console.log("결제 페이지 접근 상태:", queueResponse.data);

        setTicketNumber(queueResponse.data.ticketNumber);

        console.log( "ticketNumber > " + ticketNumber );
        if (queueResponse.data.status === "ACCESS_DENIED") {
          console.log( "result > ACCESS_DENIED" );
          startPolling(ticketToken);
        } else if (queueResponse.data.status === "ACCESS_GRANTED") {
          console.log( "result > ACCESS_GRANTED" );
          console.log( "state > " + product + "-" + queueResponse.data.expiredAtEpochSeconds + "-" + quantity );

          navigate(`/products/${productId}/payment`, {
            state: {
              product,
              expiredAtEpochSeconds: queueResponse.data.expiredAtEpochSeconds,
              quantity: quantity,
            },
          });
        }
      }
    } catch (error) {
      console.error("주문 상세 페이지 - 주문 도중 오류가 발생했습니다:", error);
      alert("주문을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      closeModal();
    } finally {
      setLoading(false);
    }
  }

  const handleCancelOrder = async () => {
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("ticketToken");

    try {
      alert("대기 취소가 완료되었습니다.");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("대기 취소 중 오류가 발생했습니다.", error);
      alert("대기 취소 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const startPolling = (ticketToken) => {
    setPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const queueResponse = await axios.get(`${API_URL}/orders/queue/status`, {
          params: { ticket: ticketToken },
        });

        console.log("폴링 중... 결제 페이지 접근 상태:", queueResponse.data);
        setRemainingInQueue(queueResponse.data.numberOfRemainingInQueue);

        if (queueResponse.data.status === "ACCESS_GRANTED") {
          clearInterval(pollingIntervalRef.current);
          navigate(`/products/${productId}/payment`, {
            state: {
              product,
              expiredAtEpochSeconds: queueResponse.data.expiredAtEpochSeconds,
              quantity: quantity,
            },
          });
        } else if (queueResponse.data.status === "ITEM_SOLD_OUT") {
          clearInterval(pollingIntervalRef.current);
          alert("상품이 품절되었습니다.");
          closeModal();
        }
      } catch (error) {
        console.error("폴링 중 오류가 발생했습니다.", error);
      }
    }, 3000);
  };

  const closeModal = () => {
    clearInterval(pollingIntervalRef.current);
    setShowQueueModal(false);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      closeModal();
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  return (<Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        gap: "10px",
      }}
  >
    <Grid container spacing={3}>
      <Grid item xs={12} md={2}>
        <Box sx={{display: "flex", flexDirection: "column", gap: 0.5}}>
          {thumbnailColors.map((color, index) => (<CardMedia
              key={index}
              component="img"
              image={`https://via.placeholder.com/60/${color.slice(
                  1)}/ffffff?text=${index + 1}`}
              alt={`Thumbnail ${index + 1}`}
              sx={{
                width: 60,
                height: 60,
                border:
                    `1px solid ${selectedThumbnail === index ? "#333"
                        : "#ddd"}`,
                cursor: "pointer",
                "&:hover": {border: "1px solid #333"},
              }}
              onClick={() => handleThumbnailClick(index)}
          />))}
        </Box>
      </Grid>
      <Grid item xs={5}>
        <CardMedia
            component="img"
            image={mainImage}
            alt={product.name}
            sx={{height: 600, objectFit: "cover"}}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Box>
          <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{fontWeight: "bold", marginTop: 2}}
          >
            {product.name} [{product.id}]
          </Typography>
          <CategoryBadge
              categoryType={product.categoryType}
              categoryName={product.categoryName}
          />
          <Typography
              variant="h5"
              color="secondary"
              sx={{fontWeight: "bold", marginBottom: 2}}
          >
            {product.price.toLocaleString()}원
          </Typography>
          <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
                textOverflow: "ellipsis",
                marginTop: 1,
              }}
          >
            {product.description}
          </Typography>

          {/* 수량 조절 버튼 */}
          <Box display="flex" alignItems="center" sx={{marginTop: 3}}>
            <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity === 1}
            >
              <RemoveIcon/>
            </IconButton>
            <TextField
                value={quantity}
                onChange={(e) => setQuantity(
                    Math.max(1, parseInt(e.target.value) || 1))}
                size="small"
                sx={{width: 50, textAlign: "center"}}
                inputProps={{min: 1}}
            />
            <IconButton onClick={() => handleQuantityChange(1)}>
              <AddIcon/>
            </IconButton>
          </Box>

          <Button
              variant="contained"
              color="primary"
              onClick={handlePurchase}
              sx={{
                marginTop: 3,
                backgroundColor: "#FF6F61",
                color: "#fff",
                borderRadius: "30px",
                padding: "10px 20px",
                fontSize: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#FF8A65",
                },
              }}
          >
            주문하기
          </Button>
        </Box>
      </Grid>
    </Grid>

    {/* Material-UI 모달 */}
    <Dialog
        open={showQueueModal}
        onClose={handleClose}
        disableEnforceFocus={true}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: 350,
            textAlign: 'center',
            padding: '16px 24px',
          },
        }}
    >
      <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#333',
            paddingBottom: '8px',
          }}
      >
        QUICK DEAL
      </DialogTitle>
      {isUserLoggedIn && (<Typography
          sx={{
            textAlign: 'center',
            fontSize: '1rem',
            color: '#666',
            marginBottom: '16px',
          }}
      >
        접속 대기 중입니다.
        <br/>
        순서가 오면 다음 단계로 넘어갑니다.
      </Typography>)}
      <DialogContent
          dividers
          sx={{
            textAlign: 'center', padding: '16px 24px', position: 'relative',
          }}
      >
        {!isUserLoggedIn ? (
            <Typography sx={{fontSize: '1rem', color: '#555'}}>
              로그인을 먼저 해주세요!
            </Typography>) : loading ? (
            <Box display="flex" alignItems="center" justifyContent="center"
                 sx={{mt: 2}}>
              <CircularProgress size={24} sx={{marginRight: 2}}/>
              <Typography sx={{fontSize: '1rem', color: '#555'}}>
                주문을 처리 중입니다. 잠시만 기다려 주세요...
              </Typography>
            </Box>) : polling ? (<>
          <Typography sx={{
            fontSize: '1.5rem',
            color: '#d9534f',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            내 앞 대기 인원: {remainingInQueue !== null
              ? `${remainingInQueue}명` : '(계산 중...)'}
          </Typography>
          <Typography variant="body2"
                      sx={{color: '#666', fontSize: '0.9rem'}}>
            예상 대기 시간: {remainingInQueue !== null
              ? `${remainingInQueue}분` : '..분'}
          </Typography>
        </>) : (<Typography sx={{fontSize: '1rem', color: '#555'}}>진행
          중...</Typography>)}
      </DialogContent>
      <DialogActions
          sx={{justifyContent: 'center', paddingBottom: '16px', mt: 1}}>
        {isUserLoggedIn ? (<Button
            onClick={handleCancelOrder}
            variant="text"
            sx={{
              color: '#666',
              borderRadius: '20px',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
        >
          대기 취소
        </Button>) : (<Button
            onClick={closeModal}
            variant="text"
            sx={{
              color: '#666',
              borderRadius: '20px',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
        >
          확인
        </Button>)}
      </DialogActions>
      {polling && (<Box sx={{textAlign: 'center', marginTop: '8px'}}>
        <Typography sx={{fontSize: '0.875rem', color: 'red', mb: 2}}>
          대기 중 새로고침을 하거나 다시 접속하시면 주문이 취소되니 유의해 주세요
        </Typography>
      </Box>)}
    </Dialog>
  </Box>);
};

export default ProductDetail;
