import "./styles/App.css";
import MainPage from "./pages/MainPage";
import Header from "./layout/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductDetailPage from "./pages/ProductDetailPage";
import PaymentPage from "./pages/PaymentPage";

const App = () => {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path={'/'} element={<MainPage/>}/>
          <Route path="/products/:productId" element={<ProductDetailPage/>}/>
          <Route path="/products/:productId/payment" element={<PaymentPage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App;
