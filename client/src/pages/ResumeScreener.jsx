// src/pages/ResumeScreener.jsx
import { useState } from "react";
import axios from "axios";

export default function ResumeScreener() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/match", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMatchScore(response.data.matchScore);
      setMatchedJobs(response.data.matchedJobs || []);
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadMatches = () => {
    const content = matchedJobs.map((job, i) => `${i + 1}. ${job.title} - ${job.description}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "matched_jobs.txt";
    link.href = url;
    link.click();
  };

  return (
    <div className="container">
      <h1>Resume Screener</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Resume:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Paste Job Description:</label>
          <textarea
            rows="6"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {matchScore !== null && (
        <div className="results">
          <h2>✅ Match Score: {matchScore}%</h2>
          {matchedJobs.length > 0 && (
            <>
              <h3>Recommended Jobs:</h3>
              <ul>
                {matchedJobs.map((job, index) => (
                  <li key={index}>
                    <strong>{job.title}</strong>: {job.description}
                  </li>
                ))}
              </ul>
              <button onClick={downloadMatches}>⬇ Download Jobs</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
