import React, { useState } from "react";
import "./App.css";

function App(): JSX.Element {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your backend API to shorten the URL
    // For now, we'll just simulate it
    setShortenedUrl(`short.ly/${btoa(url).slice(0, 8)}`);
  };

  return (
    <>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your URL"
        />
        <button type="submit">Shorten</button>
      </form>
      {shortenedUrl && (
        <p>
          Shortened URL: <a href={`http://${shortenedUrl}`}>{shortenedUrl}</a>
        </p>
      )}
    </>
  );
}

export default App;
