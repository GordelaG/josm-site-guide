'use client';

import React from 'react';
import { Layers, Globe, Compass, ArrowRight, Cpu, GitMerge } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const tools = [
    {
      title: 'JOSM',
      subtitle: 'Editor Geoespacial',
      desc: 'Editor avançado em Java para desenhar, ajustar nós e classificar polígonos e eixos de solo com precisão métrica.',
      accent: '#0054DB',
      icon: Cpu,
    },
    {
      title: 'OpenStreetMap',
      subtitle: 'Base Cartográfica Global',
      desc: 'Repositório de dados abertos com padrões e tags mundiais para infraestrutura aeronáutica e layout de aeródromos.',
      accent: '#10B981',
      icon: Globe,
    },
    {
      title: 'QGIS / EuroScope',
      subtitle: 'Processamento & Renderização',
      desc: 'Sistemas GIS que processam os dados vetoriais e compilam as camadas de cores e geometrias para os radares ATC.',
      accent: '#38BDF8',
      icon: Layers,
    },
  ];

  const steps = [
    { num: '01', title: 'Download OSM', desc: 'Extração da área do aeródromo via API Overpass' },
    { num: '02', title: 'Classificação no JOSM', desc: 'Aplicação das tags padronizadas de superfícies e eixos' },
    { num: '03', title: 'Exportação QGIS', desc: 'Processamento de camadas vetoriais e estilos de cor' },
    { num: '04', title: 'Ground File ATC', desc: 'Geração final do arquivo de solo para o EuroScope/TopSky' },
  ];

  return (
    <section className="section section-about" id="sobre" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="section-inner">
        {/* Section Header */}
        <div style={{ marginBottom: '2.5rem' }}>
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
            O que é o Ground Layout?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '680px' }}>
            O ground layout é a representação visual de alta fidelidade de pistas, taxiways, pátios e construções utilizada pelos controladores no EuroScope.
          </p>
        </div>

        {/* 3 Bento Tool Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                className="glass-card"
                style={{
                  padding: '1.75rem',
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
                    background: `linear-gradient(90deg, transparent, ${tool.accent}, transparent)`,
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: `${tool.accent}1f`,
                      border: `1px solid ${tool.accent}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.accent,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    className="badge-tech"
                    style={{
                      color: tool.accent,
                      borderColor: `${tool.accent}40`,
                      background: `${tool.accent}14`,
                    }}
                  >
                    {tool.subtitle}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                      color: '#fff',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    {tool.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
                    {tool.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Step Technical Workflow */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {steps.map((step, idx) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#0054DB',
                      background: 'rgba(0, 84, 219, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '8px',
                      padding: '0.2rem 0.55rem',
                    }}
                  >
                    {step.num}
                  </span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{step.title}</strong>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
