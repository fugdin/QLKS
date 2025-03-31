import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  EventNote as EventNoteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatCard {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const Dashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState('week');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    handleMenuClose();
  };

  const statCards: StatCard[] = [
    {
      title: 'Tổng doanh thu',
      value: '15,234,000 VNĐ',
      icon: <TrendingUpIcon />,
      color: '#1976d2',
      trend: {
        value: 12.5,
        isPositive: true,
      },
    },
    {
      title: 'Khách hàng mới',
      value: 45,
      icon: <PeopleIcon />,
      color: '#2e7d32',
      trend: {
        value: 8.2,
        isPositive: true,
      },
    },
    {
      title: 'Phòng đã đặt',
      value: '32/50',
      icon: <HotelIcon />,
      color: '#ed6c02',
      trend: {
        value: 5.3,
        isPositive: true,
      },
    },
    {
      title: 'Đơn đặt phòng',
      value: 28,
      icon: <EventNoteIcon />,
      color: '#9c27b0',
      trend: {
        value: 3.1,
        isPositive: true,
      },
    },
  ];

  const revenueData = [
    { name: 'T2', value: 4000 },
    { name: 'T3', value: 3000 },
    { name: 'T4', value: 5000 },
    { name: 'T5', value: 4500 },
    { name: 'T6', value: 6000 },
    { name: 'T7', value: 5500 },
    { name: 'CN', value: 7000 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tổng quan</Typography>
        <Box>
          <Chip
            label={timeRange === 'week' ? 'Tuần này' : timeRange === 'month' ? 'Tháng này' : 'Năm nay'}
            onClick={handleMenuClick}
            sx={{ cursor: 'pointer' }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeRangeChange('week')}>Tuần này</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('month')}>Tháng này</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('year')}>Năm nay</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                    {card.trend && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUpIcon
                          sx={{
                            color: card.trend.isPositive ? 'success.main' : 'error.main',
                            transform: card.trend.isPositive ? 'none' : 'rotate(180deg)',
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={card.trend.isPositive ? 'success.main' : 'error.main'}
                        >
                          {card.trend.value}% so với {timeRange === 'week' ? 'tuần trước' : timeRange === 'month' ? 'tháng trước' : 'năm trước'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { color: card.color } })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo thời gian
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 