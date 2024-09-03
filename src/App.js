import "./styles/App.css";
import MainPage from "./pages/MainPage";
import Header from "./layout/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductDetailPage from "./pages/ProductDetailPage";

const App = () => {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path={'/'} element={<MainPage/>}/>
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
