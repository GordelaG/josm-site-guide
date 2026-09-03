'use client';

import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Sparkles, Filter, Info } from 'lucide-react';

interface PolygonItem {
  id: string;
  category: 'infra' | 'natural' | 'operacional';
  title: string;
  badge: string;
  colorBar: string;
  swatch: string;
  tags: string[];
  desc: string;
  tip: string;
}

const POLYGONS: PolygonItem[] = [
  {
    id: 'poly-aerodrome',
    category: 'infra',
    title: 'Sítio Aeroportuário',
    badge: 'Infraestrutura',
    colorBar: '#c8b8a8',
    swatch: '#c8b8a8',
    tags: ['aeroway = aerodrome'],
    desc: 'Delimita o perímetro total do aeroporto. É o polígono base sobre o qual todos os demais elementos são desenhados.',
    tip: 'Desenhe primeiro — engloba toda a área patrimonial do aeródromo.',
  },
  {
    id: 'poly-military',
    category: 'infra',
    title: 'Área Militar',
    badge: 'Infraestrutura',
    colorBar: '#7a8b68',
    swatch: '#7a8b68',
    tags: ['landuse = military'],
    desc: 'Delimita zonas de uso militar dentro ou adjacentes ao aeroporto. Comum em bases aéreas mistas da FAB.',
    tip: 'Utilize em SBNT, SBUL, SBAN e bases da Força Aérea.',
  },
  {
    id: 'poly-grass',
    category: 'natural',
    title: 'Gramado / Vegetação',
    badge: 'Natural',
    colorBar: '#10b981',
    swatch: '#10b981',
    tags: [
      'landuse = grass',
      'landuse = meadow',
      'landuse = brownfield',
      'natural = wood',
      'natural = scrub',
      'natural = wetland',
    ],
    desc: 'Áreas verdes, gramados, campos não pavimentados e vegetação ao redor das faixas de pista.',
    tip: 'Mantenha separado do polígono de sítio para correta camada de relevo.',
  },
  {
    id: 'poly-water',
    category: 'natural',
    title: 'Água / Lagos',
    badge: 'Natural',
    colorBar: '#38bdf8',
    swatch: '#38bdf8',
    tags: ['natural = water'],
    desc: "Corpos d'água como lagos, lagoas de contenção, reservatórios e rios que margeiam o sítio.",
    tip: 'Essencial para aeroportos costeiros e lacustres como SBCT, SBFL e SBRJ.',
  },
  {
    id: 'poly-construction',
    category: 'infra',
    title: 'Área em Construção',
    badge: 'Infraestrutura',
    colorBar: '#f59e0b',
    swatch: '#f59e0b',
    tags: ['landuse = construction'],
    desc: 'Zonas com obras em andamento, pavimentação nova de pista ou reformas de pátio.',
    tip: 'Atualize conforme a evolução das obras noticiadas em NOTAM.',
  },
  {
    id: 'poly-apron',
    category: 'operacional',
    title: 'Pátios (Apron)',
    badge: 'Operacional',
    colorBar: '#717d8a',
    swatch: '#717d8a',
    tags: ['aeroway = apron'],
    desc: 'Área pavimentada onde aeronaves estacionam, embarcam passageiros e realizam abastecimento.',
    tip: 'Segmente pátios comerciais, aviação geral e hangares.',
  },
  {
    id: 'poly-buildings',
    category: 'infra',
    title: 'Prédios & Terminais',
    badge: 'Infraestrutura',
    colorBar: '#a855f7',
    swatch: '#a855f7',
    tags: [
      'building = yes',
      'aeroway = hangar',
      'building = office',
      'building = public',
      'building = roof',
      'building = transportation',
    ],
    desc: 'Todas as edificações: TPS (terminais de passageiros), hangares, TWR e administração.',
    tip: 'Diferencie terminais comerciais com building=transportation.',
  },
  {
    id: 'poly-bridges',
    category: 'infra',
    title: 'Pontes de Embarque / Viadutos',
    badge: 'Infraestrutura',
    colorBar: '#ef4444',
    swatch: '#ef4444',
    tags: ['bridge = yes'],
    desc: 'Estruturas elevadas como pontes de taxiway que cruzam vias públicas ou pontes de embarque (fingers).',
    tip: 'Exemplos clássicos em SBGR e SBSP.',
  },
  {
    id: 'poly-runway',
    category: 'operacional',
    title: 'Pistas de Pouso (Runway)',
    badge: 'Operacional',
    colorBar: '#3b82f6',
    swatch: '#3b82f6',
    tags: ['aeroway = runway'],
    desc: 'Superfície pavimentada retangular destinada ao pouso e decolagem de aeronaves.',
    tip: 'Desenhe o polígono exato do pavimento da pista incluindo cabeceiras.',
  },
  {
    id: 'poly-taxiway',
    category: 'operacional',
    title: 'Pistas de Táxi (Taxiway)',
    badge: 'Operacional',
    colorBar: '#6366f1',
    swatch: '#6366f1',
    tags: ['aeroway = taxiway'],
    desc: 'Via de circulação definida em um aeródromo destinada à movimentação e taxiamento seguro de aeronaves entre pistas de pouso, pátios e terminais.',
    tip: 'Garanta alinhamento preciso com o eixo central do EuroScope. Na entrada de pontos de parada e gates, a linha deve ser trocada para a tag aeroway = parking_position.',
  },
  {
    id: 'poly-stopway',
    category: 'operacional',
    title: 'Stopway / Blast Pad',
    badge: 'Operacional',
    colorBar: '#ec4899',
    swatch: '#ec4899',
    tags: ['aeroway = stopway', 'aeroway = blast_pad'],
    desc: 'Área retangular além da cabeceira preparada como zona de parada de emergência ou proteção contra jato.',
    tip: 'Deve ser usado para stopway e redlines dos aeroportos. A stopway deve ser uma linha, não um ponto.',
  },
  {
    id: 'poly-parking-position',
    category: 'operacional',
    title: 'Posições de Parada (Parking Position)',
    badge: 'Operacional',
    colorBar: '#06b6d4',
    swatch: '#06b6d4',
    tags: ['aeroway = parking_position'],
    desc: 'Posições de parada e estacionamento de aeronaves no pátio (stands, gates e boxes remotos).',
    tip: 'Deve ser usado para marcar as posições de parada de aeronaves nos pátios.',
  },
  {
    id: 'poly-line-dashed',
    category: 'operacional',
    title: 'Linhas Tracejadas (Dashed Lines)',
    badge: 'Operacional',
    colorBar: '#f59e0b',
    swatch: '#f59e0b',
    tags: ['line = dashed'],
    desc: 'Demarcação de linhas e eixos com pintura tracejada no solo e pistas de táxi do aeródromo.',
    tip: 'Deve ser usado para colocar e traçar linhas tracejadas no aeroporto.',
  },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Polígonos' },
  { id: 'operacional', label: 'Operacional' },
  { id: 'infra', label: 'Infraestrutura' },
  { id: 'natural', label: 'Natural / Relevo' },
];

