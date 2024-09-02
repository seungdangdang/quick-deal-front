import React, {useEffect, useState} from "react";
import "../styles/Header.css";
import {API_URL} from "../config";
import useAxiosPost from "../hooks/useAxiosPost";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {data, loading, postData} = useAxiosPost(
      (`${API_URL}/login`));

  useEffect(() => {
    const userid = localStorage.getItem('userid');
    if (userid) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await postData();
      if (data) {
        localStorage.setItem('userid', data.userId);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed', error)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    setIsLoggedIn(false);
  };

  return (
      <header className="header">
        <div className="header-left">QUICK DEAL</div>
        <div className="header-center">
          <input type="text" placeholder="Search..."
                 className="search-input"/>
        </div>
        <div className="header-right">
          {isLoggedIn ? (
              <button onClick={handleLogout}>로그아웃</button>
          ) : (
              <button onClick={handleLogin} disabled={loading}>
                {loading ? '로딩 중...' : '로그인'}
              </button>
          )}
          <span>MY</span>
        </div>
      </header>
  );
};

export default Header;