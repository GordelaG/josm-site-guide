'use client';

import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterComparisonProps {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  icao: string;
  version: string;
  onOpenLightbox: (src: string, title: string) => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  beforeUrl,
  afterUrl,
  title,
  icao,
  version,
  onOpenLightbox,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {/* ── INTERACTIVE SLIDER FRAME ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(300px, 42vw, 470px)',
          borderRadius: '16px',
          overflow: 'hidden',
          /* Tactical aviation radar grid pattern */
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(15, 26, 48, 0.85) 0%, #030712 100%),
            linear-gradient(rgba(56, 189, 248, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 28px 28px, 28px 28px',
          border: isDragging
            ? '1px solid rgba(56, 189, 248, 0.8)'
            : isHovered
            ? '1px solid rgba(56, 189, 248, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isDragging
            ? '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 16px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          userSelect: 'none',
          touchAction: 'none',
          cursor: isDragging ? 'grabbing' : 'ew-resize',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        {/* BASE LAYER: AFTER (NOVO LAYOUT) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={afterUrl}
            alt="Novo Layout EuroScope"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* CLIPPED OVERLAY: BEFORE (LAYOUT ANTERIOR) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            src={beforeUrl}
            alt="Layout Anterior"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── FLOATING TACTICAL BADGES ── */}
        {/* Left Badge: ANTES */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            padding: '0.35rem 0.75rem',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px rgba(239, 68, 68, 0.2)',
            pointerEvents: 'none',
            zIndex: 5,
            opacity: sliderPos < 12 ? 0.15 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 10px #ef4444',
            }}
          />
          <span>ANTES &bull; LAYOUT ANTERIOR</span>
        </div>

        {/* Right Badge: DEPOIS */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            padding: '0.35rem 0.75rem',
            borderRadius: '8px',
            color: '#6ee7b7',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px rgba(16, 185, 129, 0.2)',
            pointerEvents: 'none',
            zIndex: 5,
            opacity: sliderPos > 88 ? 0.15 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
            }}
          />
          <span>DEPOIS &bull; NOVO EUROSCOPE</span>
        </div>

        {/* ── LUMINOUS LASER DIVIDER & DIAL ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: '2px',
            background: 'linear-gradient(180deg, rgba(56, 189, 248, 0) 0%, #38bdf8 15%, #ffffff 50%, #38bdf8 85%, rgba(56, 189, 248, 0) 100%)',
            boxShadow: '0 0 12px rgba(56, 189, 248, 1), 0 0 24px rgba(0, 84, 219, 0.8)',
            transform: 'translateX(-50%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {/* Circular Aerospace Dial */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #0d1829, #050b14)',
              border: '2px solid #38bdf8',
              boxShadow: isDragging
                ? '0 0 28px rgba(56, 189, 248, 1), 0 0 12px #fff, 0 8px 24px rgba(0, 0, 0, 0.95)'
                : '0 0 18px rgba(56, 189, 248, 0.75), 0 6px 20px rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              transformOrigin: 'center center',
              scale: isDragging ? '1.14' : isHovered ? '1.06' : '1',
            }}
          >
            {/* Dual Arrow Vector */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 7 3 12 8 17" />
              <polyline points="16 7 21 12 16 17" />
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeOpacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
