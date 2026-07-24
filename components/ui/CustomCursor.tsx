"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGGElement>(null);

  const trailRef = useRef<HTMLDivElement[]>([]);

  const startX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;

  const startY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

  const target = useRef({
    x: startX,
    y: startY,
  });

  const current = useRef({
    x: startX,
    y: startY,
  });

  const trail = useRef(
    Array.from({ length: 8 }, () => ({
      x: startX,
      y: startY,
    })),
  );

  const velocity = useRef(0);
  const rotation = useRef(0);

  const hovering = useRef(false);
  const clicking = useRef(false);

  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const down = () => {
      clicking.current = true;
    };

    const up = () => {
      clicking.current = false;
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;

      hovering.current = !!el?.closest(
        `
            a,
            button,
            input,
            textarea,
            select,
            summary,
            label,
            [role="button"],
            [data-cursor]
          `,
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    const animate = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      current.current.x += dx * 0.18;
      current.current.y += dy * 0.18;

      velocity.current = Math.sqrt(dx * dx + dy * dy);

      rotation.current += velocity.current * 0.18;

      // ---------- Cursor ----------
      if (cursorRef.current) {
        cursorRef.current.style.transform = `
          translate(${current.current.x}px, ${current.current.y}px)
          translate(-50%, -50%)
          scale(${clicking.current ? 0.82 : hovering.current ? 1.28 : 1})
        `;

        cursorRef.current.classList.toggle("cursor-hover", hovering.current);

        cursorRef.current.classList.toggle("cursor-clicking", clicking.current);
      }

      // ---------- Gear ----------
      if (gearRef.current) {
        gearRef.current.setAttribute(
          "transform",
          `rotate(${rotation.current} 20 20)`,
        );
      }

      // ---------- Trail ----------
      trail.current.unshift({
        x: current.current.x,
        y: current.current.y,
      });

      trail.current.length = 8;

      trailRef.current.forEach((node, i) => {
        if (!node) return;

        const p = trail.current[i];

        node.style.transform = `
          translate(${p.x}px, ${p.y}px)
          translate(-50%, -50%)
          scale(${1 - i * 0.08})
        `;

        node.style.opacity = `${0.45 - i * 0.05}`;
      });

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);

      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, []);
  return (
    <>
      {/* Trail */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRef.current[i] = el;
          }}
          className="cursor-trail-node"
        />
      ))}

      {/* Cursor */}
      <div ref={cursorRef} className="cursor-gear">
        <svg
          width="34"
          height="34"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g ref={gearRef}>
            {/* Symmetrical Gear */}
            <path
              className="gear-body"
              fill="currentColor"
              d="
                M20 4
                L22.4 4
                L23.2 7.4
                C24.5 7.8 25.8 8.3 26.9 9
                L29.9 7.2
                L32.8 10.1
                L31 13.1
                C31.7 14.2 32.2 15.5 32.6 16.8
                L36 17.6
                L36 22.4
                L32.6 23.2
                C32.2 24.5 31.7 25.8 31 26.9
                L32.8 29.9
                L29.9 32.8
                L26.9 31
                C25.8 31.7 24.5 32.2 23.2 32.6
                L22.4 36
                L17.6 36
                L16.8 32.6
                C15.5 32.2 14.2 31.7 13.1 31
                L10.1 32.8
                L7.2 29.9
                L9 26.9
                C8.3 25.8 7.8 24.5 7.4 23.2
                L4 22.4
                L4 17.6
                L7.4 16.8
                C7.8 15.5 8.3 14.2 9 13.1
                L7.2 10.1
                L10.1 7.2
                L13.1 9
                C14.2 8.3 15.5 7.8 16.8 7.4
                L17.6 4
                Z
              "
            />

            {/* Center hole */}
            <circle
              cx="20"
              cy="20"
              r="6.5"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="gear-hole"
            />

            {/* Hub */}
            <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.9" />
          </g>
        </svg>
      </div>
    </>
  );
}
