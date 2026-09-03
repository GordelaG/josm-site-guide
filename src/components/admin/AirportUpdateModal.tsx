'use client';

import React, { useState, useRef } from 'react';
import { Airport, AirportUpdate } from '../../types/airport';
import { processImageFile } from '../../lib/image-helper';
import {
  Sparkles,
  X,
  Clock,
  CheckCircle2,
  History,
  AlertCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  Layers,
  Save,
  Upload,
  Image as ImageIcon,
  User,
} from 'lucide-react';

interface AirportUpdateModalProps {
  airport: Airport | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveUpdate: (
    icao: string,
    updateData: {
      version: string;
      title: string;
      description: string;
      imageUrl?: string;
      beforeImageUrl?: string;
      afterImageUrl?: string;
    }
  ) => Promise<void>;
  onEditUpdate: (
    icao: string,
    targetVersion: string,
    updatedData: {
      title: string;
      description: string;
      imageUrl?: string;
      beforeImageUrl?: string;
      afterImageUrl?: string;
    }
  ) => Promise<void>;
  onDeleteUpdate: (icao: string, versionToDelete: string) => Promise<void>;
  currentUser?: string;
}

// Helper to calculate the next semantic version
export function getNextVersion(currentVersion?: string): string {
  if (!currentVersion) return 'v1.0.1';
  
  const match = currentVersion.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (match) {
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    const patch = parseInt(match[3], 10) + 1;
    return `v${major}.${minor}.${patch}`;
  }
  return `${currentVersion}.1`;
}

