'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Airport } from '../types/airport';
import { calculateAirportCounts } from '../lib/airports-service';
import { CheckCircle2, Clock, Hourglass, Radar, Sparkles } from 'lucide-react';

const InteractiveMap = dynamic(
  () => import('./InteractiveMap').then((mod) => mod.InteractiveMap),
  { ssr: false }
);

interface ProgressSectionProps {
  airports: Airport[];
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ airports }) => {
  const counts = useMemo(() => calculateAirportCounts(airports), [airports]);

  const donePercent = counts.total ? (counts.done / counts.total) * 100 : 0;
  const wipPercent = counts.total ? (counts.in_progress / counts.total) * 100 : 0;
  const pendingPercent = counts.total ? (counts.pending / counts.total) * 100 : 0;

  return (
    <section className="section" id="progresso" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem', background: 'transparent', position: 'relative', zIndex: 2 }}>
      <div className="section-inner">

        {/* Bento Stat Tiles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Tile 1: Concluídos */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #10b981',
            }}
          >
            <div>
              <span className="label-technical" style={{ color: '#10b981', display: 'block', marginBottom: '0.25rem' }}>
                Concluídos (v1.0+)
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {counts.done}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                {donePercent.toFixed(1)}% do total
              </span>
            </div>

            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
          </div>

          {/* Tile 2: Em Andamento */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #f59e0b',
            }}
          >
            <div>
              <span className="label-technical" style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>
                Em Andamento
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {counts.in_progress}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                {wipPercent.toFixed(1)}% em produção
              </span>
            </div>

            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Clock size={24} />
            </div>
          </div>

          {/* Tile 3: Na Fila */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #ef4444',
            }}
          >
            <div>
              <span className="label-technical" style={{ color: '#ef4444', display: 'block', marginBottom: '0.25rem' }}>
                Na Fila
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {counts.pending}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                {pendingPercent.toFixed(1)}% aguardando
              </span>
            </div>

            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <Hourglass size={24} />
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Segment Progress Bar */}
        <div
          style={{
            height: '10px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: `${donePercent}%`,
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              transition: 'width 0.6s ease',
            }}
          />
          <div
            style={{
              width: `${wipPercent}%`,
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              transition: 'width 0.6s ease',
            }}
          />
          <div
            style={{
              width: `${pendingPercent}%`,
              background: 'linear-gradient(90deg, #ef4444, #f87171)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        {/* Interactive Leaflet Map Wrapper */}
        <div style={{ width: '100%', position: 'relative' }}>
          <InteractiveMap airports={airports} />
        </div>
      </div>
    </section>
  );
};
