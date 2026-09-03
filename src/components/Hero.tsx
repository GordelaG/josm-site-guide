'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Airport } from '../types/airport';

// Dynamically import LaptopMap to ensure client-side rendering
const LaptopMap = dynamic(
  () => import('./LaptopMap').then((mod) => mod.LaptopMap),
  { ssr: false }
);

interface HeroProps {
  airports: Airport[];
}

export const Hero: React.FC<HeroProps> = ({ airports }) => {
  const [isOpen, setIsOpen] = useState(false);
  const laptopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const keyLabels = [
    'Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Pwr',
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Del',
    'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
    'Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter', 'PgUp',
    'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', 'Up', 'PgDn'
  ];

  return (
    <section
      className="hero"
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #101626 0%, #0c1017 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '80px',
      }}
    >
      {/* Background Ambience: Grid Drift + Radar Sweep + Glowing Orbs */}
      <div className="grid-drift" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />
      
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '560px',
          height: '560px',
          pointerEvents: 'none',
          opacity: 0.45,
        }}
      >
        <div className="radar-rings" style={{ position: 'absolute', inset: 0, borderRadius: '50%' }} />
        <div className="radar-sweep" style={{ position: 'absolute', inset: 0, borderRadius: '50%' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '380px',
          height: '380px',
          background: 'rgba(0, 84, 219, 0.18)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Area */}
      <div className="hero-content" style={{ zIndex: 2, position: 'relative' }}>
        {/* Hero Title */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 4.4vw, 3.75rem)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            color: '#fff',
            marginBottom: '1.25rem',
          }}
        >
          JOSM
          <br />
          <span style={{ whiteSpace: 'nowrap' }}>Ground Layouts</span>
        </h1>

        <p
          style={{
            fontSize: '1.08rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '540px',
            margin: 0,
          }}
        >
          Do vetor ao radar. A forma definitiva de transformar traçados no JOSM em layouts de solo impecáveis para EuroScope e TopSky. Simples, fluido e incrivelmente preciso.
        </p>
      </div>

      {/* Visual Laptop Mockup with Interactive Map Inside */}
      <div className="hero-visual" id="hero-visual">
        <div
          ref={laptopRef}
          className={`laptop-mockup ${isOpen ? 'is-open' : 'is-closed'}`}
          id="laptop-mockup"
        >
          <div className="laptop-screen-bezel">
            <div className="laptop-lid-back" aria-hidden="true">
              <img src="/vatbrz_logowhite.png" alt="" />
            </div>
            <div className="laptop-camera"></div>
            <div className="mockup-image-container">
              <LaptopMap airports={airports} />
            </div>
          </div>
          <div className="laptop-base">
            <div className="laptop-keyboard" aria-hidden="true">
              {keyLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="laptop-key"
                  style={{ ['--key-delay' as any]: `${(idx % 14) * 35}ms` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="laptop-trackpad"></div>
            <div className="laptop-base-front">
              <div className="laptop-notch"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
