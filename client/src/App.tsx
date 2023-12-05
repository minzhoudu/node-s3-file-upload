import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        if (!file) return;
        formData.append("image", file);
        formData.append("caption", caption);

        await axios.post("http://localhost:3000/api/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
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
        </>
    );
}

export default App;
