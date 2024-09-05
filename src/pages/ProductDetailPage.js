import {useParams} from "react-router-dom";
import useAxiosGet from "../hooks/useAxiosGet";
import {API_URL} from "../config";
import ProductDetail from "../components/ProductDetail";

const ProductDetailPage = () => {
  const {productId} = useParams();
  const {data: product, loading, error} = useAxiosGet(
      `${API_URL}/products/${productId}`);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
      <>
        <ProductDetail product={product}/>
      </>
  );
};

export default ProductDetailPage;