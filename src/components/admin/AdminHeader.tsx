'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton, useUser, useClerk } from '@clerk/nextjs';
import { ArrowLeft, LogOut, Radar, History, Shield } from 'lucide-react';

interface AdminHeaderProps {
  isCloudConnected: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ isCloudConnected }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '72px',
        background: 'rgba(12, 16, 23, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          maxWidth: '1560px',
          margin: '0 auto',
          height: '100%',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/josm_logo.png"
              alt="JOSM Ground Guide"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255, 255, 255, 0.75)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <ArrowLeft size={14} />
            <span>Guia Principal</span>
          </Link>

          <Link
            href="/atualizacoes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255, 255, 255, 0.75)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <History size={14} color="#38bdf8" />
            <span>Changelog</span>
          </Link>

          {/* User Profile & Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '0.75rem',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {user && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'right',
                  lineHeight: '1.2',
                }}
              >
                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff' }}>
                  {user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Administrador'}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  VATSIM BRASIL
                </span>
              </div>
            )}

            <UserButton afterSignOutUrl="/" />

            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              title="Encerrar sessão"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ff7b72',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
            >
              <LogOut size={13} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
