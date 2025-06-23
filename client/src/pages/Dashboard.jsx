// ✅ Final: Dashboard.jsx with Dark Background & Proper Spacing
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase";
import "../particles.css";
import "./Login.css";

export default function Dashboard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!resumeFile || !jobDescription) {
      setMessage("\u274C Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/match", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/result", {
        state: {
          matchScore: response.data.matchScore,
          matchedJobs: response.data.matchedJobs || [],
        },
      });
    } catch {
      setMessage("\u274C Failed to process resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-box larger-box"
      style={{ backgroundColor: "#1f1f1f", color: "white" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="title">Resume Screener</h2>

      {message && <p className="error-text">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label className="form-label">Upload Resume (or Drag & Drop)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="login-input" />

        <label className="form-label">Paste Job Description</label>
        <textarea
          rows="6"
          placeholder="Enter the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="login-input"
        ></textarea>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Matching..." : "Submit"}
        </button>
      </form>

      <button className="switch-mode" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
