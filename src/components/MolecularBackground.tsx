import React, { useEffect, useRef } from 'react';

interface MolecularBackgroundProps {
  className?: string;
  density?: 'low' | 'normal' | 'high';
  opacity?: number;
}

interface AtomNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: 'C' | 'N' | 'O' | 'H' | '';
  ringId?: number;
  color: string;
}

interface Bond {
  from: number;
  to: number;
  isDouble?: boolean;
}

interface PulseParticle {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export const MolecularBackground: React.FC<MolecularBackgroundProps> = ({
  className = '',
  density = 'normal',
  opacity = 0.55,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive sizing
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    // Generate balanced benzene/hexagonal molecular clusters
    const nodes: AtomNode[] = [];
    const bonds: Bond[] = [];
    const pulses: PulseParticle[] = [];

    const numClusters = density === 'high' ? 6 : density === 'normal' ? 4 : 3;

    // Predefined colors for chemical elements
    const elementColors = {
      C: 'rgba(45, 212, 191, 0.4)', // Teal
      N: 'rgba(56, 189, 248, 0.45)', // Cyan
      O: 'rgba(244, 63, 94, 0.35)', // Soft Rose
      H: 'rgba(226, 232, 240, 0.25)', // Slate
      '': 'rgba(20, 184, 166, 0.35)',
    };

    // Helper to spawn a hexagonal benzene-like ring
    const spawnRing = (cx: number, cy: number, radius = 38, ringIndex: number) => {
      const startIdx = nodes.length;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const label = i === 1 ? 'N' : i === 4 ? 'O' : '';
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: label ? 4.5 : 2.5,
          label,
          ringId: ringIndex,
          color: elementColors[label] || elementColors[''],
        });
      }

      // Connect 6 bonds in ring with alternating double bonds
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        bonds.push({
          from: startIdx + i,
          to: startIdx + next,
          isDouble: i % 2 === 0,
        });
      }

      // Branch substituent atom off the ring
      const branchAngle = (Math.PI / 3) * (ringIndex % 6);
      const bx = cx + radius * 1.8 * Math.cos(branchAngle);
      const by = cy + radius * 1.8 * Math.sin(branchAngle);
      const branchIdx = nodes.length;
      nodes.push({
        x: bx,
        y: by,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: 3,
        label: 'C',
        color: elementColors.C,
      });
      bonds.push({ from: startIdx + (ringIndex % 6), to: branchIdx, isDouble: false });
    };

    // Distribute clusters across the canvas
    for (let c = 0; c < numClusters; c++) {
      const cx = (width * (c + 0.6)) / (numClusters + 0.2) + (Math.random() - 0.5) * 60;
      const cy = (height * 0.35) + (Math.random() - 0.5) * (height * 0.5);
      spawnRing(cx, cy, 34 + Math.random() * 8, c);
    }

    // Connect close clusters with faint bridging bonds
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 45 && dist < 110 && Math.random() < 0.18) {
          bonds.push({ from: i, to: j, isDouble: false });
        }
      }
    }

    // Initialize subtle traveling pulses
    for (let p = 0; p < Math.min(6, bonds.length); p++) {
      pulses.push({
        fromIdx: bonds[p].from,
        toIdx: bonds[p].to,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    // Render loop
    const render = () => {
      const currentWidth = canvas.clientWidth || width;
      const currentHeight = canvas.clientHeight || height;

      ctx.clearRect(0, 0, currentWidth, currentHeight);

      // Draw Bonds
      for (const bond of bonds) {
        const a1 = nodes[bond.from];
        const a2 = nodes[bond.to];
        if (!a1 || !a2) continue;

        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Secondary line for double bonds (aromatic representation)
        if (bond.isDouble) {
          const dx = a2.x - a1.x;
          const dy = a2.y - a1.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = (-dy / len) * 3.5;
          const ny = (dx / len) * 3.5;

          ctx.beginPath();
          ctx.moveTo(a1.x + nx * 0.7, a1.y + ny * 0.7);
          ctx.lineTo(a2.x + nx * 0.7, a2.y + ny * 0.7);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.18)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw Traveling Electron Pulses
      if (!prefersReducedMotion) {
        for (const pulse of pulses) {
          const a1 = nodes[pulse.fromIdx];
          const a2 = nodes[pulse.toIdx];
          if (!a1 || !a2) continue;

          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            // pick a random new bond
            const nextBond = bonds[Math.floor(Math.random() * bonds.length)];
            pulse.fromIdx = nextBond.from;
            pulse.toIdx = nextBond.to;
          }

          const px = a1.x + (a2.x - a1.x) * pulse.progress;
          const py = a1.y + (a2.y - a1.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.85)';
          ctx.shadowColor = '#2dd4bf';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Atoms / Nodes
      for (const node of nodes) {
        // Subtle drift movement
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 10 || node.x > currentWidth - 10) node.vx *= -1;
          if (node.y < 10 || node.y > currentHeight - 10) node.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Atom Symbol text
        if (node.label) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, node.x, node.y - 8);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [density]);

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
