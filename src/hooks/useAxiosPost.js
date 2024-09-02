import { useState } from "react";
import axios from "axios";

const useAxiosPost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (postData) => {
    setLoading(true);
    try {
      const response = await axios.post(url, postData);
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default useAxiosPost;
