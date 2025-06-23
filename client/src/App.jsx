import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./particles.css";
import Result from "./pages/Result";


function App() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let particles = [];
    let mouse = { x: 0, y: 0 };

    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff6600"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const createParticle = (x, y) => {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 4 + 1;
      const radius = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        color,
        alpha: 1,
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;
        if (p.alpha <= 0) particles.splice(i, 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    };

    drawParticles();

    const handleMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      for (let i = 0; i < 5; i++) createParticle(mouse.x, mouse.y);

      const cursor = document.querySelector(".cursor-glow");
      if (cursor) {
        cursor.style.left = `${mouse.x}px`;
        cursor.style.top = `${mouse.y}px`;
      }
    };

    const handleClick = (e) => {
      for (let i = 0; i < 50; i++) {
        createParticle(e.clientX, e.clientY);
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("click", handleClick);

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("click", handleClick);
      document.body.removeChild(canvas);
      document.body.removeChild(glow);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<Result />} />  
      </Routes>
    </Router>
  );
}

export default App;
