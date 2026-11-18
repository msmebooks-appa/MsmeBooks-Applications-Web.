/**
 * Zero-dependency, high-performance canvas confetti celebration effect.
 * Perfect for checkout completions, trial signups, and milestone achievements.
 */

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  angle: number;
  angleSpeed: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'rect' | 'circle';
}

const BRAND_CONFETTI_COLORS = [
  '#0A4FD5', // MsmeBooks Blue
  '#84CC16', // Electric Lime
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EAB308', // Gold
];

export function triggerConfetti(durationMs: number = 3000): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Check if reduced motion is preferred
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
  } catch {
    // Ignore
  }

  // Create or reuse canvas
  let canvas = document.getElementById('msmebooks-confetti-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'msmebooks-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth * window.devicePixelRatio);
  const height = (canvas.height = window.innerHeight * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const particles: ConfettiParticle[] = [];
  const particleCount = 140;

  // Spawn confetti particles from two sides or center
  for (let i = 0; i < particleCount; i++) {
    const isLeft = i % 2 === 0;
    particles.push({
      x: isLeft ? window.innerWidth * 0.2 + (Math.random() * 50 - 25) : window.innerWidth * 0.8 + (Math.random() * 50 - 25),
      y: window.innerHeight * 0.45 + (Math.random() * 40 - 20),
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      vx: (isLeft ? 1 : -1) * (Math.random() * 12 + 6),
      vy: -(Math.random() * 14 + 10),
      angle: Math.random() * 360,
      angleSpeed: (Math.random() - 0.5) * 12,
      color: BRAND_CONFETTI_COLORS[Math.floor(Math.random() * BRAND_CONFETTI_COLORS.length)],
      alpha: 1,
      decay: Math.random() * 0.007 + 0.004,
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
    });
  }

  const startTime = performance.now();
  let animationFrameId: number;

  function render(time: number) {
    if (!ctx || !canvas) return;
    const elapsed = time - startTime;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42; // gravity
      p.vx *= 0.98; // air drag
      p.angle += p.angleSpeed;
      p.alpha -= p.decay;

      if (p.alpha > 0 && p.y < window.innerHeight + 50) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (activeParticles > 0 && elapsed < durationMs) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
