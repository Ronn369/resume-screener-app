import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";  // ✅ Corrected import
import "../particles.css";
import "../pages/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch  {
      setError("❌ Google Sign-In failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="particles-bg"></div>

      <div className="login-box neon-glow">
        <h1 className="title">Welcome to the Future</h1>
        <p className="subtitle">Review your resume and get the job you deserve</p>

        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button className="google-btn" onClick={handleGoogleLogin}>
          🔐 Sign in with Google
        </button>

        <p className="switch-mode" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "No account? Sign up here" : "Already have an account? Login"}
        </p>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
