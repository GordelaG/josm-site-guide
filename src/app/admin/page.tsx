'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Airport, AirportStatus } from '../../types/airport';
import {
  subscribeToAirports,
  updateAirport,
  addAirportUpdate,
  editAirportUpdate,
  deleteAirportUpdate,
  calculateAirportCounts,
} from '../../lib/airports-service';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStats } from '../../components/admin/AdminStats';
import { AirportCard } from '../../components/admin/AirportCard';
import { AirportUpdateModal } from '../../components/admin/AirportUpdateModal';
import { Download, RefreshCw, Search, Sparkles, SlidersHorizontal, Radar } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [airports, setAirports] = useState<Airport[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AirportStatus>('all');
  const [selectedAirportForUpdate, setSelectedAirportForUpdate] = useState<Airport | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Redireciona para /sign-in se não estiver autenticado
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!isSignedIn) return;

    const unsubscribe = subscribeToAirports((list, isCloud) => {
      setAirports(list);
      setIsCloudConnected(isCloud);

      // Mantém o modal atualizado se o aeroporto selecionado mudar
      setSelectedAirportForUpdate((prev) => {
        if (!prev) return null;
        return list.find((a) => a.icao === prev.icao) || prev;
      });
    });

    return () => unsubscribe();
  }, [isSignedIn]);

  const counts = useMemo(() => calculateAirportCounts(airports), [airports]);

  // Filtered List
  const filteredAirports = useMemo(() => {
    return airports.filter((ap) => {
      const matchesSearch =
        ap.icao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ap.city && ap.city.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || ap.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [airports, searchQuery, statusFilter]);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status Change Handler
  const handleUpdateStatus = async (
    icao: string,
    status: AirportStatus,
    notes?: string,
    assignedTo?: string
  ) => {
    const userIdentifier = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      await updateAirport(icao, {
        status,
        updatedBy: userIdentifier,
        notes,
        assignedTo,
      });

      showToast(`Aeroporto ${icao} atualizado para "${status === 'done' ? 'Concluído' : status === 'in_progress' ? 'Em Andamento' : 'Na Fila'}"!`, 'success');
    } catch (error) {
      console.error(error);
      showToast(`Erro ao salvar ${icao}. Verifique sua conexão.`, 'error');
    }
  };

  // Save Airport Update (Changelog / Version Bump)
  const handleSaveAirportUpdate = async (
    icao: string,
    updateData: {
      version: string;
      title: string;
      description: string;
      imageUrl?: string;
      beforeImageUrl?: string;
      afterImageUrl?: string;
    }
  ) => {
    const userIdentifier = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      await addAirportUpdate(icao, {
        ...updateData,
        author: userIdentifier,
      });

      showToast(`Atualização ${updateData.version} do aeroporto ${icao} publicada com sucesso!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || `Erro ao salvar atualização de ${icao}`, 'error');
    }
  };

  // Edit Airport Update
  const handleEditAirportUpdate = async (
    icao: string,
    targetVersion: string,
    updatedData: {
      title: string;
      description: string;
      imageUrl?: string;
      beforeImageUrl?: string;
      afterImageUrl?: string;
    }
  ) => {
    const userIdentifier = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin';
    try {
      await editAirportUpdate(icao, targetVersion, {
        ...updatedData,
        author: userIdentifier,
      });
      showToast(`Nota da versão ${targetVersion} de ${icao} atualizada com sucesso!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || `Erro ao editar nota de ${icao}`, 'error');
    }
  };

  // Delete Airport Update
  const handleDeleteAirportUpdate = async (
    icao: string,
    versionToDelete: string
  ) => {
    try {
      await deleteAirportUpdate(icao, versionToDelete);
      showToast(`Nota da versão ${versionToDelete} de ${icao} excluída com sucesso!`, 'info');
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || `Erro ao deletar nota de ${icao}`, 'error');
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 0%, #101626 0%, #0c1017 100%)',
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img src="/josm_logo.png" alt="JOSM Logo" style={{ height: '48px', margin: '0 auto 1.5rem', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 600 }}>
            Verificando credenciais de acesso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #101626 0%, #0c1017 100%)',
        position: 'relative',
      }}
    >
      {/* Ambient Grid Drift */}
      <div className="grid-drift" style={{ position: 'fixed', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      <AdminHeader isCloudConnected={isCloudConnected} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            background:
              toastMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.95)'
                : toastMessage.type === 'error'
                ? 'rgba(239, 68, 68, 0.95)'
                : 'rgba(0, 84, 219, 0.95)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            fontSize: '0.85rem',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fade-up 0.3s ease',
          }}
        >
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modal de Atualização de Versão */}
      <AirportUpdateModal
        airport={selectedAirportForUpdate}
        isOpen={Boolean(selectedAirportForUpdate)}
        onClose={() => setSelectedAirportForUpdate(null)}
        onSaveUpdate={handleSaveAirportUpdate}
        onEditUpdate={handleEditAirportUpdate}
        onDeleteUpdate={handleDeleteAirportUpdate}
        currentUser={user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin'}
      />

      <main
        style={{
          maxWidth: '1560px',
          margin: '0 auto',
          padding: '2.5rem 2rem 5rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Title and Top Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Radar size={20} color="#38bdf8" />
            <span className="label-technical" style={{ color: '#38bdf8' }}>
              Gestão de Vetorização &bull; VATSIM Brasil
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              fontStyle: 'italic',
              color: '#fff',
              margin: '0 0 0.5rem 0',
            }}
          >
            Painel de Controle Operacional
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '780px' }}>
            Gerencie o ciclo de vida dos aeródromos brasileiros, altere status em tempo real e publique notas de versão com imagens comparativas de antes e depois.
          </p>
        </div>

        {/* Top Metrics Cards (AdminStats) */}
        <AdminStats counts={counts} />

        {/* Toolbar: Search and Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
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
              placeholder="Buscar por ICAO (ex: SBGR), nome ou cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Filter Pill Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              padding: '0.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
            }}
          >
            {[
              { id: 'all', label: `Todos (${counts.total})` },
              { id: 'done', label: `Concluídos (${counts.done})` },
              { id: 'in_progress', label: `Em Andamento (${counts.in_progress})` },
              { id: 'pending', label: `Na Fila (${counts.pending})` },
            ].map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id as any)}
                  style={{
                    background: isActive ? '#0054DB' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 84, 219, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Airports Grid */}
        {filteredAirports.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredAirports.map((airport) => (
              <AirportCard
                key={airport.icao}
                airport={airport}
                onUpdateStatus={handleUpdateStatus}
                onOpenUpdateModal={(ap) => setSelectedAirportForUpdate(ap)}
              />
            ))}
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              borderRadius: '16px',
            }}
          >
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Nenhum aeroporto encontrado para o filtro aplicado.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              style={{
                background: '#0054DB',
                border: 'none',
                color: '#fff',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
