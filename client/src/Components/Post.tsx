import { FC, useState } from "react";
import axios from "axios";

import { Post } from "../types/Post";

interface PostProps {
    post: Post;
}

const PostComponent: FC<PostProps> = ({ post }) => {
    const [deleteMessage, setDeleteMessage] = useState<string>("");

    const onDeletePost = async (id: number) => {
        const response = await axios.delete(`http://localhost:3000/api/posts/${id}`);

        setDeleteMessage(response.data.message);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h3>{post.caption}</h3>
            <img src={post.imageUrl} alt={post.imageName} width={300} />
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                <p>Total Likes: {post.totalLikes}</p>
                <p>Total Comments: {post.totalComments}</p>
            </div>
            <button onClick={() => onDeletePost(post.id)}>Delete Post</button>
            {deleteMessage !== "" && <h4>{deleteMessage}</h4>}
        </div>
    );
};

export default PostComponent;
