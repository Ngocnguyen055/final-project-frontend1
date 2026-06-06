import React, { useState, useEffect } from "react";
import {  ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

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
            <Typography variant="body1" style={{ padding: 16, color: '#444' }}>
                Vui lòng đăng nhập để xem danh sách người dùng.
            </Typography>
        );
    }

    return (
      <div>
        {/* Nếu chưa có dữ liệu thì hiện chữ Đang tải... */}
        {users.length === 0 ? (
            <Typography variant="body1" style={{ padding: 16, color: '#444' }}>Đang tải danh sách người dùng...</Typography>
        ) : (
            <div style={{ maxWidth: 720, margin: '12px auto', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {users.map((user) => (
                    <React.Fragment key={user._id}>
                        <ListItem style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                            <Link to={`/users/${user._id}`} style={{ flex: 1, color: '#111', textDecoration: 'none', fontWeight: 600 }}>
                                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                            </Link>

                            <span style={{ display: 'inline-block', minWidth: 30, textAlign: 'center', padding: '4px 8px', borderRadius: 12, color: '#fff', fontSize: 12, fontWeight: 700, marginLeft: 8, background: 'green' }}>{user.photo_count || 0}</span>
                            <Link to={`/comments/${user._id}`} style={{ textDecoration: 'none' }}>
                                <span style={{ display: 'inline-block', minWidth: 30, textAlign: 'center', padding: '4px 8px', borderRadius: 12, color: '#fff', fontSize: 12, fontWeight: 700, marginLeft: 8, background: 'red' }}>{user.comment_count || 0}</span>
                            </Link>
                        </ListItem>
                        <hr style={{ height: 1, background: '#eee', border: 'none', margin: 0 }} />
                    </React.Fragment>
                ))}
            </div>
        )}
      </div>
    );
}

export default UserList;
