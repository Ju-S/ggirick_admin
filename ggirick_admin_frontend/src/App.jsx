import {useState} from "react";

export default function App() {
    const [test, setTest] = useState("");

    return(
        <div>
            <button type="button" onClick={() => setTest("test")}>test</button>
            <p>{test}</p>
        </div>
    );
}