import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

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
      <Navbar />
      <div className="flex flex-col items-center justify-center p-5 text-white">
        <h1 className="mb-5 text-2xl tracking-wider">Bitlet</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center p-5 rounded-lg shadow-lg max-w-md w-full"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL"
            className="w-full p-2 mb-4 rounded-md text-black"
          />
          <button
            type="submit"
            className="w-full p-2 mb-4 rounded-md text-white cursor-pointer transition-all duration-300 ease-in-out"
            onMouseDown={(e) => {
              e.currentTarget.classList.add("bg-neon-blue", "shadow-neon-blue");
            }}
            onMouseUp={(e) => {
              e.currentTarget.classList.remove(
                "bg-neon-blue",
                "shadow-neon-blue"
              );
              e.currentTarget.classList.add("bg-neon-pink");
            }}
          >
            Shorten
          </button>
        </form>
        {shortenedUrl && (
          <p className="mt-5 text-lg text-gray-300 max-w-md break-words text-center">
            Shortened URL:{" "}
            <a
              href={`http://${shortenedUrl}`}
              className="text-neon-blue no-underline transition-colors duration-300 ease-in-out"
              onMouseOver={(e) => {
                e.currentTarget.classList.add("text-neon-pink");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("text-neon-pink");
                e.currentTarget.classList.add("text-neon-blue");
              }}
            >
              {shortenedUrl}
            </a>
          </p>
        )}
      </div>
    </>
  );
}

export default App;
