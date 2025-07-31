// src/pages/ProjectsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../utils/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Fetching projects from:", `${API_BASE}/projects`);

    axios
      .get(`${API_BASE}/projects`) // no auth
      .then((res) => {
        console.log("✅ Projects loaded:", res.data);
        setProjects(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching projects:", err);
        setError(err.message || "Error fetching projects");
      });
  }, []);

  if (error) return <div>❌ Error: {error}</div>;
  if (!projects.length) return <div>Loading projects...</div>;

  return (
    <div>
      <h1>Projects Test Page</h1>
      <ul>
        {projects.map((p) => (
          <li key={p._id || p.name}>{p.name || JSON.stringify(p)}</li>
        ))}
      </ul>
    </div>
  );
}
