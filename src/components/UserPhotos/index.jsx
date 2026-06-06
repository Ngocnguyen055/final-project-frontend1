import React, { useState, useEffect, useRef } from "react";
import { Typography, Divider, CircularProgress, Box, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import fetchModel, { fetchModelPost, backendBaseUrl } from "../../lib/fetchModelData";

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
        const date = new Date(dateString);
        const pad = (value) => String(value).padStart(2, '0');
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${hours}:${minutes}, ${day}/${month}/${year}`;
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
        return <Typography variant="h6" style={{ padding: 12, color: '#555' }}>Người dùng này chưa có ảnh nào.</Typography>;
    }

    // Hàm render 1 bức ảnh
    const renderPhoto = (photo) => (
        <div key={photo._id} style={{ background: '#fff', borderRadius: 4, border: '1px solid #ddd', overflow: 'hidden' }} ref={(el) => { photoRefs.current[photo._id] = el; }}>
            <img src={`${backendBaseUrl}/images/${photo.file_name}`} alt="User posted" style={{ width: '100%', display: 'block', background: '#f8f8f8', objectFit: 'contain', maxHeight: 420 }} />
            <div style={{ padding: '12px 14px' }}>
                <Typography variant="caption" style={{ fontSize: 13, color: '#333', marginBottom: 8 }}>Đăng lúc: {formatDate(photo.date_time)}</Typography>
                <Divider style={{ margin: '8px 0', backgroundColor: '#eee', height: 1 }} />
                <Typography variant="h6" style={{ fontSize: 16, margin: '8px 0' }}>Bình luận</Typography>
                {photo.comments && photo.comments.length > 0 ? (
                    <div style={{ marginTop: 8 }}>
                        {photo.comments.map((comment) => (
                            <div key={comment._id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ fontWeight: 600, color: '#222' }}>{comment.user.first_name} {comment.user.last_name}</div>
                                <div style={{ margin: '4px 0', color: '#333' }}>{comment.comment}</div>
                                <div style={{ fontSize: 12, color: '#555' }}>Lúc: {formatDate(comment.date_time)}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Typography variant="body2" color="textSecondary">Chưa có bình luận nào.</Typography>
                )}

                {loggedInUser && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <TextField placeholder="Viết bình luận..." variant="outlined" size="small" fullWidth value={commentTexts[photo._id] || ""} onChange={(e) => setCommentTexts(prev => ({ ...prev, [photo._id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(photo._id); } }} />
                        <Button variant="contained" color="primary" style={{ minWidth: 80, padding: '8px 12px' }} onClick={() => handleAddComment(photo._id)} disabled={!commentTexts[photo._id] || !commentTexts[photo._id].trim()}>Gửi</Button>
                    </div>
                )}
            </div>
        </div>
    );

    // Luôn hiển thị tất cả ảnh (không còn chế độ Advanced Features)
    return (
        <div style={{ maxWidth: 800, margin: '12px auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {photos.map(renderPhoto)}
        </div>
    );
}

export default UserPhotos;
