import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../css/dashboard.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [fonts, setFonts] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [previewFont, setPreviewFont] = useState(null);
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineHeight, setLineHeight] = useState(1.4);
  const [fontLoaded, setFontLoaded] = useState(false);

  /**
   * 📡 Fetch fonts — runs only when user & token exist
   */
  useEffect(() => {
    if (!user || !token) {
      console.warn("⏳ Waiting for user + token before fetching fonts...");
      return;
    }

    const fetchFonts = async () => {
      try {
        console.log("🔍 Fetching fonts with token:", token);

        const res = await axios.get(`${API_BASE_URL}/fonts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Fonts from API:", res.data);

        res.data.forEach((font, index) => {
          console.log(`--- FONT #${index + 1} ---`);
          console.log("🆔 ID:", font._id);
          console.log("📛 Name:", font.name);
          console.log("📜 Original URL:", font.originalDownloadUrl);
          console.log("📜 WOFF2 URL:", font.woff2DownloadUrl);
        });

        setFonts(res.data);
      } catch (err) {
        console.error("❌ Error fetching fonts:", err);
      }
    };

    fetchFonts();
  }, [user, token]);

  /**
   * 🎯 Load font dynamically for preview modal
   */
  useEffect(() => {
    if (!previewFont?.url) return;

    console.log(`🎯 Loading font from: ${previewFont.url}`);
    setFontLoaded(false);

    const fontFace = new FontFace(
      previewFont.fullName,
      `url(${previewFont.url})`
    );
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        setFontLoaded(true);
        console.log(`✅ Font ${previewFont.fullName} loaded`);
      })
      .catch((err) => {
        console.error(`❌ Failed to load font ${previewFont.fullName}:`, err);
      });
  }, [previewFont]);

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const sortedFonts = [...fonts].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    }

    const aStr = aVal?.toString().toLowerCase() || "";
    const bStr = bVal?.toString().toLowerCase() || "";
    if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Delete font
  const deleteFont = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/fonts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFonts((prev) => prev.filter((font) => font._id !== id));
    } catch (err) {
      console.error("❌ Error deleting font:", err);
    }
  };

  // Open preview modal (choose correct signed URL)
  const openPreview = (font) => {
    const fontName = font.family || font.fullName || font.name;

    setPreviewFont({
      ...font,
      url:
        font.previewUrl ||
        font.signedUrl ||
        font.woff2DownloadUrl ||
        font.originalDownloadUrl,
      fullName: fontName,
    });

    setPreviewText("The quick brown fox jumps over the lazy dog");
    setFontSize(48);
    setColor("#000000");
    setBgColor("#ffffff");
    setLineHeight(1.4);
  };

  const closePreview = () => {
    setPreviewFont(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Welcome, {user?.role === "admin" ? "Admin" : "User"}</h1>

        {/* Summary cards */}
        <div className="summary-cards">
          <div className="card">Total Fonts: {fonts.length}</div>
          <div className="card">Plan: Pro</div>
          <div className="card">Status: Active</div>
          <div className="card">Role: {user?.role}</div>
        </div>

        {/* Fonts table */}
        <div className="fonts-table">
          <h2>Recent Fonts</h2>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("fullName")}>
                  Full Name {getSortIndicator("fullName")}
                </th>
                <th onClick={() => handleSort("style")}>
                  Style {getSortIndicator("style")}
                </th>
                <th onClick={() => handleSort("weight")}>
                  Weight {getSortIndicator("weight")}
                </th>
                <th onClick={() => handleSort("description")}>
                  Description {getSortIndicator("description")}
                </th>
                <th onClick={() => handleSort("manufacturer")}>
                  Manufacturer {getSortIndicator("manufacturer")}
                </th>
                <th onClick={() => handleSort("license")}>
                  License {getSortIndicator("license")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  Created At {getSortIndicator("createdAt")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFonts.map((font) => (
                <tr key={font._id}>
                  <td>{font.fullName}</td>
                  <td>{font.style}</td>
                  <td>{font.weight}</td>
                  <td>{font.description}</td>
                  <td>{font.manufacturer}</td>
                  <td>{font.license}</td>
                  <td>{new Date(font.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => openPreview(font)}>Preview</button>{" "}
                    {/* WOFF2 download */}
  {font.woff2DownloadUrl && (
    <a
      href={font.woff2DownloadUrl}
      download={`${font.name || 'font'}.woff2`}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
    >
      WOFF2
    </a>
  )}

  {/* Original download */}
  {font.originalDownloadUrl && (
    <a
      href={font.originalDownloadUrl}
      download={`${font.name || 'font'}`}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Original
    </a>
                    )}
                    <button onClick={() => deleteFont(font._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Font preview modal */}
        {previewFont && (
          <div className="font-preview-overlay" onClick={closePreview}>
            <div
              className="font-preview-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preview-controls">
                <label>
                  Text:
                  <input
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                  />
                </label>
                <label>
                  Size:
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Text Color:
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </label>
                <label>
                  Background:
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </label>
                <label>
                  Line Height:
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={lineHeight}
                    onChange={(e) =>
                      setLineHeight(Number(e.target.value))
                    }
                  />
                </label>
                <button onClick={closePreview}>Close</button>
              </div>

              <div
                className="preview-area"
                style={{
                  fontFamily: `'${previewFont.fullName}'`,
                  fontSize: `${fontSize}px`,
                  color,
                  backgroundColor: bgColor,
                  lineHeight,
                  padding: "2rem",
                }}
              >
                {!fontLoaded ? "Loading font..." : previewText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