export const PolygonGuide: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filtered = useMemo(() => {
    return POLYGONS.filter((p) => {
      const matchCat = selectedCat === 'todos' || p.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  return (
    <section className="section section-polygons" id="poligonos" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
      <div className="section-inner">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                color: '#fff',
                margin: '0 0 0.5rem 0',
              }}
            >
              Guia de Polígonos & Tags OSM
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Consulte os {POLYGONS.length} tipos de superfícies e linhas e copie as chaves e valores oficiais para o JOSM.
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar polígono ou tag (ex: apron)..."
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

        {/* Category Pill Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
            padding: '0.35rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '999px',
            width: 'fit-content',
          }}
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCat(c.id)}
              style={{
                background: selectedCat === c.id ? '#0054DB' : 'transparent',
                color: selectedCat === c.id ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: selectedCat === c.id ? '0 4px 14px rgba(0, 84, 219, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Bento Polygons Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filtered.map((poly) => (
            <div
              key={poly.id}
              className="polygon-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${poly.colorBar}, transparent)`,
                }}
              />

              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    {poly.title}
                  </h3>
                </div>

                <span
                  className="badge-tech"
                  style={{
                    color: poly.colorBar,
                    borderColor: `${poly.colorBar}55`,
                    background: `${poly.colorBar}15`,
                  }}
                >
                  {poly.badge}
                </span>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                {poly.desc}
              </p>

              {/* Tags Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span className="label-technical" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.45)' }}>
                  Tags OSM (Clique para Copiar Chave ou Valor):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {poly.tags.map((tag, tIdx) => {
                    const parts = tag.split('=');
                    const key = parts[0]?.trim() || tag;
                    const value = parts[1]?.trim() || '';
                    const keyId = `${poly.id}-${tIdx}-key`;
                    const valId = `${poly.id}-${tIdx}-val`;
                    const isKeyCopied = copiedId === keyId;
                    const isValCopied = copiedId === valId;

                    return (
                      <div
                        key={tag}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'stretch',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '7px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                          maxWidth: '100%',
                        }}
                      >
                        {/* Botão Chave */}
                        <button
                          type="button"
                          onClick={() => handleCopy(key, keyId)}
                          title={`Copiar Chave: ${key}`}
                          style={{
                            background: isKeyCopied ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                            border: 'none',
                            padding: '0.35rem 0.55rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isKeyCopied) e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isKeyCopied) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              color: 'rgba(255, 255, 255, 0.45)',
                            }}
                          >
                            Chave
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: isKeyCopied ? '#10b981' : '#38bdf8',
                            }}
                          >
                            {key}
                          </span>
                          {isKeyCopied ? (
                            <Check size={11} color="#10b981" />
                          ) : (
                            <Copy size={11} color="rgba(255, 255, 255, 0.35)" />
                          )}
                        </button>

                        {/* Divisor */}
                        <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', flexShrink: 0 }} />

                        {/* Botão Valor */}
                        <button
                          type="button"
                          onClick={() => handleCopy(value, valId)}
                          title={`Copiar Valor: ${value}`}
                          style={{
                            background: isValCopied ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                            border: 'none',
                            padding: '0.35rem 0.55rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isValCopied) e.currentTarget.style.background = 'rgba(52, 211, 153, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isValCopied) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              color: 'rgba(255, 255, 255, 0.45)',
                            }}
                          >
                            Valor
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: isValCopied ? '#10b981' : '#34d399',
                            }}
                          >
                            {value}
                          </span>
                          {isValCopied ? (
                            <Check size={11} color="#10b981" />
                          ) : (
                            <Copy size={11} color="rgba(255, 255, 255, 0.35)" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tip Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Info size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
                <span>{poly.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
