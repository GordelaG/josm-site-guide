'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Radar } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, #101626 0%, #0c1017 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      <div className="grid-drift" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

      <div
        className="glass-card"
        style={{
          maxWidth: '480px',
          padding: '2.5rem',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8', marginBottom: '1rem' }}>
          <Radar size={22} />
          <span className="label-technical" style={{ color: '#38bdf8' }}>404 &bull; NÃO ENCONTRADO</span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#fff', margin: '0 0 0.5rem 0' }}>
          404
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          A página ou rota que você tentou acessar não foi localizada no espaço aéreo deste sistema.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 800,
            padding: '0.75rem 1.4rem',
            borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0, 84, 219, 0.35)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Guia Principal</span>
        </Link>
      </div>
    </div>
  );
}
