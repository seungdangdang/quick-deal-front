import {API_URL} from "../config";
import ProductList from "../components/ProductList";
import useAxiosGet from "../hooks/useAxiosGet";
import {useEffect} from "react";

const MainPage = () => {
  const {data, loading} = useAxiosGet(`${API_URL}/products`);
  const products = data && Array.isArray(data.products) ? data.products : [];

  // 스크롤이 바닥에 닿았는지 인지
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY
          >= document.documentElement.scrollHeight - 1) {
        alert('스크롤이 바닥에 닿았음');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return <p> Loading ... </p>
  }

  return (
      <>
        <ProductList products={products}/>
      </>
  );
};

export default MainPage;