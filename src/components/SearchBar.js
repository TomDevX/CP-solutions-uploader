import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  return (
    <div>
      <input
        placeholder="Search by problem, author, language, tags, difficulty..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{width:'80%', margin:'8px 0'}}
      />
      <button onClick={() => onSearch(query)}>Search</button>
    </div>
  );
}

export default SearchBar;