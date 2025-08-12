import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function SolutionUpload() {
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must login to upload!");
    await addDoc(collection(db, "solutions"), {
      problem,
      language,
      difficulty,
      tags: tags.split(",").map(tag => tag.trim()),
      code,
      author: user.displayName || user.email,
      uid: user.uid,
      timestamp: serverTimestamp()
    });
    setProblem(""); setLanguage(""); setDifficulty("Easy"); setTags(""); setCode("");
    alert("Solution Uploaded!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Solution</h2>
      <input value={problem} onChange={e => setProblem(e.target.value)} placeholder="Problem Name/ID" required />
      <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language (C++, Python...)" required />
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Paste your code here" required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default SolutionUpload;