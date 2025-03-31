import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Không có quyền truy cập
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Bạn không có quyền truy cập vào trang này.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default Unauthorized; 