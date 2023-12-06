import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import PostComponent from "./Components/Post";
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

    const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setFile(file);
    };

    const isDisabled = !file;

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <input onChange={onFileSelected} type="file" accept="image/*" />
                <input value={caption} onChange={(e) => setCaption(e.target.value)} type="text" />
                <button disabled={isDisabled} type="submit">
                    Submit
                </button>
            </form>
            {responseMessage !== "" && <h4>{responseMessage}</h4>}

            {posts.length !== 0 && <h2>Posts</h2>}
            <section style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
                {posts.length !== 0 && posts.map((post) => <PostComponent post={post} key={post.id} />)}
            </section>
        </>
    );
}

export default App;
