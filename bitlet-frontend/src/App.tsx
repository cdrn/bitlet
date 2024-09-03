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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: "#ffffff",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>URL Shortener</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#ffffff",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#ffffff",
              cursor: "pointer",
              transition:
                "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = "#00d9ff";
              e.currentTarget.style.boxShadow = "0 0 10px #00d9ff";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "#ff00ff";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Shorten
          </button>
        </form>
        {shortenedUrl && (
          <p
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "#e0e0e0",
              maxWidth: "400px",
              wordWrap: "break-word",
              textAlign: "center",
            }}
          >
            Shortened URL:{" "}
            <a
              href={`http://${shortenedUrl}`}
              style={{
                color: "#00d9ff",
                textDecoration: "none",
                transition: "color 0.3s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#ff00ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#00d9ff";
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
