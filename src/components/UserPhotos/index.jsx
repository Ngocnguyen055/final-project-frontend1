import React, { useState, useEffect } from "react";
import { Typography, Card, CardMedia, CardContent, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Box, Button, TextField } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel, { fetchModelPost } from "../../lib/fetchModelData";
import "./styles.css";

// Nhận prop advancedFeatures và loggedInUser
function UserPhotos({ advancedFeatures, loggedInUser }) {
    // 1. Lấy thêm photoId từ URL (cái mà bạn đã cấu hình ở App.js)
    const { userId, photoId } = useParams(); 
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State để nhớ xem đang xem bức ảnh thứ mấy
    const [currentIndex, setCurrentIndex] = useState(0);

    // State cho comment input - mỗi ảnh có comment riêng
    const [commentTexts, setCommentTexts] = useState({});

    const fetchPhotos = () => {
        setIsLoading(true);
        
        fetchModel(`/photosOfUser/${userId}`)
            .then(response => {
                const fetchedPhotos = response.data;
                setPhotos(fetchedPhotos);

                // 2. LOGIC QUAN TRỌNG: Tìm vị trí của ảnh dựa trên photoId
                if (photoId && fetchedPhotos.length > 0) {
                    const index = fetchedPhotos.findIndex(p => p._id === photoId);
                    // Nếu tìm thấy ảnh, nhảy đến index đó, nếu không thì về 0
                    setCurrentIndex(index !== -1 ? index : 0);
                } else {
                    // Nếu không có photoId trên URL (vào xem ảnh bình thường), reset về 0
                    setCurrentIndex(0);
                }

                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải ảnh:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPhotos();
    }, [userId, photoId]); // 3. Thêm photoId vào dependency để nó chạy lại khi ID ảnh thay đổi

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleAddComment = async (photoId) => {
        const commentText = commentTexts[photoId] || "";
        if (!commentText.trim()) return;

        try {
            await fetchModelPost(`/commentsOfPhoto/${photoId}`, {
                comment: commentText,
            });
            // Clear the comment input
            setCommentTexts(prev => ({ ...prev, [photoId]: "" }));
            // Reload photos to show the new comment
            fetchPhotos();
        } catch (error) {
            alert("Error adding comment: " + error.message);
        }
    };

    if (isLoading) {
         return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (photos.length === 0) {
        return <Typography variant="h6">Người dùng này chưa có ảnh nào.</Typography>;
    }

    // Hàm render 1 bức ảnh (giữ nguyên logic của bạn + thêm comment form)
    const renderPhoto = (photo) => (
        <Card key={photo._id} style={{ marginBottom: '20px' }}>
            <CardMedia
                component="img"
                image={`/images/${photo.file_name}`} 
                alt="User posted"
                style={{ maxHeight: '500px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
            />
            <CardContent>
                <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Đăng lúc: {formatDate(photo.date_time)}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="h6">Bình luận</Typography>
                {photo.comments && photo.comments.length > 0 ? (
                    <List>
                        {photo.comments.map((comment) => (
                            <React.Fragment key={comment._id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar component={Link} to={`/users/${comment.user._id}`} style={{ textDecoration: 'none' }}>
                                            {comment.user.first_name[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" component={Link} to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                {comment.user.first_name} {comment.user.last_name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    {comment.comment}
                                                </Typography>
                                                <br />
                                                <Typography variant="caption" color="textSecondary">
                                                    {formatDate(comment.date_time)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="textSecondary">Chưa có bình luận nào.</Typography>
                )}

                {/* Add Comment Form */}
                {loggedInUser && (
                    <Box mt={2} display="flex" gap={1} alignItems="flex-start">
                        <TextField
                            placeholder="Write a comment..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            maxRows={3}
                            value={commentTexts[photo._id] || ""}
                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [photo._id]: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment(photo._id);
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddComment(photo._id)}
                            disabled={!commentTexts[photo._id] || !commentTexts[photo._id].trim()}
                        >
                            Send
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    // Nếu bật Advanced Features -> Hiển thị 1 ảnh và có nút bấm
    if (advancedFeatures) {
        return (
            <div className="photos-container">
                {/* Đảm bảo currentIndex không vượt quá phạm vi mảng */}
                {photos[currentIndex] && renderPhoto(photos[currentIndex])}
                
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button 
                        variant="contained" 
                        disabled={currentIndex === 0} 
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                    >
                        Quay lại 
                    </Button>
                    <Button 
                        variant="contained" 
                        disabled={currentIndex === photos.length - 1} 
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                    >
                        Tiếp theo 
                    </Button>
                </Box>
            </div>
        );
    }

    // Chế độ bình thường: Hiện tất cả
    return (
        <div className="photos-container">
            {photos.map(renderPhoto)}
        </div>
    );
}

export default UserPhotos;