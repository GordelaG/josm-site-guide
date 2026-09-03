'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Rss, HelpCircle, Radio } from 'lucide-react';

interface DiscordRssModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleUpdate?: {
    icao: string;
    airportName: string;
    version: string;
    title: string;
    description: string;
    author?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    date?: string;
  };
}

export const DiscordRssModal: React.FC<DiscordRssModalProps> = ({
  isOpen,
  onClose,
  sampleUpdate,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFeedUrl(`${window.location.origin}/feed.xml`);
    }
  }, []);

  if (!isOpen) return null;

  const currentUpdate = {
    icao: 'SBSJ',
    airportName: 'Aeroporto de São José dos Campos',
    version: 'v1.0.0',
    title: 'Atualização geral do layout de solo de São José dos Campos SBSJ',
    description:
      'Atualizado o layout de solo do Aeroporto de São José dos Campos (SBSJ), com revisão das posições de parada, pistas de táxi, novas linhas de sinalização horizontal e melhorias gerais de alinhamento no cenário.',
    author: 'Aillton Zamboti',
    date: '2026-09-01T21:09:00.000Z',
  };

  const handleCopyFeed = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fade-up 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          background: 'linear-gradient(165deg, rgba(13, 20, 36, 0.98) 0%, rgba(6, 10, 18, 0.99) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 84, 219, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER (AEROSPACE THEME) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.35rem 1.75rem',
            background: 'linear-gradient(90deg, rgba(0, 84, 219, 0.25) 0%, rgba(13, 20, 36, 0.5) 100%)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
            position: 'relative',
          }}
        >
          {/* Glowing Top Accent Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '1.75rem',
              right: '1.75rem',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #38bdf8, #0054DB, transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0, 84, 219, 0.25)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(0, 84, 219, 0.4)',
                color: '#38bdf8',
              }}
            >
              <Rss size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    background: 'rgba(0, 84, 219, 0.25)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '5px',
                    letterSpacing: '0.04em',
                  }}
                >
                  FEED RSS &amp; DISCORD
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                  Feed RSS de Atualizações
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
                Conecte o bot MonitoRSS ao seu Discord para receber automaticamente as notas de novos lançamentos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.45rem',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── MODAL SCROLLABLE BODY ── */}
        <div
          className="no-scrollbar"
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* RSS FEED URL & TUTORIAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                URL do Feed RSS para o MonitoRSS:
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.55)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '0.45rem 0.55rem 0.45rem 1rem',
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.85rem',
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {feedUrl}
                </span>

                <button
                  type="button"
                  onClick={handleCopyFeed}
                  style={{
                    background: copied ? '#10b981' : 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: copied ? '0 0 16px rgba(16, 185, 129, 0.5)' : '0 0 16px rgba(0, 84, 219, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
            </div>

            {/* MonitoRSS step-by-step */}
            <div
              style={{
                background: 'rgba(0, 84, 219, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <HelpCircle size={16} color="#38bdf8" />
                <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Como conectar ao Discord:</strong>
              </div>

              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                <li>Adicione o bot <strong>MonitoRSS</strong> no seu servidor do Discord.</li>
                <li>No canal desejado, use o comando <code>/rss add</code> (ou <code>rss add</code>).</li>
                <li>Cole a URL do feed: <code style={{ color: '#38bdf8' }}>{feedUrl}</code>.</li>
                <li>O bot notificará o canal automaticamente com as notas de cada versão e link direto para o comparativo interativo no portal!</li>
              </ol>
            </div>
          </div>

          {/* ── SIMULADOR DE EMBED DO DISCORD ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Prévia da Notificação no Discord:
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Simulação da mensagem exibida no seu canal via MonitoRSS
              </span>
            </div>

            {/* Discord Dark Theme Box */}
            <div
              style={{
                background: '#313338',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'gg sans, "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                display: 'flex',
                gap: '1rem',
              }}
            >
              {/* Bot Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#0054DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <Radio size={20} color="#fff" />
              </div>

              {/* Message Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                {/* Bot Author Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f2f3f5' }}>VATBRZ Operações</span>
                  <span
                    style={{
                      background: '#5865F2',
                      color: '#fff',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      borderRadius: '4px',
                      padding: '0.1rem 0.35rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    BOT
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#949ba4' }}>Hoje às 14:32</span>
                </div>

                {/* 1. EMBED PRINCIPAL (RÉPLICA EXATA DO DISCORD) */}
                <div
                  style={{
                    background: '#2b2d31',
                    borderLeft: '4px solid #0054DB',
                    borderRadius: '4px',
                    padding: '0.85rem 1rem',
                    maxWidth: '560px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  {/* Title (Blue link, underlined) */}
                  <a
                    href={`/atualizacoes#update-${currentUpdate.icao}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#00a8fc',
                      textDecoration: 'underline',
                      lineHeight: 1.35,
                      display: 'inline-block',
                    }}
                  >
                    [{currentUpdate.icao} {currentUpdate.version}] {currentUpdate.title}
                  </a>

                  {/* Description & CTA (Pure markdown formatting, no colored boxes) */}
                  <div style={{ fontSize: '0.875rem', color: '#dbdee1', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <p style={{ margin: 0 }}>{currentUpdate.description}</p>

                    <div>
                      <div style={{ fontWeight: 700, color: '#f2f3f5', marginBottom: '0.15rem' }}>
                        ✨ Comparativo Interativo do Solo:
                      </div>
                      <div style={{ color: '#dbdee1' }}>
                        Veja as alterações detalhadas com o slider interativo no portal:
                      </div>
                      <div style={{ marginTop: '0.15rem' }}>
                        <span>👉 </span>
                        <a
                          href={`/atualizacoes#update-${currentUpdate.icao}`}
                          style={{ color: '#00a8fc', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          Clique aqui para conferir o comparativo no site
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Grid Fields (Exact match with Discord labels and values) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f2f3f5', marginBottom: '0.2rem' }}>
                        📍 Aeródromo
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#dbdee1', lineHeight: 1.35 }}>
                        {currentUpdate.airportName ? `${currentUpdate.airportName} (${currentUpdate.icao})` : currentUpdate.icao}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f2f3f5', marginBottom: '0.2rem' }}>
                        🏷️ Versão
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#dbdee1', lineHeight: 1.35 }}>
                        {currentUpdate.version}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f2f3f5', marginBottom: '0.2rem' }}>
                        👤 Autor
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#dbdee1', lineHeight: 1.35 }}>
                        {currentUpdate.author || 'Equipe VATBRZ'}
                      </div>
                    </div>
                  </div>

                  {/* Footer (VATBRZ Operações • Date) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#949ba4', marginTop: '0.2rem' }}>
                    <span>VATBRZ Operações</span>
                    <span>&bull;</span>
                    <span>01/09/2026 21:09</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
