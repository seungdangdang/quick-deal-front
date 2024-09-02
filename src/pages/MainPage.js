import {API_URL} from "../config";
import ProductList from "../components/ProductList";
import useAxiosGet from "../hooks/useAxiosGet";

const MainPage = () => {
  const {data, loading} = useAxiosGet(`${API_URL}/products`);
  const products = data && Array.isArray(data.products) ? data.products : [];

  if (loading) {
    return <p> Loading ... </p>
  }

  return (
      <div>
        <ProductList products={products}/>
      </div>
  );
};

export default MainPage;