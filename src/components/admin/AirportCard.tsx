'use client';

import React, { useState } from 'react';
import { Airport, AirportStatus } from '../../types/airport';
import { Check, Clock, Edit3, MessageSquare, Save, User, X, Sparkles, MapPin, CheckCircle2, Hourglass } from 'lucide-react';
import { AirportInitialReleaseModal } from './AirportInitialReleaseModal';

interface AirportCardProps {
  airport: Airport;
  onUpdateStatus: (icao: string, status: AirportStatus, notes?: string, assignedTo?: string) => Promise<void>;
  onOpenUpdateModal?: (airport: Airport) => void;
}

export const AirportCard: React.FC<AirportCardProps> = ({
  airport,
  onUpdateStatus,
  onOpenUpdateModal,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [showInitialReleaseModal, setShowInitialReleaseModal] = useState(false);
  const [notes, setNotes] = useState(airport.notes || '');
  const [assignedTo, setAssignedTo] = useState(airport.assignedTo || '');

  const isDone = airport.status === 'done';
  const isProgress = airport.status === 'in_progress';
  const isPending = airport.status === 'pending';

  const statusColor = isDone ? '#10b981' : isProgress ? '#f59e0b' : '#ef4444';

  const handleStatusChange = async (newStatus: AirportStatus) => {
    if (newStatus === airport.status || isSaving) return;
    setIsSaving(true);
    try {
      await onUpdateStatus(airport.icao, newStatus, airport.notes, airport.assignedTo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMeta = async () => {
    setIsSaving(true);
    try {
      await onUpdateStatus(airport.icao, airport.status, notes, assignedTo);
      setIsEditingMeta(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* MODAL DE LANÇAMENTO INICIAL COM FOTO DO EUROSCOPE */}
      <AirportInitialReleaseModal
        airport={airport}
        isOpen={showInitialReleaseModal}
        onClose={() => setShowInitialReleaseModal(false)}
      />

      <div
        className="glass-card"
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'relative',
          borderRadius: '14px',
          borderLeft: `3px solid ${statusColor}`,
          opacity: isSaving ? 0.65 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Top Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: statusColor,
                  background: `${statusColor}18`,
                  border: `1px solid ${statusColor}40`,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  letterSpacing: '0.04em',
                }}
              >
                {airport.icao}
              </span>

              {isDone && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {airport.version || 'v1.0.0'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditingMeta(!isEditingMeta)}
              title="Editar notas ou responsável"
              style={{
                background: isEditingMeta ? 'rgba(0, 84, 219, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isEditingMeta ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '6px',
                padding: '0.35rem',
                color: isEditingMeta ? '#38bdf8' : 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {isEditingMeta ? <X size={14} /> : <Edit3 size={14} />}
            </button>
          </div>

          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.3,
            }}
          >
            {airport.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <MapPin size={12} color="#38bdf8" />
            <span>{airport.city || 'Brasil'}</span>
          </div>
        </div>

        {/* Status Actions Bar */}
        <div>
          {isDone ? (
            /* Layout quando Concluído */
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onOpenUpdateModal && onOpenUpdateModal(airport)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                color: '#ffffff',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(0, 84, 219, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 84, 219, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 84, 219, 0.35)';
              }}
            >
              <Sparkles size={14} color="#38bdf8" />
              <span>Versões & Notas</span>
            </button>
          ) : isPending ? (
            /* Layout quando Na Fila */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleStatusChange('in_progress')}
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#f59e0b',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)')}
              >
                <Clock size={12} />
                <span>Andamento</span>
              </button>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid #ef4444',
                  color: '#fff',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
                }}
              >
                <Hourglass size={12} />
                <span>Na Fila</span>
              </div>
            </div>
          ) : (
            /* Layout quando Em Andamento */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowInitialReleaseModal(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.45))',
                  border: '1px solid #10b981',
                  color: '#fff',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <CheckCircle2 size={12} />
                <span>Concluído</span>
              </button>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '1px solid #f59e0b',
                  color: '#fff',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Clock size={12} />
                <span>Andamento</span>
              </div>
            </div>
          )}

          {/* Meta Info (Responsável / Notas) */}
          {(airport.assignedTo || airport.notes || isEditingMeta) && (
            <div
              style={{
                marginTop: '0.75rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              {isEditingMeta ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <input
                    type="text"
                    placeholder="Responsável pelo aeródromo..."
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.55rem',
                      color: '#fff',
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Observações internas..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.55rem',
                      color: '#fff',
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveMeta}
                    style={{
                      background: '#0054DB',
                      border: 'none',
                      color: '#fff',
                      padding: '0.35rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Salvar Dados
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {airport.assignedTo && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(255,255,255,0.7)' }}>
                      <User size={11} color="#38bdf8" />
                      <strong>{airport.assignedTo}</strong>
                    </span>
                  )}
                  {airport.notes && (
                    <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                      {airport.notes}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
