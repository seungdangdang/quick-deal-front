import React, {useEffect, useState} from "react";
import "../styles/Header.css";
import {API_URL} from "../config";
import useAxiosPost from "../hooks/useAxiosPost";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {data, loading, postData} = useAxiosPost((`${API_URL}/login`));

  useEffect(() => {
    const userid = localStorage.getItem('userid');
    if (userid) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('userid', data.userId);
      setIsLoggedIn(true);
    }
  }, [data]);

  const handleLogin = async () => {
    try {
      await postData();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    setIsLoggedIn(false);
  };

  return (<header className="header">
    <div className="header-left">
      <input
          type="text"
          placeholder="Search..."
          className="search-input"
      />
    </div>

    <div className="header-center">QUICK DEAL</div>

    <div className="header-right">
      {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>로그아웃</button>
            <button>마이페이지</button>
          </>
      ) : (
          <>
            <button onClick={handleLogin} disabled={loading}>
              {loading ? '로딩 중...' : '로그인'}
            </button>
            <button>회원가입</button>
          </>
      )}
    </div>
  </header>)

};
export default Header;
