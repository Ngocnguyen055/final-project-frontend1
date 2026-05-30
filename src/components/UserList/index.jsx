import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList ({ loggedInUser }) {
    // Tạo state để chứa danh sách user, ban đầu là mảng rỗng
    const [users, setUsers] = useState([]);

    // Dùng useEffect để gọi API khi component mount hoặc khi loggedInUser thay đổi
    useEffect(() => {
        if (!loggedInUser) {
            setUsers([]);
            return;
        }

        fetchModel("/user/list")
            .then(response => {
                // Cập nhật state với dữ liệu lấy được từ server
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            });
    }, [loggedInUser]); // Chạy lại khi login state thay đổi

    if (!loggedInUser) {
        return (
            <Typography variant="body1" style={{ padding: '16px' }}>
                Vui lòng đăng nhập để xem danh sách người dùng.
            </Typography>
        );
    }

    return (
      <div>
        {/* Nếu chưa có dữ liệu thì hiện chữ Đang tải... */}
        {users.length === 0 ? (
            <Typography variant="body1" style={{ padding: '16px' }}>
                Đang tải danh sách người dùng...
            </Typography>
        ) : (
            <List component="nav">
            {users.map((user) => (
                <React.Fragment key={user._id}>
                {/* Bỏ thuộc tính button component={Link} ở đây đi để tránh click nhầm */}
                <ListItem>
                    
                    {/* Phần 1: Tên người dùng - Bấm vào sẽ sang trang Chi tiết user */}
                    <Link to={`/users/${user._id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                        <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                    </Link>

                    {/* Phần 2: Bong bóng đếm số ảnh (Màu xanh) - Không có link */}
                    <span style={{ 
                        backgroundColor: 'green', 
                        color: 'white', 
                        borderRadius: '10px', 
                        padding: '2px 8px', 
                        marginLeft: '5px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                    }}>
                        {user.photo_count || 0}
                    </span>

                    {/* Phần 3: Bong bóng đếm số bình luận (Màu đỏ) - Bấm vào sẽ sang trang Bình luận */}
                    <Link to={`/comments/${user._id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ 
                            backgroundColor: 'red', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '2px 8px', 
                            marginLeft: '5px', 
                            fontSize: '12px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer' 
                        }}>
                            {user.comment_count || 0}
                        </span>
                    </Link>

                </ListItem>
                <Divider />
                </React.Fragment>
            ))}
            </List>
        )}
      </div>
    );
}

export default UserList;