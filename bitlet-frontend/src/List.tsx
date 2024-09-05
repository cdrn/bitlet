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
        const jsonResp = await response.json();
        const urls = jsonResp?.urls;
        setUrlMappings(urls);
      } catch (error) {
        console.error("Failed to fetch URL mappings:", error);
      }
    };

    fetchUrlMappings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center text-neon-blue mb-8">
          URLs
        </h1>
        <ul className="flex flex-col gap-4">
          {Object.entries(urlMappings).map(([shortened, originalUrl]) => (
            <li
              key={shortened}
              className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg"
            >
              <span className="text-white">
                <a
                  href={originalUrl}
                  className="mr-5 text-neon-blue hover:text-neon-pink transition-colors duration-300"
                >
                  {originalUrl}
                </a>
              </span>
              <span className="text-gray-400">{shortened}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default List;
