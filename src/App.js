import React, { useState } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Grid, Paper } from '@mui/material';
import './App.css';

import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import UserComments from './components/UserComments';
import LoginRegister from './components/LoginRegister';

const App = () => {
  // State quản lý tính năng nâng cao (mặc định là false)
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  
  // State quản lý user đang đăng nhập
  const [loggedInUser, setLoggedInUser] = useState(() => {
    // Khôi phục từ localStorage khi app load
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
  };

  // Protected Route wrapper - redirect to login if not logged in
  const ProtectedRoute = ({ children }) => {
    if (!loggedInUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Truyền state và hàm thay đổi state xuống TopBar */}
            <TopBar 
              advancedFeatures={advancedFeatures} 
              setAdvancedFeatures={setAdvancedFeatures}
              loggedInUser={loggedInUser}
              onLogout={handleLogout}
            />
          </Grid>
          
          <div className="main-topbar-buffer" />
          
          {loggedInUser ? (
            <>
              <Grid item sm={3}>
                <Paper className="main-grid-item" elevation={3}>
                  <UserList loggedInUser={loggedInUser} />
                </Paper>
              </Grid>
              
              <Grid item sm={9}>
                <Paper className="main-grid-item" elevation={3}>
                  <Routes>
                    <Route path="/users/:userId" element={
                      <ProtectedRoute><UserDetail /></ProtectedRoute>
                    } />
                    
                    {/* Dành cho trường hợp bấm xem ảnh bình thường từ danh sách */}
                    <Route 
                      path="/photos/:userId" 
                      element={
                        <ProtectedRoute>
                          <UserPhotos advancedFeatures={advancedFeatures} loggedInUser={loggedInUser} />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* MỚI THÊM: Dành cho trường hợp bấm từ bình luận sang (có đuôi photoId) */}
                    <Route 
                      path="/photos/:userId/:photoId" 
                      element={
                        <ProtectedRoute>
                          <UserPhotos advancedFeatures={advancedFeatures} loggedInUser={loggedInUser} />
                        </ProtectedRoute>
                      } 
                    />

                    <Route path="/comments/:userId" element={
                      <ProtectedRoute><UserComments /></ProtectedRoute>
                    } />

                    <Route path="/login" element={<Navigate to="/" replace />} />
                    
                    <Route path="/" element={
                      <div style={{ padding: '20px' }}>
                        Chào mừng đến với ứng dụng chia sẻ ảnh. Hãy chọn một người dùng bên trái!
                      </div>
                    } />
                  </Routes>
                </Paper>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Paper className="main-grid-item" elevation={3}>
                <Routes>
                  <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
                  {/* Mọi route khác redirect về login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Paper>
            </Grid>
          )}
          
        </Grid>
      </div>
    </HashRouter>
  );
}

export default App;