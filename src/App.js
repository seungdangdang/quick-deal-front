import "./styles/App.css";
import MainPage from "./pages/MainPage";
import Header from "./layout/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const App = () => {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path={'/'} element={<MainPage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App;
