import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchModel, { fetchModelPost } from '../../lib/fetchModelData';
import './styles.css';

// Nhận props từ App.js truyền xuống
function TopBar({ loggedInUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [contextString, setContextString] = useState("Vui lòng chọn một người dùng");

  useEffect(() => {
    if (!loggedInUser) {
      setContextString("Please Login");
      return;
    }

    if (currentPath.startsWith('/users/')) {
      const userId = currentPath.substring(7);
      fetchModel(`/user/${userId}`)
        .then(response => setContextString(`Chi tiết của: ${response.data.first_name} ${response.data.last_name}`))
        .catch(error => console.error(error));
    } else if (currentPath.startsWith('/photos/')) {
      const parts = currentPath.substring(8).split('/');
      const userId = parts[0];
      fetchModel(`/user/${userId}`)
        .then(response => setContextString(`Ảnh của: ${response.data.first_name} ${response.data.last_name}`))
        .catch(error => console.error(error));
    } else {
      setContextString("Vui lòng chọn một người dùng");
    }
  }, [currentPath, loggedInUser]);

  const handleLogout = async () => {
    try {
      await fetchModelPost("/admin/logout", {});
    } catch (error) {
      // Ignore errors - we're logging out anyway
    }
    onLogout();
    navigate("/login");
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" color="inherit">
              Nguyễn Chí Ngọc - B23DCCE073
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6" color="inherit">
              {contextString}
            </Typography>
          </Grid>

          <Grid item>
            {loggedInUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body1" color="inherit">
                  Hi {loggedInUser.first_name}
                </Typography>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  size="small"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Typography variant="body1" color="inherit">
                Please Login
              </Typography>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;