'use client';

import React, { useState } from 'react';
import { Download, Settings, Layers, CheckCircle2, Award, ExternalLink } from 'lucide-react';

export const TutorialSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Configurar JOSM', icon: Settings },
    { label: 'Baixar Dados', icon: Download },
    { label: 'Mapear Elementos', icon: Layers },
    { label: 'Validar Tags', icon: CheckCircle2 },
    { label: 'Finalização', icon: Award },
  ];

  return (
    <section className="section section-tutorial" id="tutorial" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
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
            Tutorial Passo a Passo
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '680px' }}>
            Siga as 5 etapas estruturadas para configurar o ambiente e modelar o seu primeiro ground layout do zero.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '0.35rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            marginBottom: '1.75rem',
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setActiveStep(idx)}
                style={{
                  flex: '1 1 auto',
                  minWidth: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  background: isActive ? 'linear-gradient(135deg, #0054DB, #1d6bf3)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.65)',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                  boxShadow: isActive ? '0 4px 16px rgba(0, 84, 219, 0.35)' : 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 900,
                  }}
                >
                  {idx + 1}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            borderRadius: '18px',
          }}
        >
          {activeStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#fff', margin: '0 0 0.35rem 0' }}>
                  1. Configurando o Ambiente JOSM
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Prepare as ferramentas essenciais e os plugins necessários para vetorização aeronáutica.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    1. Instalar o JOSM
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Baixe a versão oficial mais recente em{' '}
                    <a
                      href="https://josm.openstreetmap.de/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38bdf8', textDecoration: 'underline' }}
                    >
                      josm.openstreetmap.de
                    </a>
                    . Requer Java Runtime 11 ou superior.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    2. Instalar Plugins Recomendados
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                    Vá em <strong>Editar &rarr; Preferências &rarr; Plugins</strong> e instale:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <code>buildings_tools</code>
                    <code>validator</code>
                    <code>imagery_offset_db</code>
                    <code>opendata</code>
                    <code>flatlaf</code>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    3. Gabarito de Alinhamento de Pista
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    Baixe o gabarito oficial para conferir a declinação magnética e o alinhamento das cabeceiras sobre o satélite.
                  </p>
                  <a
                    href="/assets/runway_v2.kml"
                    download
                    style={{
                      background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.5rem 0.95rem',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} />
                    <span>Baixar runway_v2.kml</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#fff', margin: '0 0 0.35rem 0' }}>
                  2. Baixando Dados do Aeroporto
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Como extrair a área exata do aeródromo pelo OpenStreetMap.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    1. Localizar o Aeródromo
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Use o atalho <strong>Ctrl + Shift + ↓</strong> (Arquivo &rarr; Baixar Dados) e pesquise pelo código ICAO ou cidade.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    2. Bounding Box & Margem
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Delimite o retângulo de download englobando todas as cabeceiras, zona de aproximação e área patrimonial com ~500m de folga.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    3. Salvar Cópia Local (.osm)
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Sempre salve uma cópia bruta do arquivo <code>.osm</code> no seu disco antes de iniciar qualquer alteração ou mesclagem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#fff', margin: '0 0 0.35rem 0' }}>
                  3. Mapeando Elementos & Superfícies
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Ordem recomendada de modelagem das feições aeroportuárias.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span className="label-technical" style={{ color: '#c8b8a8', display: 'block', marginBottom: '0.2rem' }}>Passo 1</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>Sítio (Aerodrome)</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Trace o perímetro externo total com <code>aeroway=aerodrome</code>.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span className="label-technical" style={{ color: '#3b82f6', display: 'block', marginBottom: '0.2rem' }}>Passo 2</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>Pistas (Runways)</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Desenhe o pavimento retangular com <code>aeroway=runway</code> e <code>ref=10/28</code>.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span className="label-technical" style={{ color: '#6366f1', display: 'block', marginBottom: '0.2rem' }}>Passo 3</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>Taxiways & Pátios</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Mapeie as vias de táxi (<code>aeroway=taxiway</code>) e os pátios (<code>aeroway=apron</code>).
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span className="label-technical" style={{ color: '#a855f7', display: 'block', marginBottom: '0.2rem' }}>Passo 4</span>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>Edificações & TPS</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Adicione terminais (<code>building=transportation</code>) e hangares.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#fff', margin: '0 0 0.35rem 0' }}>
                  4. Validação & Verificação Topológica
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Garantindo zero erros geométricos antes de exportar para o sectorfile.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    1. Validador Automático (Shift + V)
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Execute o validador nativo do JOSM para detectar cruzamentos indevidos de polígonos, nós duplicados ou tags sem valor.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    2. Continuidade de Taxiway
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Verifique se os polígonos de taxiway coincidem com as linhas de centro e posições de parada do EuroScope.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>
                    3. Nomenclatura Padronizada
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Certifique-se de que os identificadores de taxiways (A, B, C...) e gates (G1, G2...) seguem rigorosamente a carta ROTAER/AIP vigente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 0 32px rgba(16, 185, 129, 0.25)',
                }}
              >
                <Award size={32} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#fff', marginBottom: '0.75rem' }}>
                Obrigado pela sua contribuição!
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '640px', margin: '0 auto' }}>
                O Departamento de Operações da <strong>VATSIM Brasil</strong> agradece a dedicação de todos os voluntários e desenvolvedores de cenário.<br />
                Suas vetorizações garantem uma experiência de controle realista e imersiva para toda a comunidade.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
