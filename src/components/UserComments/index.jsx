import React, { useState, useEffect } from 'react';
import { Typography, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel, { backendBaseUrl } from '../../lib/fetchModelData';

function UserComments() {
    // useParams giúp lấy cái ID từ trên thanh URL xuống
    const { userId } = useParams(); 
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Gọi API nãy mình viết ở backend
        fetchModel(`/commentsOfUser/${userId}`)
            .then(response => {
                setComments(response.data);
            })
            .catch(err => console.error("Lỗi khi tải bình luận:", err));
    }, [userId]); // Chạy lại mỗi khi click sang user khác (userId thay đổi)

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Bình luận của người dùng
            </Typography>
            <Divider />
            <List>
                {comments.map(c => (
                    // Thêm button, component={Link} và to={...} vào thẳng ListItem
                    // Thêm textDecoration và color để chữ không bị gạch chân màu xanh như link bình thường
                    <ListItem 
                        button 
                        component={Link} 
                        to={`/photos/${c.photo_owner_id}/${c.photo_id}`} 
                        key={c._id} 
                        alignItems="flex-start" 
                        style={{ borderBottom: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemAvatar>
                            {/* Đã bỏ thẻ <Link> ở đây đi để tránh lỗi lồng 2 thẻ Link vào nhau */}
                            <Avatar 
                                variant="square" 
                                src={`${backendBaseUrl}/images/${c.photo_file_name}`} 
                                style={{ width: 80, height: 80, marginRight: 15 }} 
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="body1">{c.comment}</Typography>}
                            secondary={
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(c.date_time).toLocaleString()}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
                
                {/* Nếu mảng rỗng tức là user này không đi comment dạo bao giờ */}
                {comments.length === 0 && (
                    <Typography variant="body1" style={{ marginTop: 15 }}>
                        Người dùng này chưa viết bình luận nào.
                    </Typography>
                )}
            </List>
        </div>
    );
}

export default UserComments;