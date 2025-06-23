import emailjs from "@emailjs/browser";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useState } from "react";
import "../pages/Login.css"; // Reuse same CSS styling

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchScore, matchedJobs } = location.state || {};
  const [userEmail, setUserEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const downloadFile = (format) => {
    if (!matchedJobs?.length) return;

    const content = matchedJobs
      .map((job, i) => `${i + 1}. ${job.title} - ${job.description}`)
      .join("\n\n");

    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "matched_jobs.txt";
      link.href = url;
      link.click();
    } else if (format === "pdf") {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 15, 20);
      doc.save("matched_jobs.pdf");
    }
  };

  const sendEmail = async () => {
    setEmailStatus("");
    if (!userEmail) {
      setEmailStatus("❌ Please enter a valid email address.");
      return;
    }

    const templateParams = {
      user_email: userEmail,
      match_score: matchScore + "%",
      job_list: matchedJobs
        .map((j) => `${j.title} - ${j.description}`)
        .join("\n\n"),
    };

    try {
      await emailjs.send(
        "service_uzkqy3r",
        "template_rqb02et",
        templateParams,
        "y7xO9k1vWw__hlV-I"
      );
      setEmailStatus("✅ Email sent successfully!");
    } catch (error) {
      console.error(error);
      setEmailStatus("❌ Failed to send email.");
    }
  };

  return (
    <div className="login-wrapper" style={{ backgroundColor: "#121212", color: "#f1f1f1" }}>
      <div className="login-box larger-box" style={{ backgroundColor: "#1e1e1e", color: "#f1f1f1" }}>
        <h2 className="title">🎯 Results</h2>
        {matchScore !== null ? (
          <>
            <p className="subtitle">
              Match Score: <strong>{matchScore}%</strong>
            </p>
            {matchedJobs.length > 0 ? (
              <>
                <h4 style={{ marginBottom: "0.5rem" }}>Recommended Jobs:</h4>
                <ul style={{ textAlign: "left", maxHeight: "300px", overflowY: "auto" }}>
                  {matchedJobs.map((job, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                      <strong>{job.title}</strong>: {job.description}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "1.5rem" }}>
                  <label>Select format: </label>
                  <select id="format" style={{ margin: "0 10px" }}>
                    <option value="txt">Text (.txt)</option>
                    <option value="pdf">PDF (.pdf)</option>
                  </select>
                  <button
                    className="login-btn"
                    onClick={() => downloadFile(document.getElementById("format").value)}
                  >
                    ⬇ Download Jobs
                  </button>
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <label htmlFor="emailInput">Send result to your email:</label>
                  <input
                    id="emailInput"
                    className="login-input"
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <button className="login-btn" onClick={sendEmail}>
                    📤 Send via Email
                  </button>
                  {emailStatus && <p className="error-text">{emailStatus}</p>}
                </div>
              </>
            ) : (
              <p>No matched jobs found.</p>
            )}
          </>
        ) : (
          <p>No results found.</p>
        )}
        <button className="switch-mode" onClick={() => navigate("/dashboard")}
          style={{ marginTop: "2rem" }}>
          🔁 Back to Dashboard
        </button>
      </div>
    </div>
  );
}
