import {API_URL} from "../config";
import ProductList from "../components/ProductList";
import {useEffect, useState} from "react";
import axios from "axios";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const {data} = await axios.get(`${API_URL}/products`);
        setProducts(data.products);
        if (data.products.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("초기 데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []);

  // 스크롤이 바닥에 닿았는지 인지
  useEffect(() => {
    if (loading) {
      return;
    }

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY
          >= document.documentElement.scrollHeight - 1) {
        if (!isFetching && hasMore) {
          fetchMoreProducts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, hasMore, loading]);

  // 추가 데이터 로딩
  const fetchMoreProducts = async () => {
    setIsFetching(true);
    const lastProductId = products[products.length - 1]?.id;

    setTimeout(async () => {
      try {
        const {data} = await axios.get(
            `${API_URL}/products?lastId=${lastProductId}`);

        if (data.products.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.products]);
        }
      } catch (error) {
        console.error("추가 데이터 로드 오류:", error);
      } finally {
        setIsFetching(false);
      }
    }, 300);
  };

  if (loading) {
    return <p> Loading ... </p>
  }

  return (
      <>
        <ProductList products={products}/>
        {isFetching && <p>Loading more products...</p>}
      </>
  );
};

export default MainPage;