export const AirportUpdateModal: React.FC<AirportUpdateModalProps> = ({
  airport,
  isOpen,
  onClose,
  onSaveUpdate,
  onEditUpdate,
  onDeleteUpdate,
  currentUser = 'Admin',
}) => {
  if (!isOpen || !airport) return null;

  const currentVersion = airport.version || 'v1.0.0';
  const defaultNextVersion = getNextVersion(airport.version || 'v1.0.0');

  // Views: 'list' | 'new' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'new' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<AirportUpdate | null>(null);
  const [deletingVersion, setDeletingVersion] = useState<string | null>(null);

  // Form states for new version
  const [version, setVersion] = useState(defaultNextVersion);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBeforeImage, setEditBeforeImage] = useState<string | null>(null);
  const [editAfterImage, setEditAfterImage] = useState<string | null>(null);

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const newBeforeRef = useRef<HTMLInputElement>(null);
  const newAfterRef = useRef<HTMLInputElement>(null);
  const editBeforeRef = useRef<HTMLInputElement>(null);
  const editAfterRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File, type: 'newBefore' | 'newAfter' | 'editBefore' | 'editAfter') => {
    try {
      setIsProcessingImage(true);
      setError(null);
      const dataUrl = await processImageFile(file, 1600, 0.88);
      if (type === 'newBefore') setBeforeImage(dataUrl);
      else if (type === 'newAfter') setAfterImage(dataUrl);
      else if (type === 'editBefore') setEditBeforeImage(dataUrl);
      else if (type === 'editAfter') setEditAfterImage(dataUrl);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle Create New Version
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da versão.');
      return;
    }
    if (!description.trim()) {
      setError('Por favor, informe a descrição das alterações.');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      await onSaveUpdate(airport.icao, {
        version: version.trim().startsWith('v') ? version.trim() : `v${version.trim()}`,
        title: title.trim(),
        description: description.trim(),
        beforeImageUrl: beforeImage || undefined,
        afterImageUrl: afterImage || undefined,
        imageUrl: afterImage || beforeImage || undefined,
      });
      setTitle('');
      setDescription('');
      setBeforeImage(null);
      setAfterImage(null);
      setViewMode('list');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao registrar atualização no Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Edit Existing Version
  const startEdit = (item: AirportUpdate) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditBeforeImage(item.beforeImageUrl || null);
    setEditAfterImage(item.afterImageUrl || item.imageUrl || null);
    setViewMode('edit');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editTitle.trim()) {
      setError('Por favor, informe o título.');
      return;
    }
    if (!editDescription.trim()) {
      setError('Por favor, informe a descrição.');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      await onEditUpdate(airport.icao, editingItem.version, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        beforeImageUrl: editBeforeImage || undefined,
        afterImageUrl: editAfterImage || undefined,
        imageUrl: editAfterImage || editBeforeImage || undefined,
      });
      setEditingItem(null);
      setViewMode('list');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações no Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Version
  const confirmDelete = async (versionToDelete: string) => {
    setIsSaving(true);
    setError(null);
    try {
      await onDeleteUpdate(airport.icao, versionToDelete);
      setDeletingVersion(null);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar versão.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatesList = airport.updatesHistory || [];

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
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          background: '#0c1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 72px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 84, 219, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fade-up 0.25s ease',
        }}
      >
        {/* Top Accent Wire */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #0054DB, #38bdf8, transparent)' }} />

        {/* Modal Header */}
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
                background: 'rgba(0, 84, 219, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Layers size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    background: 'rgba(0, 84, 219, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
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
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {currentVersion}
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
                {viewMode === 'list'
                  ? 'Gerenciamento de Versões'
                  : viewMode === 'new'
                  ? 'Lançar Nova Atualização'
                  : `Editar Versão ${editingItem?.version}`}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {viewMode !== 'list' && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setViewMode('list');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ArrowLeft size={14} />
                <span>Voltar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
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
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.15)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ff7b72',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* VIEW 1: VERSION LIST */}
        {viewMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Top Toolbar in List */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span className="label-technical" style={{ color: 'var(--text-secondary)' }}>
                Histórico de Versões Publicadas ({updatesList.length})
              </span>

              <button
                type="button"
                onClick={() => {
                  setVersion(getNextVersion(airport.version));
                  setTitle('');
                  setDescription('');
                  setBeforeImage(null);
                  setAfterImage(null);
                  setError(null);
                  setViewMode('new');
                }}
                style={{
                  background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(0, 84, 219, 0.35)',
                  transition: 'all 0.15s ease',
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
                <Plus size={14} />
                <span>Lançar Nova Versão</span>
              </button>
            </div>

            {/* List Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {updatesList.length === 0 ? (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 900,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                      }}
                    >
                      v1.0.0
                    </span>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>Lançamento Inicial</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      Status: Concluído
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    Layout de solo base concluído e integrado ao projeto JOSM da VATSIM Brasil.
                  </p>
                </div>
              ) : (
                updatesList.map((item) => (
                  <div
                    key={item.version}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      borderLeft: '3px solid #0054DB',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.825rem',
                            fontWeight: 900,
                            color: '#38bdf8',
                            background: 'rgba(0, 84, 219, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          {item.version}
                        </span>
                        <strong style={{ color: '#fff', fontSize: '1rem' }}>{item.title}</strong>
                      </div>

                      {/* Item Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          title="Editar nota"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '0.35rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingVersion(item.version)}
                          title="Deletar versão"
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            padding: '0.35rem',
                            color: '#ff7b72',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                      {item.description}
                    </p>

                    {/* Metadata strip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Autor: {item.author || 'Operações VATBRZ'}</span>
                      {item.date && <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>}
                    </div>

                    {/* Delete Confirmation Inline */}
                    {deletingVersion === item.version && (
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', color: '#ff7b72', fontWeight: 600 }}>
                          Excluir a nota da versão {item.version}?
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => setDeletingVersion(null)}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#fff',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            Não
                          </button>
                          <button
                            type="button"
                            onClick={() => confirmDelete(item.version)}
                            style={{
                              background: '#ef4444',
                              border: 'none',
                              color: '#fff',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Sim, Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CREATE NEW VERSION */}
        {viewMode === 'new' && (
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    Número da Versão:
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.1"
                    style={{
                      width: '100%',
                      background: '#121722',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#38bdf8',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Versão anterior: {currentVersion}
                  </span>
                </div>

                <div>
                  <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    Autor da Alteração:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser}
                    style={{
                      width: '100%',
                      background: '#0f141d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  Título da Atualização:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Novos gates do Terminal 3 e ajuste nas taxiways"
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

              <div>
                <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  Descrição detalhada das alterações:
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que foi adicionado, corrigido ou modificado no layout..."
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

              {/* Dual Images Slot */}
              <div>
                <span className="label-technical" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  📸 Prints do EuroScope (Antes & Depois):
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {/* Before */}
                  <div
                    style={{
                      border: '1px dashed rgba(239, 68, 68, 0.35)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      background: 'rgba(239, 68, 68, 0.03)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      🔴 Print ANTES
                    </span>

                    <input
                      type="file"
                      ref={newBeforeRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(file, 'newBefore');
                      }}
                    />

                    {beforeImage ? (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '110px', background: '#000' }}>
                        <img src={beforeImage} alt="Antes" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                        disabled={isProcessingImage}
                        onClick={() => newBeforeRef.current?.click()}
                        style={{
                          width: '100%',
                          height: '110px',
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
                        }}
                      >
                        <Upload size={18} color="#ef4444" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Adicionar Antes</span>
                      </button>
                    )}
                  </div>

                  {/* After */}
                  <div
                    style={{
                      border: '1px dashed rgba(16, 185, 129, 0.35)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      background: 'rgba(16, 185, 129, 0.03)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      🟢 Print DEPOIS
                    </span>

                    <input
                      type="file"
                      ref={newAfterRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(file, 'newAfter');
                      }}
                    />

                    {afterImage ? (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '110px', background: '#000' }}>
                        <img src={afterImage} alt="Depois" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                        disabled={isProcessingImage}
                        onClick={() => newAfterRef.current?.click()}
                        style={{
                          width: '100%',
                          height: '110px',
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
                        }}
                      >
                        <Upload size={18} color="#10b981" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Adicionar Depois</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                onClick={() => setViewMode('list')}
                disabled={isSaving}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  color: '#fff',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 16px rgba(0, 84, 219, 0.35)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{isSaving ? 'Publicando...' : 'Publicar Nova Versão'}</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: EDIT VERSION */}
        {viewMode === 'edit' && editingItem && (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  Título da Versão {editingItem.version}:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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

              <div>
                <label className="label-technical" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  Descrição das Alterações:
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
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

              {/* Dual Images Slot for Edit */}
              <div>
                <span className="label-technical" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  📸 Prints do EuroScope (Antes & Depois):
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {/* Before */}
                  <div
                    style={{
                      border: '1px dashed rgba(239, 68, 68, 0.35)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      background: 'rgba(239, 68, 68, 0.03)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      🔴 Print ANTES
                    </span>

                    <input
                      type="file"
                      ref={editBeforeRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(file, 'editBefore');
                      }}
                    />

                    {editBeforeImage ? (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '110px', background: '#000' }}>
                        <img src={editBeforeImage} alt="Antes" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <button
                          type="button"
                          onClick={() => setEditBeforeImage(null)}
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
                        disabled={isProcessingImage}
                        onClick={() => editBeforeRef.current?.click()}
                        style={{
                          width: '100%',
                          height: '110px',
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
                        }}
                      >
                        <Upload size={18} color="#ef4444" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Alterar Foto Antes</span>
                      </button>
                    )}
                  </div>

                  {/* After */}
                  <div
                    style={{
                      border: '1px dashed rgba(16, 185, 129, 0.35)',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      background: 'rgba(16, 185, 129, 0.03)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      🟢 Print DEPOIS
                    </span>

                    <input
                      type="file"
                      ref={editAfterRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(file, 'editAfter');
                      }}
                    />

                    {editAfterImage ? (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '110px', background: '#000' }}>
                        <img src={editAfterImage} alt="Depois" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <button
                          type="button"
                          onClick={() => setEditAfterImage(null)}
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
                        disabled={isProcessingImage}
                        onClick={() => editAfterRef.current?.click()}
                        style={{
                          width: '100%',
                          height: '110px',
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
                        }}
                      >
                        <Upload size={18} color="#10b981" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Alterar Foto Depois</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                onClick={() => setViewMode('list')}
                disabled={isSaving}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  background: 'linear-gradient(135deg, #0054DB, #1d6bf3)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  color: '#fff',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 16px rgba(0, 84, 219, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
