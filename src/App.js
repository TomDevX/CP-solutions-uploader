import React, { useState } from "react";
import SolutionUpload from "./components/SolutionUpload";
import SolutionList from "./components/SolutionList";
import SearchBar from "./components/SearchBar";
import Auth from "./components/Auth";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Auth />
      <SolutionUpload />
      <SearchBar onSearch={setSearch} />
      {search ? (
        <SolutionList search={search} />
      ) : (
        <SolutionList />
      )}
      <ProfilePage />
    </div>
  );
}

export default App;