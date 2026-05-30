import React, { useState, useEffect } from "react";
import { Typography, Paper, Button, Divider, CircularProgress, Box } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
    const { userId } = useParams();
    
    // Thay vì gọi trực tiếp model, ta dùng state để lưu user data
    // Khởi tạo là null (giống như cách bạn làm trang chi tiết BlogDetail)
    const [user, setUser] = useState(null);

    // useEffect sẽ chạy lại mỗi khi userId trên URL thay đổi
    useEffect(() => {
        // Reset user về null khi đổi sang userId khác để hiển thị loading
        setUser(null); 
        
        fetchModel(`/user/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi tải chi tiết user:", error);
            });
    }, [userId]); 

    // Hiển thị trạng thái loading khi chưa có dữ liệu
    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress /> {/* Biểu tượng xoay xoay của MUI */}
                <Typography style={{ marginLeft: '15px' }}>Đang tải thông tin...</Typography>
            </Box>
        );
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
            <Typography variant="h4" gutterBottom>
                {user.first_name} {user.last_name}
            </Typography>
            
            <Divider style={{ marginBottom: '15px' }} />

            <Typography variant="body1" gutterBottom>
                <strong>Nghề nghiệp:</strong> {user.occupation}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Vị trí:</strong> {user.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Mô tả:</strong> {user.description}
            </Typography>

            <div style={{ marginTop: '20px' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to={`/photos/${user._id}`}
                >
                    Xem ảnh của {user.first_name}
                </Button>
            </div>
        </Paper>
    );
}

export default UserDetail;