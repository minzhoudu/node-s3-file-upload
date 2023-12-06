import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Post } from "./types/Post";

function App() {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => { 
        const getPosts = async () => {
            const res = await axios.get("http://localhost:3000/api/posts");
            setPosts(res.data.posts);
        };
        getPosts();
    }, []);

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        if (!file) return;
        formData.append("image", file);
        formData.append("caption", caption);

        const res = await axios.post("http://localhost:3000/api/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setResponseMessage(res.data.message);
        setCaption("");
        setFile(null);
    };

    const fileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setFile(file);
    };

    const isDisabled = !file;

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <input onChange={fileSelected} type="file" accept="image/*" />
                <input value={caption} onChange={(e) => setCaption(e.target.value)} type="text" />
                <button disabled={isDisabled} type="submit">
                    Submit
                </button>
            </form>
            {responseMessage !== "" && <h4>{responseMessage}</h4>}

            {posts.length && <h2>Posts</h2>}
            <section style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
                {posts.length &&
                    posts.map((post) => (
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
                        </div>
                    ))}
            </section>
        </>
    );
}

export default App;
