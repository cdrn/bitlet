import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

function App(): JSX.Element {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortenedUrl("");

    try {
      const response = await fetch(
        `https://bitlet.xyz/shorten?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonResp = await response.json();
      const message = jsonResp.message;
      const shortenedUrl = message.split(": ")[1];
      setShortenedUrl(shortenedUrl);
    } catch (error) {
      setError("Failed to shorten the URL. Please try again.");
      console.error("Failed to shorten the URL:", error);
    } finally {
      setLoading(false);
    }
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
        {loading && <p className="mt-5 text-lg text-gray-300">Loading...</p>}
        {error && <p className="mt-5 text-lg text-red-500">{error}</p>}
        {shortenedUrl && (
          <p className="mt-5 text-lg text-gray-300 max-w-md break-words text-center">
            Shortened URL:{" "}
            <a
              href={`https://bitlet.xyz/resolve/${shortenedUrl}`}
              className="text-neon-blue no-underline transition-colors duration-300 ease-in-out"
              onMouseOver={(e) => {
                e.currentTarget.classList.add("text-neon-pink");
              }}
              onMouseOut={(e) => {
                e.currentTarget.classList.remove("text-neon-pink");
                e.currentTarget.classList.add("text-neon-blue");
              }}
            >
              {`https://bitlet.xyz/resolve/${shortenedUrl}`}
            </a>
          </p>
        )}
      </div>
    </>
  );
}

export default App;
