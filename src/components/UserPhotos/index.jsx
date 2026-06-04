import React, { useState, useEffect, useRef } from "react";
import { Typography, Card, CardMedia, CardContent, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Box, Button, TextField } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel, { fetchModelPost, backendBaseUrl } from "../../lib/fetchModelData";
import "./styles.css";

// Nhận prop loggedInUser
function UserPhotos({ loggedInUser }) {
    // Lấy thêm photoId từ URL (cái mà đã cấu hình ở App.js)
    const { userId, photoId } = useParams(); 
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State cho comment input - mỗi ảnh có comment riêng
    const [commentTexts, setCommentTexts] = useState({});

    // Ref để scroll đến đúng ảnh khi bấm từ bình luận
    const photoRefs = useRef({});

    const fetchPhotos = () => {
        setIsLoading(true);
        
        fetchModel(`/photosOfUser/${userId}`)
            .then(response => {
                const fetchedPhotos = response.data;
                setPhotos(fetchedPhotos);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải ảnh:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPhotos();
    }, [userId, photoId]);

    // Scroll đến ảnh cụ thể khi có photoId và photos đã load xong
    useEffect(() => {
        if (photoId && photos.length > 0 && !isLoading) {
            // Đợi DOM render xong rồi mới scroll
            setTimeout(() => {
                const targetRef = photoRefs.current[photoId];
                if (targetRef) {
                    targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Thêm hiệu ứng highlight nhấp nháy để dễ nhận biết
                    targetRef.style.outline = '3px solid #1976d2';
                    targetRef.style.outlineOffset = '4px';
                    targetRef.style.borderRadius = '8px';
                    // Bỏ highlight sau 2 giây
                    setTimeout(() => {
                        targetRef.style.outline = 'none';
                    }, 2000);
                }
            }, 300);
        }
    }, [photoId, photos, isLoading]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleAddComment = async (targetPhotoId) => {
        const commentText = commentTexts[targetPhotoId] || "";
        if (!commentText.trim()) return;

        try {
            await fetchModelPost(`/commentsOfPhoto/${targetPhotoId}`, {
                comment: commentText,
            });
            // Clear the comment input
            setCommentTexts(prev => ({ ...prev, [targetPhotoId]: "" }));
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

    // Hàm render 1 bức ảnh
    const renderPhoto = (photo) => (
        <Card 
            key={photo._id} 
            style={{ marginBottom: '20px' }}
            ref={(el) => { photoRefs.current[photo._id] = el; }}
        >
            <CardMedia
                component="img"
                image={`${backendBaseUrl}/images/${photo.file_name}`} 
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

    // Luôn hiển thị tất cả ảnh (không còn chế độ Advanced Features)
    return (
        <div className="photos-container">
            {photos.map(renderPhoto)}
        </div>
    );
}

export default UserPhotos;