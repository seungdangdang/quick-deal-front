import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, InputBase, Box, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { API_URL } from "../config";

import useAxiosPost from "../hooks/useAxiosPost";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data, loading, postData } = useAxiosPost(`${API_URL}/login`);

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
    window.dispatchEvent(new Event('logout'));
    localStorage.removeItem("userid");
    setIsLoggedIn(false);
  };

  return (
      <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#333', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box component="img" src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" sx={{ height: 40, marginRight: 2 }} />

          {/* 검색창 */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* 로그인/로그아웃 버튼 */}
          {isLoggedIn ? (
              <>
                <Button
                    onClick={handleLogout}
                    variant="text"
                    sx={{ color: 'black', marginRight: 1 }}
                >
                  로그아웃
                </Button>
                <Button
                    variant="text"
                    sx={{ color: 'black', marginRight: 1 }}
                >
                  마이페이지
                </Button>
              </>
          ) : (
              <>
                <Button
                    onClick={handleLogin}
                    variant="text"
                    color="secondary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{ marginRight: 1 }}
                >
                  {loading ? '로딩 중...' : '로그인'}
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                >
                  회원가입
                </Button>
              </>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default Header;
