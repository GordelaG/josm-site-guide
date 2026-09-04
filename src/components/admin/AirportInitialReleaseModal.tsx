'use client';

import React, { useState, useRef } from 'react';
import { Airport } from '../../types/airport';
import { completeAirportWithRelease } from '../../lib/airports-service';
import { processImageFile } from '../../lib/image-helper';
import { X, Upload, Trash2, CheckCircle2, Rocket, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface AirportInitialReleaseModalProps {
  airport: Airport;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (info: { icao: string; version: string; title: string }) => void;
  currentUserEmail?: string;
}

export const AirportInitialReleaseModal: React.FC<AirportInitialReleaseModalProps> = ({
  airport,
  isOpen,
  onClose,
  onSuccess,
  currentUserEmail,
}) => {
  const defaultTitle = `Lançamento Inicial - Setor ${airport.icao}`;
  const defaultDesc = `Vetorização e modelagem completa do layout de solo do aeroporto ${airport.name} (${airport.icao}) concluída para o EuroScope. Inclui pistas, taxiways, pátios de estacionamento, linhas de centro e posições de parada padronizadas conforme cartas vigentes.`;

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDesc);
  const [author, setAuthor] = useState(airport.assignedTo || currentUserEmail || 'Operações VATBRZ');

  // Dual Images: Before & After
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const [isProcessingBefore, setIsProcessingBefore] = useState(false);
  const [isProcessingAfter, setIsProcessingAfter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    try {
      if (type === 'before') setIsProcessingBefore(true);
      else setIsProcessingAfter(true);
      setErrorMsg(null);

      const dataUrl = await processImageFile(file, 1600, 0.88);
      if (type === 'before') setBeforeImage(dataUrl);
      else setAfterImage(dataUrl);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar imagem.');
    } finally {
      if (type === 'before') setIsProcessingBefore(false);
      else setIsProcessingAfter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Por favor, preencha o título e a descrição da versão.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await completeAirportWithRelease(airport.icao, {
        version: 'v1.0.0',
        title: title.trim(),
        description: description.trim(),
        beforeImageUrl: beforeImage || undefined,
        afterImageUrl: afterImage || undefined,
        imageUrl: afterImage || beforeImage || undefined,
        author: author.trim() || 'Operações VATBRZ',
        assignedTo: author.trim() || airport.assignedTo,
      });

      if (onSuccess) {
        onSuccess({
          icao: airport.icao,
          version: 'v1.0.0',
          title: title.trim(),
        });
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao salvar o lançamento no Firebase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 8, 14, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          background: '#0c1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 72px rgba(0, 0, 0, 0.9), 0 0 32px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fade-up 0.25s ease',
        }}
      >
        {/* Top Accent Line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <Rocket size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {airport.icao}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  v1.0.0
                </span>
              </div>
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Concluir & Lançar Versão Inicial
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: '#ff7b72',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Título do Lançamento:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Lançamento Inicial - Setor SBSP"
                style={{
                  width: '100%',
                  background: '#121722',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Author Field */}
            <div>
              <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Autor da Alteração / Lançamento:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor..."
                style={{
                  width: '100%',
                  background: '#121722',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Changelog Description Field */}
            <div>
              <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Descrição das Modificações (Changelog):
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que foi vetorizado, corrigido ou modificado..."
                style={{
                  width: '100%',
                  background: '#121722',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Dual Images (Before & After) */}
            <div>
              <span className="label-technical" style={{ display: 'block', marginBottom: '0.5rem' }}>
                📸 Imagens Comparativas (Antes e Depois do EuroScope):
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* 1. Before Slot */}
                <div
                  style={{
                    border: '1px dashed rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    background: 'rgba(239, 68, 68, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                      🔴 Foto ANTES (Layout Antigo)
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Opcional</span>
                  </div>

                  <input
                    type="file"
                    ref={beforeInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'before');
                    }}
                  />

                  {beforeImage ? (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '120px', background: '#000' }}>
                      <img
                        src={beforeImage}
                        alt="Antes"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <button
                        type="button"
                        onClick={() => setBeforeImage(null)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingBefore}
                      onClick={() => beforeInputRef.current?.click()}
                      style={{
                        height: '120px',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    >
                      <Upload size={18} color="#ef4444" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                        {isProcessingBefore ? 'Carregando...' : 'Adicionar Foto ANTES'}
                      </span>
                    </button>
                  )}
                </div>

                {/* 2. After Slot */}
                <div
                  style={{
                    border: '1px dashed rgba(16, 185, 129, 0.35)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    background: 'rgba(16, 185, 129, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                      🟢 Foto DEPOIS (Novo Desenho)
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Opcional</span>
                  </div>

                  <input
                    type="file"
                    ref={afterInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'after');
                    }}
                  />

                  {afterImage ? (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '120px', background: '#000' }}>
                      <img
                        src={afterImage}
                        alt="Depois"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <button
                        type="button"
                        onClick={() => setAfterImage(null)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessingAfter}
                      onClick={() => afterInputRef.current?.click()}
                      style={{
                        height: '120px',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    >
                      <Upload size={18} color="#10b981" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                        {isProcessingAfter ? 'Carregando...' : 'Adicionar Foto DEPOIS'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Author / Responsible Field */}
            <div>
              <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Responsável pelo Lançamento:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do desenvolvedor / Operações VATBRZ"
                style={{
                  width: '100%',
                  background: '#121722',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.75)',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: '1px solid rgba(52, 211, 153, 0.45)',
                color: '#fff',
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.35)';
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Salvando...' : 'Lançar v1.0.0 & Concluir Aeroporto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
