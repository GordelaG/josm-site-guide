'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { ProgressSection } from '../../components/ProgressSection';
import { Footer } from '../../components/Footer';
import { subscribeToAirports } from '../../lib/airports-service';
import { Airport, AirportUpdate } from '../../types/airport';
import { INITIAL_AIRPORTS } from '../../lib/initial-airports';
import { BeforeAfterComparison } from '../../components/BeforeAfterComparison';
import { DiscordRssModal } from '../../components/DiscordRssModal';
import {
  Clock,
  Search,
  MapPin,
  CheckCircle2,
  Maximize2,
  X,
  User,
  Layers,
  Radar,
  Sparkles,
  Rss,
} from 'lucide-react';

export default function AtualizacoesPage() {
  const [airports, setAirports] = useState<Airport[]>(INITIAL_AIRPORTS);
  const [changelogSearch, setChangelogSearch] = useState('');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAirports((list) => {
      setAirports(list);
    });

    // Check if URL has hash like #update-SBGR
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const rawId = window.location.hash.replace('#', '');
        const target = document.getElementById(rawId);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.7), 0 0 0 2px #38bdf8';
            setTimeout(() => {
              target.style.transition = 'box-shadow 1.5s ease';
              target.style.boxShadow = '';
            }, 2500);
          }, 300);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Aggregate all updates from all airports sorted by newest date
  const allUpdates = useMemo(() => {
    const list: Array<{ airport: Airport; update: AirportUpdate }> = [];
    airports.forEach((ap) => {
      if (ap.updatesHistory && ap.updatesHistory.length > 0) {
        ap.updatesHistory.forEach((upd) => {
          list.push({ airport: ap, update: upd });
        });
      }
    });

    // Sort by date descending
    list.sort((a, b) => new Date(b.update.date).getTime() - new Date(a.update.date).getTime());
    return list;
  }, [airports]);

  // Filtered changelog
  const filteredUpdates = useMemo(() => {
    if (!changelogSearch.trim()) return allUpdates;
    const q = changelogSearch.toLowerCase();
    return allUpdates.filter(
      (item) =>
        item.airport.icao.toLowerCase().includes(q) ||
        item.airport.name.toLowerCase().includes(q) ||
        item.update.title.toLowerCase().includes(q) ||
        item.update.version.toLowerCase().includes(q) ||
        item.update.description.toLowerCase().includes(q)
    );
  }, [allUpdates, changelogSearch]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #101626 0%, #0c1017 100%)',
        position: 'relative',
      }}
    >
      <div className="grid-drift" style={{ position: 'fixed', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      <Navbar />

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20000,
            background: 'rgba(2, 6, 18, 0.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fade-up 0.2s ease',
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                color: '#fff',
              }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                {lightboxImage.title}
              </span>

              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 24px 72px rgba(0, 0, 0, 0.9)',
              }}
            />
          </div>
        </div>
      )}

      {/* DISCORD & RSS MODAL */}
      <DiscordRssModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />

      {/* Page Header Banner */}
      <div
        style={{
          padding: '7.5rem 1.5rem 2rem 1.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '0.85rem',
          }}
        >
          Progresso & Atualizações
        </h1>

        <p
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Acompanhe o mapa interativo de vetorização dos 81 aeroportos do Brasil em tempo real e consulte o changelog com as notas e fotos detalhadas de cada versão lançada.
        </p>
      </div>

      {/* Progress & Interactive Map Section */}
      <ProgressSection airports={airports} />

      {/* Changelog & Version Feed Section */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '6rem', position: 'relative', zIndex: 2 }}>
        <div className="section-inner">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="label-technical" style={{ color: '#38bdf8' }}>
                  Feed de Lançamentos
                </span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                Histórico de Versões
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Discord & RSS Feed Button (Left Side) */}
              <button
                type="button"
                onClick={() => setIsDiscordModalOpen(true)}
                style={{
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.22), rgba(0, 84, 219, 0.25))',
                  border: '1px solid rgba(88, 101, 242, 0.45)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 4px 16px rgba(88, 101, 242, 0.25)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #5865F2, #0054DB)';
                  e.currentTarget.style.borderColor = '#5865F2';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(88, 101, 242, 0.22), rgba(0, 84, 219, 0.25))';
                  e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.45)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(88, 101, 242, 0.25)';
                }}
              >
                {/* Discord Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2" style={{ filter: 'drop-shadow(0 0 4px rgba(88, 101, 242, 0.6))' }}>
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Conectar Discord / RSS</span>
              </button>

              {/* Search filter for changelog (Right Side) */}
              <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Filtrar por ICAO, versão..."
                  value={changelogSearch}
                  onChange={(e) => setChangelogSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Timeline Feed */}
          {filteredUpdates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {filteredUpdates.map(({ airport, update }, index) => {
                const hasBeforeAfter = Boolean(update.beforeImageUrl && update.afterImageUrl);
                const singleImage = update.afterImageUrl || update.beforeImageUrl || update.imageUrl;

                return (
                  <article
                    key={`${airport.icao}-${update.version}-${index}`}
                    id={`update-${airport.icao}`}
                    style={{
                      background: 'linear-gradient(165deg, rgba(13, 20, 36, 0.9) 0%, rgba(6, 10, 18, 0.96) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(56, 189, 248, 0.22)',
                      borderRadius: '20px',
                      padding: '2rem 2.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                      position: 'relative',
                      scrollMarginTop: '120px',
                      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 35px rgba(0, 84, 219, 0.1)',
                      overflow: 'hidden',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    {/* Header of Update Card */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingBottom: '1.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {/* Badges Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '0.95rem',
                              fontWeight: 900,
                              color: '#38bdf8',
                              background: 'rgba(0, 84, 219, 0.22)',
                              border: '1px solid rgba(56, 189, 248, 0.45)',
                              padding: '0.2rem 0.65rem',
                              borderRadius: '7px',
                              letterSpacing: '0.04em',
                              boxShadow: '0 0 15px rgba(0, 84, 219, 0.3)',
                            }}
                          >
                            {airport.icao}
                          </span>

                          <span
                            style={{
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: '#34d399',
                              background: 'rgba(16, 185, 129, 0.16)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '7px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                            {update.version}
                          </span>

                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'rgba(255, 255, 255, 0.55)',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            ✈️ Layout de Solo
                          </span>
                        </div>

                        {/* Title & Location */}
                        <div>
                          <h3
                            style={{
                              fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)',
                              fontWeight: 800,
                              color: '#ffffff',
                              letterSpacing: '-0.01em',
                              lineHeight: 1.25,
                              margin: '0 0 0.4rem 0',
                            }}
                          >
                            {update.title}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.825rem',
                              color: 'rgba(255, 255, 255, 0.65)',
                            }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <MapPin size={13} color="#38bdf8" />
                              <strong style={{ color: '#fff' }}>{airport.name}</strong> &bull; {airport.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Author & Date metadata */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.75)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.09)',
                          borderRadius: '10px',
                          padding: '0.45rem 0.85rem',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        {update.author && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0054DB, #38bdf8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                color: '#fff',
                                fontWeight: 800,
                              }}
                            >
                              {update.author.charAt(0).toUpperCase()}
                            </div>
                            <strong style={{ color: '#fff' }}>{update.author}</strong>
                          </span>
                        )}
                        <span style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }} />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                          <Clock size={13} color="#38bdf8" />
                          {update.date ? new Date(update.date).toLocaleDateString('pt-BR') : 'Data não informada'}
                        </span>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <div
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        color: 'rgba(226, 232, 240, 0.9)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {update.description}
                    </div>

                    {/* DUAL BEFORE / AFTER COMPARISON OR SINGLE IMAGE */}
                    {hasBeforeAfter ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8' }}>
                            Comparativo Interativo do Solo (Antes &amp; Depois)
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Arraste a linha central para comparar as alterações
                          </span>
                        </div>

                        <BeforeAfterComparison
                          beforeUrl={update.beforeImageUrl!}
                          afterUrl={update.afterImageUrl!}
                          title={update.title}
                          icao={airport.icao}
                          version={update.version}
                          onOpenLightbox={(src, title) => setLightboxImage({ src, title })}
                        />
                      </div>
                    ) : singleImage ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                          <span className="label-technical" style={{ color: '#10b981' }}>
                            Captura do EuroScope ({update.version}):
                          </span>
                        </div>

                        <div
                          style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: '#090d14',
                            maxHeight: '440px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setLightboxImage({ src: singleImage, title: `${airport.icao} - ${update.version}` })}
                        >
                          <img
                            src={singleImage}
                            alt={`${airport.icao} ${update.version}`}
                            style={{
                              width: '100%',
                              maxHeight: '440px',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '0.75rem',
                              right: '0.75rem',
                              background: 'rgba(0, 0, 0, 0.75)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.65rem',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <Maximize2 size={13} />
                            <span>Ampliar</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                borderRadius: '16px',
              }}
            >
              <History size={40} color="rgba(255, 255, 255, 0.3)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                Nenhuma atualização encontrada
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
                {changelogSearch
                  ? `Nenhum registro corresponde ao termo "${changelogSearch}". Tente buscar por outro ICAO.`
                  : 'Os lançamentos e atualizações de versão cadastrados pelos administradores aparecerão aqui.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
