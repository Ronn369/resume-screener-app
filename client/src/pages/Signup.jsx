// src/pages/Signup.jsx
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onSignup(userCredential.user);           // ✅ Set user in App.jsx
      navigate("/dashboard");                  // ✅ Redirect to Dashboard
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <p onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        Already have an account? Login
      </p>
    </div>
  );
}
