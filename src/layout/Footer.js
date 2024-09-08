import React from 'react';
import {Grid, Typography, Link, Box, Divider} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
      <Box
          sx={{
            backgroundColor: '#f8f9fa',
            padding: '20px 0',
            borderTop: '1px solid #e0e0e0',
            width: '100%',
          }}
      >
        <Box
            sx={{
              maxWidth: 'lg',
              margin: '0 auto',
            }}
        >
          {/* 상단 링크 섹션 */}
          <Box sx={{marginBottom: '20px'}}>
            <Grid
                container
                spacing={2}
                x={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}>
              {[
                '회사소개',
                'Investor Relations',
                '인재채용',
                '입점/제휴문의',
                '공지사항',
                '고객의 소리',
                '이용약관',
                '개인정보 처리방침',
              ].map((text, index) => (
                  <Grid item key={index}>
                    <Link
                        href="#"
                        sx={{
                          color: '#000000',
                          textDecoration: 'none',
                          marginRight: '15px',
                          fontSize: '0.875rem',
                          '&:hover': {textDecoration: 'underline'},
                        }}
                    >
                      {text}
                    </Link>
                  </Grid>
              ))}
            </Grid>
          </Box>
          <Divider sx={{margin: '1px 0', backgroundColor: '#ddd'}}/>

          {/* 고객센터 및 회사 정보 섹션 */}
          <Box sx={{padding: '20px 0'}}>
            <Grid container spacing={4}>
              {/* 고객센터 */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  고객센터
                </Typography>
                <Typography variant="body1" sx={{
                  color: '#666',
                  lineHeight: 1.6,
                  fontSize: '0.875rem'
                }}>
                  전화: 02)0000-0000
                  <br/>
                  이메일: help@quickdeal.com
                  <br/>
                  운영 시간: 평일 9:00 - 18:00
                </Typography>
              </Grid>

              {/* 회사 정보 */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  회사 정보
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#666',
                  lineHeight: 1.6,
                  fontSize: '0.875rem'
                }}>
                  주소: 서울시 관악구 00대로 158
                  <br/>
                  사업자 등록번호: 123-45-67890
                  <br/>
                  통신판매업신고: 2024-서울관악-1580
                  <br/>
                  <Link
                      href="#"
                      sx={{
                        color: '#000000',
                        textDecoration: 'none',
                        '&:hover': {textDecoration: 'underline'},
                      }}
                  >
                    사업자 정보 확인 &gt;
                  </Link>
                </Typography>
              </Grid>

              {/* 소셜 미디어 및 인증 */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  소셜 미디어
                </Typography>
                <Box display="flex" alignItems="center">
                  <GitHubIcon/>
                  <Link
                      href="https://github.com/seungdangdang"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: '#000000',
                        textDecoration: 'none',
                        marginLeft: '8px',
                        '&:hover': {textDecoration: 'underline'},
                      }}
                  >
                    github
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
  );
};

export default Footer;
