import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

function List(): JSX.Element {
  const [urlMappings, setUrlMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch the URL mappings from the backend API
    const fetchUrlMappings = async () => {
      try {
        const response = await fetch("https://bitlet.fly.dev/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("response", response);
        const data: Record<string, string> = (await response.json())?.data;
        setUrlMappings(data);
      } catch (error) {
        console.error("Failed to fetch URL mappings:", error);
      }
    };

    fetchUrlMappings();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>URLs</h1>
        <ul>
          {Object.entries(urlMappings).map((shortened, originalUrl) => (
            <li key={shortened}>
              <a href={shortened}>{originalUrl}</a> - {shortened}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default List;
