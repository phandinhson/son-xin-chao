"use client";
import { useEffect, useRef } from "react";

// ─── HeroCanvas — particle animation tách riêng để lazy-load ─────────────────
// Tối ưu O(n²) → bỏ Math.sqrt hoàn toàn, dùng squared distance
// 60 particles × 59 / 2 = 1770 phép tính/frame × 60fps = 106,200 sqrt/giây → 0
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Giảm particles trên mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 60;
    const maxDist = 120;
    const maxDistSq = maxDist * maxDist; // 14 400 — dùng thay sqrt

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; opacity: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connecting lines — KHÔNG dùng Math.sqrt
      // Dùng distSq / maxDistSq cho cả test khoảng cách lẫn tính opacity
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // 1 - distSq/maxDistSq thay vì 1 - dist/maxDist — không cần sqrt
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.15 * (1 - distSq / maxDistSq)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    // Debounce 200ms: tránh canvas resize liên tục trong lúc kéo cửa sổ
    // → giảm forced layout recalculations trên main thread
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none hidden md:block"
      aria-hidden="true"
    />
  );
}
