import MainPage from "./pages/MainPage";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductDetailPage from "./pages/ProductDetailPage";
import PaymentPage from "./pages/PaymentPage";
import {Box} from "@mui/material";
import {AuthProvider} from "./context/AuthContext";

const App = () => {
  return (
      <AuthProvider>
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: '#f5f5f5',
            }}
        >
          <BrowserRouter>
            <Header/>
            <Box
                sx={{
                  flex: 1,
                  maxWidth: '1500px',
                  margin: '0 auto',
                  padding: '0 20px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
            >
              <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/products/:productId"
                       element={<ProductDetailPage/>}/>
                <Route path="/products/:productId/payment"
                       element={<PaymentPage/>}/>
              </Routes>
            </Box>
            <Footer/>
          </BrowserRouter>
        </Box>
      </AuthProvider>
  );
};

export default App;
