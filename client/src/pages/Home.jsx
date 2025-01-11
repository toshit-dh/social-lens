import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import ApiClient from "../../utils/axios";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 7 });

export default function Home() {
  const [inputType, setInputType] = useState("url");
  const [text,setText] = useState("")
  const [url, setUrl] = useState(
    "http://localhost:5000/demo-posts?userid=ageage&n=10"
  );
  const [csvFile, setCsvFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const randomID = uid.rnd();

    setUrl(`http://localhost:5000/demo-posts?userid=${randomID}&n=10`);
  }, []);
  const [userID, setUserID] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  // Fetch data based on input type
  const handleFetchData = () => {
    if (inputType === "url" && url) {
      fetchPosts();
    } else if (inputType === "csv" && csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parseCSV(text);

        const json_data = [];
        for (let i = 1; i < parsedData.length; i++) {
          const row = parsedData[i];

          if (row.length == 5) {
            json_data.push({
              user_id: row[0],
              post_type: row[1],
              likes: row[2],
              shares: row[3],
              comments: row[4],
            });
          }
        }

        setPosts(json_data);
      };
      reader.readAsText(csvFile);
    } else {
      alert("Please provide valid input to fetch data.");
    }
  };

  const fetchPosts = async () => {
    if (isFetching) return;

    try {
      const parsedUrl = new URL(url);

      const params = new URLSearchParams(parsedUrl.search);
      const userid = params.get("userid");

      if (!userid) return;
      else {
        setUserID(userid);
      }

      setIsFetching(true);

      const response = await fetch(url);

      const data = await response.json();
      setPosts(data.posts);
    } catch (e) {
      console.log(e);
      console.log("Error in fetching posts");
    }

    setIsFetching(false);
  };

  const parseCSV = (csvText) => {
    const rows = csvText.split("\n");
    return rows.map((row) => row.replace(/\r$/, "").split(","));
  };

  // Handle form submission and navigation
  const handleGenerateReport = () => {
    if (fetchedData) {
    } else {
      alert("Please fetch data before generating the report.");
    }
  };

  const analyze = async () => {
    try {
      setLoadingState(true)
      const response = await fetch(
        `http://localhost:5000/analyse-posts?userid=${userID}&ptype=image`,{
          method: "GET"
        }
      );      
      const data = await response.json();
      
      setLoadingState(false)
      setText(data.response.text)
    } catch (e) {
      console.log(e);
      console.log("Error in analyzing the data");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg flex flex-col justify-center items-center text-white">
        <div className="relative z-10 text-center bg-gray-900 p-8 rounded-xl shadow-lg opacity-95">
          <h1 className="text-4xl font-bold">Analytics Report</h1>
          {posts.length == 0 && (
            <>
              <p className="mt-4 text-gray-400">
                Provide Engagement Data or URL to generate a report.
              </p>

              {/* Input Type Selector */}
              <div className="mt-6">
                <div className="flex justify-center space-x-4">
                  <button
                    className={`py-2 px-4 rounded ${
                      inputType === "url"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700"
                    }`}
                    onClick={() => setInputType("url")}
                  >
                    URL Input
                  </button>
                  <button
                    className={`py-2 px-4 rounded ${
                      inputType === "csv"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700"
                    }`}
                    onClick={() => setInputType("csv")}
                  >
                    CSV Input
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="mt-6">
                {inputType === "url" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-2 rounded-md text-black"
                    />
                  </div>
                )}
                {inputType === "csv" && (
                  <div className="flex flex-col items-center mt-4">
                    <label className="relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                      Import CSV
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                    <p className="mt-2 text-white">
                      {csvFile ? csvFile.name : "No file chosen"}
                    </p>
                  </div>
                )}
                <div className="mt-6">
                  {((inputType === "url" && url) ||
                    (inputType === "csv" && csvFile)) && (
                    <button
                      onClick={handleFetchData}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Fetch Data
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          {text === "" ? (
            posts.length !== 0 && (
              <div className="mt-6 p-4 bg-gray-800 rounded-md overflow-scroll overflow-x-hidden max-h-80 w-full">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Fetched Data
                </h2>
                <div className="bg-gray-700 p-4 rounded-md text-white">
                  <JsonView
                    data={posts}
                    shouldExpandNode={allExpanded}
                    style={darkStyles}
                    className="w-96"
                  />
                </div>
              </div>
            )
          ) : (
            <div className="mt-6 p-4 bg-gray-800 rounded-md overflow-scroll overflow-x-hidden max-h-80 w-full">
              <h2 className="text-lg font-semibold text-white mb-4">
                Text Output
              </h2>
              <div className="bg-gray-700 p-4 rounded-md text-white">
                <p>
                  {
                    text != "" &&
                    text
                  } 
                </p>
              </div>
            </div>
          )}

          {/* Generate Report Button */}
          <div className="flex flex-row gap-8 mt-8 justify-center">
            <button
              onClick={() => {
                setInputType("url");
                setUrl("");
                setPosts([]);
                setText("")
                setCsvFile(null);
                setFetchedData(null);
              }}
              className="py-2 px-4 rounded-md bg-red-500 hover:bg-gray-600 text-white font-semibold"
            >
              Reset
            </button>
            <button
              onClick={analyze}
              className={`py-2 px-4 rounded-md font-semibold ${
                posts.length != 0
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={posts.length == 0}
            >
              {loadingState ? "Analyzing" : "Analyze"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
