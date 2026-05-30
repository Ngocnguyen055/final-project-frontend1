import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Grid, Checkbox, FormControlLabel, Button, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchModel, { fetchModelPost, fetchModelUpload } from '../../lib/fetchModelData';
import './styles.css';

// Nhận props từ App.js truyền xuống
function TopBar({ advancedFeatures, setAdvancedFeatures, loggedInUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [contextString, setContextString] = useState("Vui lòng chọn một người dùng");
  const fileInputRef = useRef(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetchModelUpload("/photos/new", formData);
      setUploadSuccess(true);
      // Navigate to the user's photos page to see the new photo
      navigate(`/photos/${loggedInUser._id}`);
    } catch (error) {
      alert("Error uploading photo: " + error.message);
    }

    // Reset file input
    event.target.value = "";
  };

  return (
    <>
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5" color="inherit">
                Photo Sharing App
              </Typography>
            </Grid>

            {loggedInUser && (
              <Grid item>
                {/* Checkbox bật/tắt Advanced Features */}
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={advancedFeatures} 
                      onChange={(e) => setAdvancedFeatures(e.target.checked)} 
                      style={{ color: 'white' }} 
                    />
                  }
                  label="Enable Advanced Features"
                />
              </Grid>
            )}

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
                    onClick={handleAddPhoto}
                    size="small"
                  >
                    Add Photo
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelected}
                  />
                  
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

      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setUploadSuccess(false)}>
          Photo uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default TopBar;